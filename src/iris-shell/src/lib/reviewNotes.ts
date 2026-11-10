import bundledNotes from '../../../../docs/review-notes.md?raw';

export interface ReviewTask {
  /** Zero-based line in docs/review-notes.md. */
  line: number;
  checked: boolean;
  /** The task as markdown. */
  text: string;
}

export interface ReviewGroup {
  title: string;
  tasks: ReviewTask[];
}

export interface ReviewFlow {
  title: string;
  /** The "Where:" line under the heading, as markdown. */
  where?: string;
  groups: ReviewGroup[];
}

export interface ReviewNotes {
  flows: ReviewFlow[];
  /** Whether ticking an item is written to docs/review-notes.md (only while running locally). */
  writable: boolean;
}

const ENDPOINT = '/__review-notes';
const LOCAL_KEY = 'ars.reviewTasks';

const TASK = /^- \[( |x)\] (.*)$/;

/** Turns the markdown into flows (## headings), groups (### headings) and tasks. */
export function parseReviewNotes(markdown: string): ReviewFlow[] {
  const flows: ReviewFlow[] = [];
  markdown.split('\n').forEach((raw, line) => {
    if (raw.startsWith('## ')) {
      flows.push({ title: raw.slice(3).trim(), groups: [] });
      return;
    }
    const flow = flows[flows.length - 1];
    if (!flow) return;
    if (raw.startsWith('### ')) {
      flow.groups.push({ title: raw.slice(4).trim(), tasks: [] });
      return;
    }
    if (raw.startsWith('Where:')) {
      flow.where = raw.slice('Where:'.length).trim();
      return;
    }
    const task = TASK.exec(raw);
    const group = flow.groups[flow.groups.length - 1];
    if (task && group) group.tasks.push({ line, checked: task[1] === 'x', text: task[2] });
  });
  return flows;
}

function readLocal(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '{}') as Record<string, boolean>;
  } catch {
    return {};
  }
}

/** The tasks from the file when the dev server is running, else from the copy built into the app. */
export async function loadReviewNotes(): Promise<ReviewNotes> {
  try {
    const res = await fetch(ENDPOINT);
    if (!res.ok || !(res.headers.get('Content-Type') ?? '').startsWith('text/plain')) throw new Error('no endpoint');
    return { flows: parseReviewNotes(await res.text()), writable: true };
  } catch {
    const local = readLocal();
    const flows = parseReviewNotes(bundledNotes);
    for (const flow of flows) {
      for (const group of flow.groups) {
        for (const task of group.tasks) task.checked = local[task.text] ?? task.checked;
      }
    }
    return { flows, writable: false };
  }
}

/** Ticks or unticks a task: in the file when writable, else in this browser only. */
export async function setReviewTask(task: ReviewTask, checked: boolean, writable: boolean): Promise<ReviewFlow[] | null> {
  if (!writable) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify({ ...readLocal(), [task.text]: checked }));
    return null;
  }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ line: task.line, checked }),
  });
  if (!res.ok) throw new Error(await res.text());
  return parseReviewNotes(await res.text());
}

export type InlinePart =
  | { kind: 'text'; text: string }
  | { kind: 'bold'; text: string }
  | { kind: 'code'; text: string }
  | { kind: 'link'; text: string; href: string };

/** The few markdown forms the notes use: **bold**, `code` and [text](url). */
export function parseInline(markdown: string): InlinePart[] {
  const parts: InlinePart[] = [];
  const pattern = /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  for (const m of markdown.matchAll(pattern)) {
    if (m.index > last) parts.push({ kind: 'text', text: markdown.slice(last, m.index) });
    if (m[1] !== undefined) parts.push({ kind: 'bold', text: m[1] });
    else if (m[2] !== undefined) parts.push({ kind: 'code', text: m[2] });
    else parts.push({ kind: 'link', text: m[3], href: m[4] });
    last = m.index + m[0].length;
  }
  if (last < markdown.length) parts.push({ kind: 'text', text: markdown.slice(last) });
  return parts;
}
