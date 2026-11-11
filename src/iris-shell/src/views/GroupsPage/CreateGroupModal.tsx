import { useEffect, useState } from 'react';
import { ARSNewObjectTemplate, FormInput } from '@ars';
import { Toggle } from '../../components/Toggle/Toggle.js';
import { Tooltip } from '../../components/Tooltip/Tooltip.js';
import type { StepperStepItem } from '../../components/Stepper/Stepper.js';
import { addObject, OBJECT_TYPE_META, type DirectoryObject } from '../../lib/directoryData.js';
import { useDirectory } from '../../lib/directoryStore.js';
import { GROUP_SCOPES, GROUP_TYPES, saveGroupProps } from '../../lib/groupDetailsStore.js';
import { showToast } from '../../lib/toastStore.js';
import { ModalOverlay } from '../ModalOverlay/ModalOverlay.js';
import styles from './CreateGroupModal.module.css';

export type CreateGroupKind = 'AD' | 'Entra';

const STEPS: StepperStepItem[] = [
  { id: 'general', label: 'General' },
  { id: 'exchange', label: 'Exchange e-mail' },
];
const EMAIL_DOMAINS = ['@contoso.com', '@contoso.onmicrosoft.com'];

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
  scope: GROUP_SCOPES[1],
  type: GROUP_TYPES[0],
  exchange: false,
  smtp: '',
  smtpDomain: EMAIL_DOMAINS[0],
  hideFromList: false,
  join: true,
  leave: true,
};

export interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  /** AD Group (two steps) or Entra Distribution Group (one form). */
  kind: CreateGroupKind;
  /** Directory node the group goes in. */
  locationId: string;
}

/**
 * CreateGroupModal — New AD Group (General, then the Exchange e-mail address)
 * and New Entra Distribution Group, from the written requirements in
 * ARS_WebUI2_Groups (2111:11197, 2111:11198, 2113:12494).
 */
export function CreateGroupModal({ open, onClose, kind, locationId }: CreateGroupModalProps) {
  const { getPath } = useDirectory();
  const [form, setForm] = useState<Form>(EMPTY);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setStep(0);
    }
  }, [open]);

  const set = <K extends keyof Form>(key: K) => (value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));
  const ad = kind === 'AD';
  const locationLabel = getPath(locationId).map((n) => n.name).join(' / ');
  const generalComplete = ad ? !!form.name.trim() && !!form.groupName.trim() : !!form.name.trim();
  const last = !ad || step === 1;

  const create = () => {
    const name = ad ? form.name.trim() : form.displayName.trim() || form.name.trim();
    const id = `group-new-${Date.now()}`;
    const object: DirectoryObject = {
      id,
      name,
      type: 'group',
      description: form.description,
      parentId: locationId,
      isContainer: false,
      details: { description: form.description, displayName: name, location: locationLabel, memberCount: 0, created: new Date().toISOString().slice(0, 10) },
    };
    addObject(locationId, object);
    const email = ad
      ? undefined
      : form.smtp.trim()
        ? `${form.smtp.trim()}${form.smtpDomain}`
        : `${name.toLowerCase().replace(/\s+/g, '.')}${form.smtpDomain}`;
    saveGroupProps(id, {
      groupName: ad ? form.groupName.trim() : name,
      scope: ad ? form.scope : 'Universal',
      type: ad ? form.type : 'Distribution',
      ...(email && { email }),
    });
    showToast(`${name} successfully created`, {
      supportingText: `${OBJECT_TYPE_META.group.label} created in ${locationLabel}. To open it, click View.`,
      viewHref: `#/tree/${locationId}/${id}`,
    });
    onClose();
  };

  const toggle = (label: string, value: boolean, onChange: (v: boolean) => void, tip: { on: string; off: string }) => (
    <Tooltip label={value ? tip.on : tip.off}>
      <span className={styles.toggle}>
        <Toggle checked={value} onChange={onChange} label={`${label}: ${value ? 'Open' : 'Closed'}`} />
      </span>
    </Tooltip>
  );

  return (
    <ModalOverlay open={open} onClose={onClose} label={ad ? 'New AD Group' : 'New Entra Distribution Group'}>
      <ARSNewObjectTemplate
        title={ad ? 'New AD Group' : 'New Entra Distribution Group'}
        location={locationLabel}
        icon="UsersThree"
        hasSteps={ad}
        steps={ad ? STEPS : undefined}
        activeIndex={step}
        interactiveSteps={ad}
        onStepSelect={setStep}
        footerVariant={last ? '2' : generalComplete ? '1_complete' : '1'}
        ctaLabel={last ? 'Create object' : undefined}
        onClose={onClose}
        onBack={() => (ad ? setStep(0) : onClose())}
        onContinue={() => (last ? create() : setStep(1))}
      >
        <div className={styles.form}>
          {ad && step === 0 && (
            <>
              <FormInput label="Group name" required value={form.name} onChange={set('name')} />
              <FormInput label="Group name (Pre-Windows 2000)" required value={form.groupName} onChange={set('groupName')} />
              <FormInput label="Group description" multiline value={form.description} onChange={set('description')} />
              <FormInput label="Group scope" select options={GROUP_SCOPES} value={form.scope} onChange={set('scope')} />
              <FormInput label="Group type" select options={GROUP_TYPES} value={form.type} onChange={set('type')} />
            </>
          )}
          {ad && step === 1 && (
            <>
              <FormInput
                label="Create an Exchange e-mail address"
                checkbox
                value={String(form.exchange)}
                onChange={(v) => set('exchange')(v === 'true')}
              />
              <FormInput label="Alias" value={form.name} disabled />
              <FormInput label="Associated administrative group" value={locationLabel} disabled />
            </>
          )}
          {!ad && (
            <>
              <FormInput label="Name" required value={form.name} onChange={set('name')} />
              <FormInput label="Display name" value={form.displayName} onChange={set('displayName')} />
              <FormInput label="Description" multiline value={form.description} onChange={set('description')} />
              <div className={styles.row}>
                <FormInput
                  label="Primary SMTP address"
                  info="Leave blank for the default value"
                  value={form.smtp}
                  onChange={set('smtp')}
                />
                <FormInput
                  label="Domain"
                  select
                  options={EMAIL_DOMAINS}
                  value={form.smtpDomain}
                  onChange={set('smtpDomain')}
                  width={220}
                />
              </div>
              <FormInput
                label="Hide this group from the global address list"
                checkbox
                value={String(form.hideFromList)}
                onChange={(v) => set('hideFromList')(v === 'true')}
              />
              {toggle('Join the group', form.join, set('join'), JOIN_TIP)}
              {toggle('Leave the group', form.leave, set('leave'), LEAVE_TIP)}
            </>
          )}
        </div>
      </ARSNewObjectTemplate>
    </ModalOverlay>
  );
}
