import { useEffect, useState, type ReactNode } from 'react';
import { ARSNewObjectContent, ARSNewObjectTemplate, FormInput } from '@ars';
import { Icon } from '../../components/Icon/Icon.js';
import { Toggle } from '../../components/Toggle/Toggle.js';
import { Tooltip } from '../../components/Tooltip/Tooltip.js';
import type { StepperStepItem } from '../../components/Stepper/Stepper.js';
import { addObject, ENTRA_TENANTS, OBJECT_TYPE_META, type DirectoryObject } from '../../lib/directoryData.js';
import { useDirectory } from '../../lib/directoryStore.js';
import { GROUP_SCOPES, GROUP_TYPES, saveGroupProps } from '../../lib/groupDetailsStore.js';
import { showToast } from '../../lib/toastStore.js';
import { useStepFlow } from '../../lib/useStepFlow.js';
import { NewObjectOverlay } from '../NewObjectOverlay/NewObjectOverlay.js';
import { SELECT_FOLDER_STEP, SelectFolderStep } from '../SelectFolderStep/SelectFolderStep.js';
import styles from './CreateGroupModal.module.css';

export type CreateGroupKind = 'AD' | 'Entra';

const GENERAL: StepperStepItem = { id: 'general', label: 'General' };
const STEPS: Record<CreateGroupKind, StepperStepItem[]> = {
  // You asked for the folder as the last step instead of the Select folder sheet; it is drawn as New User's (3651:20393).
  AD: [GENERAL, { id: 'exchange', label: 'Exchange options' }, SELECT_FOLDER_STEP],
  // Entra has no location: no folder step, and no stepper (one step).
  Entra: [GENERAL],
};
const EMAIL_DOMAINS = ['@contoso.com', '@contoso.onmicrosoft.com'];
/** Figma's info icons carry no text, as on the New User form. */
const INFO = 'More information';
/** Figma's "0/100" on Group description. */
const DESCRIPTION_LIMIT = 100;

/** An Entra group goes straight into a tenant: there is no folder to pick. */
function entraHome(locationId: string): string {
  return ENTRA_TENANTS.some((t) => t.id === locationId) ? locationId : ENTRA_TENANTS[0].id;
}

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
  /** New AD Group (General, Exchange options, Select folder) or New Entra Distribution Group (General only: Entra has no location). */
  kind: CreateGroupKind;
  /** The folder an AD group goes in unless another is chosen; for an Entra group, the tenant it is made in. */
  locationId: string;
}

/**
 * CreateGroupModal — New AD Group as ARS_WebUI2_Groups draws it (General 2109:10097, Exchange options
 * 2112:12077), and New Entra Distribution Group from its written requirement (2113:12494) in the draft's
 * layout (2109:10890), since the Entra template (2109:11016) still holds the generic user form. A new AD group
 * ends with the Select folder step (ARS_WebUI2_CRUD 3651:20393) in place of Figma's "Select destination folder"
 * button; an Entra group has no location, so it has one step and no folder.
 */
export function CreateGroupModal({ open, onClose, kind, locationId }: CreateGroupModalProps) {
  const { getPath } = useDirectory();
  const ad = kind === 'AD';
  const home = ad ? locationId : entraHome(locationId);
  const [form, setForm] = useState<Form>(EMPTY);
  const [destinationId, setDestinationId] = useState(home);
  const name = form.name.trim();
  const generalComplete = ad ? !!name && !!form.groupName.trim() : !!name;
  const stepItems = STEPS[kind];
  const { step, steps, goTo, reset, last } = useStepFlow(stepItems, generalComplete, open);

  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      reset();
      setDestinationId(home);
    }
  }, [open, home, reset]);

  const set = <K extends keyof Form>(key: K) => (value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));
  // Closing asks first once a text field has been filled in, as on the New User form (decided UI rule MOD-2).
  const filledIn = [form.name, form.groupName, form.displayName, form.description, form.smtp].some((v) => v.trim() !== '');
  const title = ad ? 'New AD Group' : 'New Entra Distribution Group';
  // Entra objects have no location, so there is nothing to show under the title.
  const locationLabel = ad ? getPath(destinationId).map((n) => n.name).join(' / ') : '';

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
      details: { description: form.description, displayName: display, ...(ad && { location: locationLabel }), memberCount: 0, created: new Date().toISOString().slice(0, 10) },
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
      supportingText: `${OBJECT_TYPE_META.group.label} created${ad ? ` in ${locationLabel}` : ''}. To open it, click View.`,
      viewHref: `#/tree/${destinationId}/${id}`,
    });
    onClose();
  };

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

  // Each step's fields by step id. Every step stays mounted (decided UI rule MOD-1), so the read-only Exchange
  // fields, which are uncontrolled, are keyed by the name to show it as it changes.
  const fields: Record<string, ReactNode> = {
    general: ad ? (
      <>
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
      </>
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
      </>
    ),
    exchange: (
      <>
        <FormInput
          label="Create an Exchange e-mail address"
          checkbox
          value={String(form.exchange)}
          onChange={(v) => set('exchange')(v === 'true')}
        />
        {/* Both are read-only in the written requirement (2111:11198); Figma's sample is "Security members". */}
        <FormInput key={`alias-${name}`} label="Alias" value={name} disabled />
        <FormInput
          key={`admin-group-${name}`}
          label="Associated administrative group"
          value={name ? `${name} members` : ''}
          disabled
        />
      </>
    ),
    [SELECT_FOLDER_STEP.id]: (
      <SelectFolderStep objectName={name || 'this group'} destinationId={destinationId} onSelect={setDestinationId} />
    ),
  };
  const heading = ad ? 'Create new AD group' : 'Create new Entra distribution group';
  const stepContents = stepItems.map((s) => (
    <ARSNewObjectContent key={s.id} heading={heading} panel={s.id === SELECT_FOLDER_STEP.id}>
      {fields[s.id]}
    </ARSNewObjectContent>
  ));

  return (
    <NewObjectOverlay open={open} label={title} filledIn={filledIn} onClose={onClose}>
      {(requestClose) => (
        <ARSNewObjectTemplate
          title={title}
          location={locationLabel}
          icon="UsersThree"
          hasSteps={ad}
          steps={ad ? steps : undefined}
          activeIndex={step}
          interactiveSteps
          onStepSelect={goTo}
          // As the New User form: as tall as the tallest step on every step (decided UI rule MOD-1).
          fitContent
          stepContents={stepContents}
          footerVariant={step > 0 ? '2' : generalComplete ? '1_complete' : '1'}
          ctaLabel={last ? 'Create group →' : step > 0 ? 'Save and continue →' : undefined}
          ctaDisabled={!generalComplete}
          onClose={requestClose}
          onBack={() => goTo(step - 1)}
          onContinue={() => (last ? create() : goTo(step + 1))}
          onDiscard={requestClose}
        />
      )}
    </NewObjectOverlay>
  );
}
