import { useState, type Ref } from 'react';
import { cx } from '@iris/lib/cx.js';
import { IconButton } from '@iris/components/IconButton/IconButton.js';
import { Menu } from '@iris/components/Menu/Menu.js';
import { Select } from '@iris/components/Select/Select.js';
import styles from './QuerySyntax.module.css';

export interface QuerySyntaxOption {
  id: string;
  /** Shown in the select, e.g. "LDAP". */
  label: string;
  code: string;
}

export interface QuerySyntaxProps {
  syntaxes: QuerySyntaxOption[];
  /** Id of the syntax to show. Defaults to the first. */
  value?: string;
  onChange?: (id: string) => void;
  className?: string;
}

/**
 * QuerySyntax — the Advanced filter as query text: a syntax select above a read-only code block
 * with line numbers and a copy button. Figma: Iris UI Kit "Query syntax" panel 10012:4232.
 */
export function QuerySyntax({ syntaxes, value, onChange, className }: QuerySyntaxProps) {
  const [copied, setCopied] = useState(false);
  const current = syntaxes.find((s) => s.id === value) ?? syntaxes[0];
  if (!current) return null;
  const lines = current.code.split('\n');

  const copy = async () => {
    await navigator.clipboard?.writeText(current.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={cx(styles.root, className)}>
      <Menu
        ariaLabel="Query syntax"
        align="start"
        items={syntaxes.map((s) => ({
          kind: 'item',
          label: s.label,
          selected: s.id === current.id,
          onSelect: () => onChange?.(s.id),
        }))}
        trigger={({ ref, onClick, expanded }) => (
          <Select
            ref={ref as Ref<HTMLButtonElement>}
            label={current.label}
            aria-haspopup="menu"
            aria-expanded={expanded}
            onClick={onClick}
          />
        )}
      />
      <div className={styles.code}>
        <div className={styles.scroll}>
          <ol className={styles.numbers} aria-hidden="true">
            {lines.map((_, i) => (
              <li key={i}>{i + 1}</li>
            ))}
          </ol>
          <pre className={styles.text} tabIndex={0} aria-label={`${current.label} query`}>
            {current.code}
          </pre>
        </div>
        <IconButton
          icon={copied ? 'Check' : 'CopySimple'}
          ariaLabel={copied ? 'Copied' : 'Copy query'}
          size="s"
          variant="ghost"
          className={styles.copy}
          onClick={copy}
        />
      </div>
    </div>
  );
}
