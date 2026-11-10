import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import {
  ARSDirectoryManagementContent,
  ARSNewObjectContent,
  ARSNewObjectTemplate,
  ARS_EMPTY_NEW_OBJECT_VALUES,
  type ARSNewObjectValues,
} from '@ars';
import { cx } from '../../../lib/cx.js';
import { useDirectory } from '../../../lib/directoryStore.js';
import type { DirectoryNodeView } from '../../../lib/directoryData.js';
import { Button } from '../../../components/Button/Button.js';
import { SideSheet } from '../../../components/SideSheet/SideSheet.js';
import type { StepperStepItem } from '../../../components/Stepper/Stepper.js';
import type { TreeNode } from '../../../components/Tree/Tree.js';
import type { CreateObjectResult } from './createdObject.js';
import styles from './CreateObjectModal.module.css';

export type { CreateObjectResult } from './createdObject.js';

export interface CreateObjectModalProps {
  open: boolean;
  onClose: () => void;
  /** Object kind being created, e.g. "User". Drives the header title. */
  objectType: string;
  /** Header icon (24px). */
  icon: string;
  /** Header subtitle when no folder is chosen — where the object will be created. */
  location?: string;
  /** Directory node the object goes in by default. */
  locationId?: string | null;
  /** Called with the entered values when the user creates the object. */
  onCreate?: (result: CreateObjectResult) => void;
}

const STEPS: StepperStepItem[] = [
  { id: 'general', label: 'General' },
  { id: 'account', label: 'Account' },
];

function toTreeNode(node: DirectoryNodeView): TreeNode {
  return {
    id: node.id,
    label: node.name,
    icon: node.icon ?? 'Folder',
    openIcon: node.icon ?? 'FolderOpen',
    children: node.children.map(toTreeNode),
    separatorBefore: node.id === 'managed-directories',
  };
}

/**
 * CreateObjectModal — two-step "New object" flow (ARS_New_Object_Template):
 * General collects identity fields, Account collects the password and account
 * options. "Select destination folder" opens the Select folder side sheet.
 */
export function CreateObjectModal({
  open,
  onClose,
  objectType,
  icon,
  location = 'Directory Management / Users',
  locationId = null,
  onCreate,
}: CreateObjectModalProps) {
  const { nodeTree, getPath } = useDirectory();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<ARSNewObjectValues>(ARS_EMPTY_NEW_OBJECT_VALUES);
  const [accountOptions, setAccountOptions] = useState<ReadonlySet<string>>(() => new Set(['User must change password at next login']));
  const [destinationId, setDestinationId] = useState<string | null>(locationId);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetChoice, setSheetChoice] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(open);

  // Reset the flow whenever the modal (re)opens.
  useEffect(() => {
    if (open) {
      setStep(0);
      setValues(ARS_EMPTY_NEW_OBJECT_VALUES);
      setDestinationId(locationId);
      setSheetOpen(false);
    }
  }, [open, locationId]);

  // Keep mounted through the close transition.
  useEffect(() => {
    if (open) {
      setMounted(true);
      return undefined;
    }
    const t = setTimeout(() => setMounted(false), 200);
    return () => clearTimeout(t);
  }, [open]);

  // The side sheet handles its own Escape; the modal must not close underneath it.
  const sheetOpenRef = useRef(false);
  sheetOpenRef.current = sheetOpen;
  useFocusTrap(open, dialogRef, () => {
    if (!sheetOpenRef.current) onClose();
  });

  const nodes = useMemo(() => nodeTree.map(toTreeNode), [nodeTree]);
  const locationLabel = destinationId
    ? getPath(destinationId).map((n) => n.name).join(' / ')
    : location;

  if (!mounted) return null;

  const setV = (patch: Partial<ARSNewObjectValues>) => setValues((p) => ({ ...p, ...patch }));

  const isLast = step === STEPS.length - 1;
  const anyGeneralValue = [
    values.firstName,
    values.lastName,
    values.initials,
    values.name,
    values.displayName,
    values.userLogonName,
    values.suffix,
    values.preWindows2000,
  ].some((v) => v.trim() !== '');
  const footerVariant = isLast ? '2' : anyGeneralValue ? '1_complete' : '1';

  // Reached steps are clickable; the next one opens once this step is complete.
  const steps = STEPS.map((s, i) => ({
    ...s,
    disabled: i > step && !(i === step + 1 && anyGeneralValue),
  }));

  const create = () => {
    onCreate?.({ objectType, values, locationId: destinationId, locationLabel });
    onClose();
  };

  const openSheet = () => {
    setSheetChoice(destinationId);
    setSheetOpen(true);
  };

  const sheetFor = values.displayName.trim() || `${values.firstName} ${values.lastName}`.trim() || `this ${objectType.toLowerCase()}`;

  return (
    <>
      {createPortal(
        <div className={cx(styles.scrim, open && styles.scrimOpen)} onClick={onClose}>
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`New ${objectType}`}
            className={cx(styles.dialog, open && styles.dialogOpen)}
            onClick={(e) => e.stopPropagation()}
          >
            <ARSNewObjectTemplate
              title={`New ${objectType}`}
              location={locationLabel}
              icon={icon}
              steps={steps}
              activeIndex={step}
              interactiveSteps
              onStepSelect={setStep}
              footerVariant={footerVariant}
              onClose={onClose}
              onBack={() => setStep(0)}
              onContinue={isLast ? create : () => setStep(1)}
            >
              <ARSNewObjectContent
                variant={isLast ? 'Variant2' : 'Default'}
                showFolderButton
                values={values}
                onValuesChange={setV}
                accountOptions={accountOptions}
                onAccountOptionsChange={setAccountOptions}
                onSelectFolder={openSheet}
              />
            </ARSNewObjectTemplate>
          </div>
        </div>,
        document.body,
      )}

      <SideSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Select folder"
        subtitle={`Browse and select a destination folder for ${sheetFor}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSheetOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!sheetChoice}
              onClick={() => {
                setDestinationId(sheetChoice);
                setSheetOpen(false);
              }}
            >
              Select
            </Button>
          </>
        }
      >
        <ARSDirectoryManagementContent
          variant="tree"
          nodes={nodes}
          selectedId={sheetChoice}
          onSelect={setSheetChoice}
          defaultExpandedIds={sheetChoice ? getPath(sheetChoice).map((n) => n.id) : []}
        />
      </SideSheet>
    </>
  );
}

// ---------------------------------------------------------------------------
// Focus trap + scroll lock + ESC — mirrors the shared Modal behavior.
// ---------------------------------------------------------------------------

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function useFocusTrap(open: boolean, dialogRef: RefObject<HTMLElement | null>, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // The first field, not the header's close button.
    const focusTimer = requestAnimationFrame(() => {
      const target =
        dialogRef.current?.querySelector<HTMLElement>('input:not([disabled])') ??
        dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      target?.focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusables = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = originalOverflow;
      cancelAnimationFrame(focusTimer);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open, dialogRef]);
}
