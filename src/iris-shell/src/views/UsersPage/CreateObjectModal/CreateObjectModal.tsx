import { useEffect, useRef, useState } from 'react';
import {
  ARSNewObjectContent,
  ARSNewObjectTemplate,
  ARS_EMPTY_NEW_OBJECT_VALUES,
  type ARSNewObjectValues,
} from '@ars';
import { useDirectory } from '../../../lib/directoryStore.js';
import { useStepFlow } from '../../../lib/useStepFlow.js';
import type { StepperStepItem } from '../../../components/Stepper/Stepper.js';
import { ModalOverlay } from '../../ModalOverlay/ModalOverlay.js';
import { SelectFolderSheet } from '../../SelectFolderSheet/SelectFolderSheet.js';
import { SELECT_FOLDER_STEP, SelectFolderStep } from '../../SelectFolderStep/SelectFolderStep.js';
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
  /** An Entra object: Entra has no location, so no folder is chosen and none is shown. */
  entra?: boolean;
  /** Called with the entered values when the user creates the object. */
  onCreate?: (result: CreateObjectResult) => void;
}

const STEPS: StepperStepItem[] = [
  { id: 'general', label: 'General' },
  { id: 'account', label: 'Account' },
];

/**
 * CreateObjectModal — the "New object" flow (ARS_New_Object_Template): General collects identity fields,
 * Account the password and account options. A new AD user then picks its folder in a Select folder step
 * (Figma 3651:20393); other objects open the Select folder side sheet from "Select destination folder".
 */
export function CreateObjectModal({
  open,
  onClose,
  objectType,
  icon,
  location = 'Directory Management / Users',
  locationId = null,
  entra = false,
  onCreate,
}: CreateObjectModalProps) {
  const { getPath } = useDirectory();
  // You asked for the folder as a step for new AD users; Entra objects have no location.
  const folderStep = !entra && objectType === 'AD User';
  const stepItems = folderStep ? [...STEPS, SELECT_FOLDER_STEP] : STEPS;
  const [values, setValues] = useState<ARSNewObjectValues>(ARS_EMPTY_NEW_OBJECT_VALUES);
  const [accountOptions, setAccountOptions] = useState<ReadonlySet<string>>(
    () => new Set(['User must change password at next login']),
  );
  const [destinationId, setDestinationId] = useState<string | null>(locationId);
  const [sheetOpen, setSheetOpen] = useState(false);

  // The fields Figma marks Required; step 1 is complete once all have a value.
  const generalComplete = [
    values.firstName,
    values.lastName,
    values.name,
    values.displayName,
    values.userLogonName,
    values.preWindows2000,
  ].every((v) => v.trim() !== '');
  const { step, steps, goTo, reset, last } = useStepFlow(stepItems, generalComplete);

  // Reset the flow whenever the modal (re)opens.
  useEffect(() => {
    if (open) {
      reset();
      setValues(ARS_EMPTY_NEW_OBJECT_VALUES);
      setDestinationId(locationId);
      setSheetOpen(false);
    }
  }, [open, locationId, reset]);

  // The side sheet handles its own Escape; the modal must not close underneath it.
  const sheetOpenRef = useRef(false);
  sheetOpenRef.current = sheetOpen;

  const locationLabel = entra ? '' : destinationId ? getPath(destinationId).map((n) => n.name).join(' / ') : location;

  const setV = (patch: Partial<ARSNewObjectValues>) => setValues((p) => ({ ...p, ...patch }));

  const create = () => {
    onCreate?.({ objectType, values, locationId: destinationId, locationLabel, entra });
    onClose();
  };

  const objectName =
    values.displayName.trim() || `${values.firstName} ${values.lastName}`.trim() || `this ${objectType.toLowerCase()}`;

  const formProps = { values, onValuesChange: setV, accountOptions, onAccountOptionsChange: setAccountOptions };
  const stepContents = [
    <ARSNewObjectContent
      key="general"
      {...formProps}
      showFolderButton={!entra && !folderStep}
      onSelectFolder={() => setSheetOpen(true)}
    />,
    <ARSNewObjectContent key="account" variant="Variant2" {...formProps} />,
    ...(folderStep
      ? [
          <ARSNewObjectContent key={SELECT_FOLDER_STEP.id}>
            <SelectFolderStep objectName={objectName} destinationId={destinationId} onSelect={setDestinationId} />
          </ARSNewObjectContent>,
        ]
      : []),
  ];

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
          onStepSelect={goTo}
          // Figma keeps the body 729px tall; it is as tall as the tallest step instead (decided UI rule MOD-1).
          fitContent
          stepContents={stepContents}
          footerVariant={step > 0 ? '2' : generalComplete ? '1_complete' : '1'}
          ctaLabel={!last && step > 0 ? 'Save and continue →' : undefined}
          onClose={onClose}
          onBack={() => goTo(step - 1)}
          onContinue={last ? create : () => goTo(step + 1)}
        />
      </ModalOverlay>

      {!entra && !folderStep && (
        <SelectFolderSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          objectName={objectName}
          initialId={destinationId}
          onSelect={setDestinationId}
        />
      )}
    </>
  );
}
