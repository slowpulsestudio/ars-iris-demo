import { useState } from 'react';
import { AppShell } from '../AppShell/AppShell.js';
import { showToast } from '../../lib/toastStore.js';
import { Avatar } from '../../components/Avatar/Avatar.js';
import { Button } from '../../components/Button/Button.js';
import { DataTable, type DataTableColumn, type RowKey } from '../../components/DataTable/DataTable.js';
import { FormField } from '../../components/FormField/FormField.js';
import { IconButton } from '../../components/IconButton/IconButton.js';
import { Textarea } from '../../components/Textarea/Textarea.js';
import { TextInput } from '../../components/TextInput/TextInput.js';
import { Tooltip } from '../../components/Tooltip/Tooltip.js';
import { SelectField, StatusBadge } from './parts.js';
import styles from './UserView.module.css';

type Field = 'first' | 'last' | 'display' | 'email' | 'phone' | 'description' | 'office' | 'department' | 'job' | 'web';
type Values = Record<Field, string>;

const DEPARTMENTS = ['IT Operations', 'Finance', 'Human Resources', 'Marketing', 'Engineering'];
const REQUIRED: Field[] = ['first', 'last', 'email'];

interface Certificate {
  id: string;
  issuedTo: string;
  issuedBy: string;
  purposes: string;
  expires: string;
}

const CERTIFICATES: Certificate[] = [
  { id: 'c1', issuedTo: 'john.doe@company.com', issuedBy: 'Corp Enterprise CA', purposes: 'Client Authentication, Email', expires: '2027-03-15' },
  { id: 'c2', issuedTo: 'CORP\\john.doe', issuedBy: 'Corp Root CA', purposes: 'Smart Card Logon', expires: '2027-06-22' },
  { id: 'c3', issuedTo: 'John Doe', issuedBy: 'DigiCert SHA2 CA', purposes: 'Secure Email (S/MIME)', expires: '2026-12-01' },
];

const CERT_COLUMNS: DataTableColumn<Certificate>[] = [
  { key: 'to', header: 'Issued To', grow: 1, minWidth: 180, cell: (c) => c.issuedTo },
  { key: 'by', header: 'Issued By', grow: 1, minWidth: 160, cell: (c) => c.issuedBy },
  { key: 'purposes', header: 'Intended Purposes', grow: 1, minWidth: 200, cell: (c) => c.purposes },
  { key: 'expires', header: 'Expiration Date', width: 150, cell: (c) => c.expires },
];

// Figma's sample profile; saved values last for the session.
let saved: Values = {
  first: 'John',
  last: 'Doe',
  display: 'John Doe',
  email: 'john.doe@company.com',
  phone: '+1 (555) 234-5678',
  description: 'IT Administrator managing Active Directory and identity governance',
  office: 'New York - HQ',
  department: 'IT Operations',
  job: 'Senior IT Administrator',
  web: 'https://intranet.company.com/jdoe',
};

