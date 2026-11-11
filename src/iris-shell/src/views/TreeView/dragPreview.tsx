import type { DragEvent } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { ARSElementDragged } from '@ars';

/** Replaces the browser's drag image with the Element-Dragged chip. */
export function setDragPreview(event: DragEvent, variant: 'Directory folder' | 'User', label: string): void {
  const host = document.createElement('div');
  // Off-screen, but rendered, so the browser can take its picture.
  host.style.cssText = 'position:fixed;top:-1000px;left:-1000px;';
  document.body.appendChild(host);
  const root = createRoot(host);
  flushSync(() => root.render(<ARSElementDragged variant={variant} label={label} />));
  event.dataTransfer.setDragImage(host, 8, 12);
  setTimeout(() => {
    root.unmount();
    host.remove();
  }, 0);
}
