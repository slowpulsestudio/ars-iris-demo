import { Fragment, useEffect, useRef, useState } from 'react';
import { ARSNewObjectContent, ARSNewObjectTemplate, FormInput } from '@ars';
import { Button } from '../../components/Button/Button.js';
import { Icon } from '../../components/Icon/Icon.js';
import { Toggle } from '../../components/Toggle/Toggle.js';
import { Tooltip } from '../../components/Tooltip/Tooltip.js';
import type { StepperStepItem } from '../../components/Stepper/Stepper.js';
import { addObject, OBJECT_TYPE_META, type DirectoryObject } from '../../lib/directoryData.js';
import { useDirectory } from '../../lib/directoryStore.js';
import { GROUP_SCOPES, GROUP_TYPES, saveGroupProps } from '../../lib/groupDetailsStore.js';
import { showToast } from '../../lib/toastStore.js';
import { ModalOverlay } from '../ModalOverlay/ModalOverlay.js';
import { SelectFolderSheet } from '../SelectFolderSheet/SelectFolderSheet.js';
import styles from './CreateGroupModal.module.css';

export type CreateGroupKind = 'AD' | 'Entra';

const STEPS: StepperStepItem[] = [
  { id: 'general', label: 'General' },
  { id: 'exchange', label: 'Exchange options' },
];
const EMAIL_DOMAINS = ['@contoso.com', '@contoso.onmicrosoft.com'];
/** Figma's info icons carry no text, as on the New User form. */
const INFO = 'More information';
/** Figma's "0/100" on Group description. */
const DESCRIPTION_LIMIT = 100;
/** The part of the tree each kind of group can be created in. */
const ROOT: Record<CreateGroupKind, string> = { AD: 'active-directories', Entra: 'entra-directories' };

const JOIN_TIP = { on: 'Anyone can join this group without owner approval', off: 'Only group owners can add members. All requests to join will be automatically declined' };
const LEAVE_TIP = { on: 'Anyone can leave this group without owner approval', off: 'Only group owners can add members. All requests to leave will be automatically declined' };

interface Form {
  name: string;
  groupName: string;
  displayName: string;
  description: string;
  scope: string;
  type: string;
  exchange: boolean;
  smtp: string;
  smtpDomain: string;
  hideFromList: boolean;
  join: boolean;
  leave: boolean;
}

const EMPTY: Form = {
  name: '',
  groupName: '',
  displayName: '',
  description: '',
  // Figma's dropdowns show Global and Distribution (2109:10097).
  scope: GROUP_SCOPES[1],
  type: GROUP_TYPES[1],
  exchange: false,
  smtp: '',
  smtpDomain: EMAIL_DOMAINS[0],
  hideFromList: false,
  // The draft shows Joining group Open and Leaving group Closed (2109:10890).
  join: true,
  leave: false,
};

export interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  /** New AD Group (General, then Exchange options) or New Entra Distribution Group (one form). */
  kind: CreateGroupKind;
  /** The folder the group goes in unless another is chosen. */
  locationId: string;
}

/**
 * CreateGroupModal — New AD Group as ARS_WebUI2_Groups draws it (General 2109:10097, Exchange options
 * 2112:12077), and New Entra Distribution Group from its written requirement (2113:12494) in the draft's
 * layout (2109:10890), since the Entra template (2109:11016) still holds the generic user form.
 */
