import { useEffect, useState } from 'react';
import { BrandLogo } from '../../components/BrandLogo/BrandLogo.js';
import { Button } from '../../components/Button/Button.js';
import { Checkbox } from '../../components/Checkbox/Checkbox.js';
import { Link } from '../../components/Link/Link.js';
import { navigate, personaHash } from '../../lib/router.js';
import {
  loadReviewNotes,
  parseInline,
  reviewFile,
  setReviewTask,
  type ReviewFlow,
  type ReviewSource,
  type ReviewTask,
} from '../../lib/reviewNotes.js';
import { useFixedTheme } from '../../lib/useTheme.js';
import styles from './ReviewTasksPage.module.css';

/** `persona` makes in-app links (`#/users`) open as that persona: `#/admin-user/users`. */
function Inline({ markdown, persona }: { markdown: string; persona: string }) {
  return (
    <>
      {parseInline(markdown).map((part, i) => {
        if (part.kind === 'bold') return <strong key={i}>{part.text}</strong>;
        if (part.kind === 'code') return <code key={i} className={styles.code}>{part.text}</code>;
        if (part.kind === 'link') {
          const href = part.href.startsWith('#/') ? personaHash(persona, part.href) : part.href;
          return (
            <Link key={i} href={href} target="_blank" rel="noopener noreferrer">
              {part.text}
            </Link>
          );
        }
        return <span key={i}>{part.text}</span>;
      })}
    </>
  );
}

const TITLES: Record<ReviewSource, string> = { tasks: 'Design review tasks', 'tidy-up': 'Figma tidy-up' };

/**
 * ReviewTasksPage — a review checklist from a markdown file in docs/, by
 * section: the flow tasks (docs/review-notes.md) or the Figma tidy-up
 * (docs/figma-tidy-up.md). While the dev server runs, ticking an item edits that file.
 */
export function ReviewTasksPage({ source = 'tasks' }: { source?: ReviewSource }) {
  useFixedTheme('dark');
  const file = reviewFile(source);
  const [flows, setFlows] = useState<ReviewFlow[] | null>(null);
  const [writable, setWritable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    loadReviewNotes(source).then((notes) => {
      if (!alive) return;
      setFlows(notes.flows);
      setWritable(notes.writable);
    });
    return () => {
      alive = false;
    };
  }, [source]);

  const toggle = async (task: ReviewTask, checked: boolean) => {
    setError(null);
    // Show the tick at once; the file's own answer replaces it.
    setFlows((current) =>
      current?.map((f) => ({
        ...f,
        groups: f.groups.map((g) => ({ ...g, tasks: g.tasks.map((t) => (t.line === task.line ? { ...t, checked } : t)) })),
      })) ?? null,
    );
    try {
      const saved = await setReviewTask(task, checked, writable, source);
      if (saved) setFlows(saved);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save.');
      setFlows((await loadReviewNotes(source)).flows);
    }
  };

  const tasks = flows?.flatMap((f) => f.groups.flatMap((g) => g.tasks)) ?? [];
  const done = tasks.filter((t) => t.checked).length;

  return (
    <div className={styles.page}>
      <div className={styles.topStart}>
        <Button variant="secondary" iconLead="ArrowLeft" onClick={() => navigate('#/components-to-review')}>
          Back
        </Button>
      </div>
      <main className={styles.content}>
        <header className={styles.intro}>
          <span className={styles.product}>
            <BrandLogo size="32px" />
            Active Roles
          </span>
          <h1 className={styles.title}>{TITLES[source]}</h1>
          <p className={styles.subtitle}>
            {flows ? `${done} of ${tasks.length} done. ` : ''}
            {writable
              ? `Ticking an item updates ${file}.`
              : `This copy of the app can’t write ${file}, so ticks are kept in this browser only.`}
          </p>
          {error && <p className={styles.error} role="alert">{error}</p>}
        </header>

        {flows?.map((flow) => (
          <section key={flow.title} className={styles.flow} aria-label={flow.title}>
            <h2 className={styles.flowTitle}>{flow.title}</h2>
            {flow.where && (
              <p className={styles.where}>
                <Inline markdown={`Where: ${flow.where.replace(/^Where:\s*/, '')}`} persona={flow.persona} />
              </p>
            )}
            {flow.groups.map((group) => (
              <div key={group.title} className={styles.group}>
                <h3 className={styles.groupTitle}>{group.title}</h3>
                <ul className={styles.tasks}>
                  {group.tasks.map((task) => (
                    <li key={task.line} className={styles.task}>
                      <Checkbox
                        checked={task.checked}
                        onChange={(on) => toggle(task, on)}
                        ariaLabel={task.text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*`]/g, '')}
                      />
                      <span className={task.checked ? styles.done : undefined}>
                        <Inline markdown={task.text} persona={flow.persona} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </main>
    </div>
  );
}
