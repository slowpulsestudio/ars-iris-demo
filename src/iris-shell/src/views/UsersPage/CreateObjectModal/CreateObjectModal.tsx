import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ARSDirectoryManagementContent,
  ARSNewObjectContent,
  ARSNewObjectTemplate,
  ARS_EMPTY_NEW_OBJECT_VALUES,
  type ARSNewObjectValues,
} from '@ars';
import { useDirectory } from '../../../lib/directoryStore.js';
import type { DirectoryNodeView } from '../../../lib/directoryData.js';
import { Button } from '../../../components/Button/Button.js';
import { SideSheet } from '../../../components/SideSheet/SideSheet.js';
import type { StepperStepItem } from '../../../components/Stepper/Stepper.js';
import type { TreeNode } from '../../../components/Tree/Tree.js';
import { ModalOverlay } from '../../ModalOverlay/ModalOverlay.js';
import type { CreateObjectResult } from './createdObject.js';

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
  const [accountOptions, setAccountOptions] = useState<ReadonlySet<string>>(
    () => new Set(['User must change password at next login']),
  );
  const [destinationId, setDestinationId] = useState<string | null>(locationId);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetChoice, setSheetChoice] = useState<string | null>(null);

  // Reset the flow whenever the modal (re)opens.
  useEffect(() => {
    if (open) {
      setStep(0);
      setValues(ARS_EMPTY_NEW_OBJECT_VALUES);
      setDestinationId(locationId);
      setSheetOpen(false);
    }
  }, [open, locationId]);

  // The side sheet handles its own Escape; the modal must not close underneath it.
  const sheetOpenRef = useRef(false);
  sheetOpenRef.current = sheetOpen;

  const nodes = useMemo(() => nodeTree.map(toTreeNode), [nodeTree]);
  const locationLabel = destinationId ? getPath(destinationId).map((n) => n.name).join(' / ') : location;

  const setV = (patch: Partial<ARSNewObjectValues>) => setValues((p) => ({ ...p, ...patch }));

  const isLast = step === STEPS.length - 1;
  // The fields Figma marks Required; step 1 is complete once all have a value.
  const generalComplete = [
    values.firstName,
    values.lastName,
    values.name,
    values.displayName,
    values.userLogonName,
    values.preWindows2000,
  ].every((v) => v.trim() !== '');
  const footerVariant = isLast ? '2' : generalComplete ? '1_complete' : '1';

  // Reached steps are clickable; the next one opens once this step is complete.
  const steps = STEPS.map((s, i) => ({
    ...s,
    disabled: i > step && !(i === step + 1 && generalComplete),
  }));

  const create = () => {
    onCreate?.({ objectType, values, locationId: destinationId, locationLabel });
    onClose();
  };

  const openSheet = () => {
    setSheetChoice(destinationId);
    setSheetOpen(true);
  };

  const sheetFor =
    values.displayName.trim() || `${values.firstName} ${values.lastName}`.trim() || `this ${objectType.toLowerCase()}`;

  return (
    <>
      <ModalOverlay
        open={open}
        label={`New ${objectType}`}
        onClose={() => {
          if (!sheetOpenRef.current) onClose();
        }}
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
      </ModalOverlay>

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