export function CreateGroupModal({ open, onClose, kind, locationId }: CreateGroupModalProps) {
  const { getPath } = useDirectory();
  const [form, setForm] = useState<Form>(EMPTY);
  const [step, setStep] = useState(0);
  const [destinationId, setDestinationId] = useState(locationId);
  const [sheetOpen, setSheetOpen] = useState(false);
  // The side sheet handles its own Escape; the modal must not close underneath it.
  const sheetOpenRef = useRef(false);
  sheetOpenRef.current = sheetOpen;

  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setStep(0);
      setDestinationId(locationId);
      setSheetOpen(false);
    }
  }, [open, locationId]);

  const set = <K extends keyof Form>(key: K) => (value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));
  const ad = kind === 'AD';
  const title = ad ? 'New AD Group' : 'New Entra Distribution Group';
  const locationLabel = getPath(destinationId).map((n) => n.name).join(' / ');
  const name = form.name.trim();
  const generalComplete = ad ? !!name && !!form.groupName.trim() : !!name;
  const last = !ad || step === 1;
  // Reached steps are clickable; the next one opens once this step is complete.
  const steps = STEPS.map((s, i) => ({ ...s, disabled: i > step && !(i === step + 1 && generalComplete) }));

  const create = () => {
    const display = ad ? name : form.displayName.trim() || name;
    const id = `group-new-${Date.now()}`;
    const object: DirectoryObject = {
      id,
      name: display,
      type: 'group',
      description: form.description,
      parentId: destinationId,
      isContainer: false,
      details: { description: form.description, displayName: display, location: locationLabel, memberCount: 0, created: new Date().toISOString().slice(0, 10) },
    };
    addObject(destinationId, object);
    const email = ad
      ? undefined
      : form.smtp.trim()
        ? `${form.smtp.trim()}${form.smtpDomain}`
        : `${display.toLowerCase().replace(/\s+/g, '.')}${form.smtpDomain}`;
    saveGroupProps(id, {
      groupName: ad ? form.groupName.trim() : display,
      scope: ad ? form.scope : 'Universal',
      type: ad ? form.type : 'Distribution',
      ...(email && { email }),
    });
    showToast(`${display} successfully created`, {
      supportingText: `${OBJECT_TYPE_META.group.label} created in ${locationLabel}. To open it, click View.`,
      viewHref: `#/tree/${destinationId}/${id}`,
    });
    onClose();
  };

  // A wrapper keeps the button its own width in the form column, which stretches its children.
  const folderButton = (
    <div>
      <Button variant="secondary" iconLead="FolderOpen" onClick={() => setSheetOpen(true)}>
        Select destination folder
      </Button>
    </div>
  );

  const toggle = (label: string, value: boolean, onChange: (v: boolean) => void, tip: { on: string; off: string }) => (
    <div className={styles.toggleRow}>
      <Toggle checked={value} onChange={onChange} label={`${label}, ${value ? 'Open' : 'Closed'}`} />
      <Tooltip label={value ? tip.on : tip.off}>
        <span className={styles.info} role="img" aria-label="More info" tabIndex={0}>
          <Icon name="Info" size="20px" />
        </span>
      </Tooltip>
    </div>
  );

  // Each step gets its own key so its fields mount fresh: the read-only ones are uncontrolled.
  const fields = ad ? (
    step === 0 ? (
      <Fragment key="general">
        <FormInput label="Group name" required value={form.name} onChange={set('name')} />
        <FormInput label="Group name (Pre-Windows 2000)" required info={INFO} value={form.groupName} onChange={set('groupName')} />
        <FormInput
          label="Group description"
          info={INFO}
          multiline
          maxLength={DESCRIPTION_LIMIT}
          value={form.description}
          onChange={set('description')}
        />
        <FormInput label="Group scope" required info={INFO} select options={GROUP_SCOPES} value={form.scope} onChange={set('scope')} />
        <FormInput label="Group type" required info={INFO} select options={GROUP_TYPES} value={form.type} onChange={set('type')} />
        {folderButton}
      </Fragment>
    ) : (
      <Fragment key="exchange">
        <FormInput
          label="Create an Exchange e-mail address"
          checkbox
          value={String(form.exchange)}
          onChange={(v) => set('exchange')(v === 'true')}
        />
        {/* Both are read-only in the written requirement (2111:11198); Figma's sample is "Security members". */}
        <FormInput label="Alias" value={name} disabled />
        <FormInput label="Associated administrative group" value={name ? `${name} members` : ''} disabled />
      </Fragment>
    )
  ) : (
    <>
      <FormInput label="Name" required value={form.name} onChange={set('name')} />
      <FormInput label="Display name" value={form.displayName} onChange={set('displayName')} />
      <FormInput label="Description" value={form.description} onChange={set('description')} />
      <div className={styles.row}>
        <FormInput label="Primary SMTP address" info="Leave blank for the default value" value={form.smtp} onChange={set('smtp')} />
        <FormInput label="Domain" select options={EMAIL_DOMAINS} value={form.smtpDomain} onChange={set('smtpDomain')} />
      </div>
      <FormInput
        label="Hide this group from the global address list"
        checkbox
        value={String(form.hideFromList)}
        onChange={(v) => set('hideFromList')(v === 'true')}
      />
      {toggle('Joining group', form.join, set('join'), JOIN_TIP)}
      {toggle('Leaving group', form.leave, set('leave'), LEAVE_TIP)}
      {folderButton}
    </>
  );

  return (
    <>
      <ModalOverlay
        open={open}
        label={title}
        onClose={() => {
          if (!sheetOpenRef.current) onClose();
        }}
      >
        <ARSNewObjectTemplate
          title={title}
          location={locationLabel}
          icon="UsersThree"
          hasSteps={ad}
          steps={ad ? steps : undefined}
          activeIndex={step}
          interactiveSteps={ad}
          onStepSelect={setStep}
          // As the New User form: the body fits each step.
          fitContent
          footerVariant={ad && step === 1 ? '2' : generalComplete ? '1_complete' : '1'}
          ctaLabel={last ? 'Create group →' : undefined}
          onClose={onClose}
          onBack={() => setStep(0)}
          onContinue={() => (last ? create() : setStep(1))}
        >
          <ARSNewObjectContent heading={ad ? 'Create new AD group' : 'Create new Entra distribution group'}>{fields}</ARSNewObjectContent>
        </ARSNewObjectTemplate>
      </ModalOverlay>
      <SelectFolderSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        objectName={name || 'this group'}
        initialId={destinationId}
        rootId={ROOT[kind]}
        onSelect={setDestinationId}
      />
    </>
  );
}