/** ProfilePage — the signed-in user's own profile (user-profile-settings 10199:7207). */
export function ProfilePage() {
  const [values, setValues] = useState<Values>(saved);
  const [showErrors, setShowErrors] = useState(false);
  const [shake, setShake] = useState(0);
  const [certs, setCerts] = useState(CERTIFICATES);
  const [certSelection, setCertSelection] = useState<Set<RowKey>>(new Set());

  const dirty = (Object.keys(values) as Field[]).some((k) => values[k] !== saved[k]);
  const missing = REQUIRED.filter((k) => !values[k].trim());
  const errorFor = (k: Field) => (showErrors && missing.includes(k) ? 'This field is required.' : undefined);
  const set = (k: Field) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const text = (k: Field, label: string, required = false) => (
    <FormField label={label} required={required} error={errorFor(k)} shakeTrigger={shake}>
      <TextInput value={values[k]} onChange={set(k)} invalid={Boolean(errorFor(k))} />
    </FormField>
  );

  const save = () => {
    if (missing.length) {
      setShowErrors(true);
      setShake((n) => n + 1);
      return;
    }
    saved = values;
    setShowErrors(false);
    showToast('Profile saved');
  };

  const cancel = () => {
    setValues(saved);
    setShowErrors(false);
  };

  return (
    <AppShell breadcrumb={[{ label: 'Active Roles' }, { label: 'User Profile' }]} activeGlobalItem="#/user-view/profile">
      <div className={styles.page}>
        <h1 className={styles.visuallyHidden}>User Profile</h1>
        <div className={styles.profile}>
          <span className={styles.avatarWrap}>
            <Avatar name={saved.display} size="l" />
            <span className={styles.avatarEdit}>
              <Tooltip label="Change photo">
                <IconButton
                  icon="PencilSimple"
                  size="s"
                  variant="secondary"
                  ariaLabel="Change photo"
                  onClick={() => showToast('Changing the photo is not available in this prototype')}
                />
              </Tooltip>
            </span>
          </span>
          <div>
            <p className={styles.profileName}>{saved.display}</p>
            <p className={styles.profileRole}>IT Administrator</p>
            <p className={styles.profileMeta}>{saved.email}</p>
          </div>
        </div>

        <hr className={styles.divider} />

        <section className={styles.section} aria-labelledby="profile-personal">
          <h2 id="profile-personal" className={styles.sectionHeading}>
            Personal Information
          </h2>
          <div className={styles.grid2}>
            {text('first', 'First Name', true)}
            {text('last', 'Last Name', true)}
            {text('display', 'Display Name')}
            {text('email', 'Email Address', true)}
            {text('phone', 'Phone Number')}
          </div>
          <FormField label="Description" help="Brief summary of your responsibilities or bio.">
            <Textarea value={values.description} onChange={set('description')} />
          </FormField>
        </section>

        <hr className={styles.divider} />

        <section className={styles.section} aria-labelledby="profile-work">
          <h2 id="profile-work" className={styles.sectionHeading}>
            Work Information
          </h2>
          <div className={styles.grid2}>
            {text('office', 'Office Location')}
            <SelectField
              label="Department"
              value={values.department}
              options={DEPARTMENTS}
              onChange={(department) => setValues((v) => ({ ...v, department }))}
            />
            {text('job', 'Job Title')}
            {text('web', 'Web Page')}
          </div>
        </section>

        <hr className={styles.divider} />

        <section className={styles.section} aria-labelledby="profile-account">
          <h2 id="profile-account" className={styles.sectionHeading}>
            Account Information
          </h2>
          <div className={styles.grid3}>
            <FormField label="Login Name">
              <TextInput value="CORP\john.doe" readOnly />
            </FormField>
            <FormField label="Domain">
              <TextInput value="corp.company.com" readOnly />
            </FormField>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Account Status</span>
              <span>
                <StatusBadge status="Active" />
              </span>
            </div>
            <FormField label="Last Login">
              <TextInput value="2026-07-16 09:42 AM" readOnly />
            </FormField>
          </div>
        </section>

        <hr className={styles.divider} />

        <section className={styles.section} aria-labelledby="profile-certs">
          <div className={styles.sectionHead}>
            <h2 id="profile-certs" className={styles.sectionHeading}>
              Published Certificates
            </h2>
            <div className={styles.headerActions}>
              <Button variant="secondary" size="s" onClick={() => showToast('Add from File is not available in this prototype')}>
                Add from File
              </Button>
              <Button
                variant="danger"
                size="s"
                disabled={certSelection.size === 0}
                onClick={() => {
                  setCerts((prev) => prev.filter((c) => !certSelection.has(c.id)));
                  setCertSelection(new Set());
                }}
              >
                Remove
              </Button>
              <Button variant="secondary" size="s" onClick={() => showToast('Copy to File is not available in this prototype')}>
                Copy to File
              </Button>
            </div>
          </div>
          <p className={styles.caption}>List of X.509 certificates published for this user account.</p>
          <DataTable
            ariaLabel="Published certificates"
            columns={CERT_COLUMNS}
            rows={certs}
            rowLabel={(c) => c.issuedTo}
            selected={certSelection}
            onSelectionChange={setCertSelection}
            hideRowActions
            emptyState={{ title: 'No certificates', description: 'No certificates are published for this account.' }}
          />
        </section>

        <div className={styles.footer}>
          <Button variant="ghost" disabled={!dirty} onClick={cancel}>
            Cancel
          </Button>
          <Button disabled={!dirty} onClick={save}>
            Save Changes
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
