import { useState } from 'react';
import { AppShell } from '../AppShell/AppShell.js';
import { showToast } from '../../lib/toastStore.js';
import { Avatar } from '../../components/Avatar/Avatar.js';
import { Button } from '../../components/Button/Button.js';
import { Card } from '../../components/Card/Card.js';
import { ContentHeader } from '../../components/ContentHeader/ContentHeader.js';
import { DataTable, type DataTableColumn, type RowKey } from '../../components/DataTable/DataTable.js';
import { FormField } from '../../components/FormField/FormField.js';
import { Textarea } from '../../components/Textarea/Textarea.js';
import { TextInput } from '../../components/TextInput/TextInput.js';
import { StatusBadge } from './parts.js';
import styles from './UserView.module.css';

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
  { key: 'to', header: 'Issued To', grow: 1, minWidth: 180, cell: (r) => r.issuedTo },
  { key: 'by', header: 'Issued By', grow: 1, minWidth: 160, cell: (r) => r.issuedBy },
  { key: 'purposes', header: 'Intended Purposes', grow: 1, minWidth: 200, cell: (r) => r.purposes },
  { key: 'expires', header: 'Expiration Date', width: 150, cell: (r) => r.expires },
];

const PERSONAL = [
  { key: 'first', label: 'First Name', required: true, value: 'John' },
  { key: 'last', label: 'Last Name', required: true, value: 'Doe' },
  { key: 'display', label: 'Display Name', value: 'John Doe' },
  { key: 'email', label: 'Email Address', required: true, value: 'john.doe@company.com' },
  { key: 'phone', label: 'Phone Number', value: '+1 (555) 234-5678' },
];

const WORK = [
  { key: 'office', label: 'Office Location', value: 'New York - HQ' },
  { key: 'dept', label: 'Department', value: 'IT Operations' },
  { key: 'job', label: 'Job Title', value: 'Senior IT Administrator' },
  { key: 'web', label: 'Web Page', value: 'https://intranet.company.com/jdoe' },
];

const ACCOUNT = [
  { label: 'Login Name', value: 'CORP\\john.doe' },
  { label: 'Domain', value: 'corp.company.com' },
  { label: 'Last Login', value: '2026-07-16 09:42 AM' },
];

const INITIAL_VALUES: Record<string, string> = Object.fromEntries([...PERSONAL, ...WORK].map((f) => [f.key, f.value]));

/** ProfilePage — the signed-in user's own profile (user-profile-screen 10199:6785, content 10199:7273). */
export function ProfilePage() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [description, setDescription] = useState('IT Administrator managing Active Directory and identity governance');
  const [certs, setCerts] = useState(CERTIFICATES);
  const [selected, setSelected] = useState<Set<RowKey>>(new Set());

  const field = (f: { key: string; label: string; required?: boolean }) => (
    <FormField key={f.key} label={f.label} required={f.required}>
      <TextInput value={values[f.key]} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} />
    </FormField>
  );

  return (
    <AppShell breadcrumb={[{ label: 'Active Roles' }, { label: 'User Profile' }]} activeGlobalItem="#/user-view/profile">
      <ContentHeader icon="User" title="User Profile" subtitle="View or change your personal account information" />
      <div className={styles.page}>
        <div className={styles.profile}>
          <Avatar name="John Doe" size="l" />
          <div>
            <p className={styles.profileName}>John Doe</p>
            <p className={styles.profileMeta}>IT Administrator</p>
            <p className={styles.profileMeta}>john.doe@company.com</p>
          </div>
        </div>

        <Card title="Personal Information">
          <div className={styles.form}>
            <div className={styles.formGrid}>{PERSONAL.map(field)}</div>
            <FormField label="Description" helperText="Brief summary of your responsibilities or bio.">
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormField>
          </div>
        </Card>

        <Card title="Work Information">
          <div className={styles.formGrid}>{WORK.map(field)}</div>
        </Card>

        <Card title="Account Information">
          <div className={styles.formGrid}>
            {ACCOUNT.slice(0, 2).map((a) => (
              <FormField key={a.label} label={a.label}>
                <TextInput value={a.value} readOnly />
              </FormField>
            ))}
            <FormField label="Account Status">
              <StatusBadge status="Active" />
            </FormField>
            <FormField label={ACCOUNT[2].label}>
              <TextInput value={ACCOUNT[2].value} readOnly />
            </FormField>
          </div>
        </Card>

        <Card
          title="Published Certificates"
          helper="List of X.509 certificates published for this user account."
          actions={
            <>
              <Button variant="secondary" size="s" onClick={() => showToast('Add from File is not available in this prototype')}>
                Add from File
              </Button>
              <Button
                variant="secondary"
                size="s"
                disabled={selected.size === 0}
                onClick={() => {
                  setCerts((prev) => prev.filter((c) => !selected.has(c.id)));
                  setSelected(new Set());
                }}
              >
                Remove
              </Button>
              <Button variant="secondary" size="s" onClick={() => showToast('Copy to File is not available in this prototype')}>
                Copy to File
              </Button>
            </>
          }
        >
          <DataTable
            ariaLabel="Published certificates"
            columns={CERT_COLUMNS}
            rows={certs}
            selected={selected}
            onSelectionChange={setSelected}
            emptyState={{ title: 'No certificates', description: 'No certificates are published for this account.' }}
          />
        </Card>
      </div>
    </AppShell>
  );
}
