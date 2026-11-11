import { useEffect, useState } from 'react';
import { ARSNewOrganizationalUnit, type ARSNewOrganizationalUnitValues } from '@ars';
import { addContainerNode } from '../../lib/directoryData.js';
import { useDirectory } from '../../lib/directoryStore.js';
import { saveGroupProps } from '../../lib/groupDetailsStore.js';
import { navigate } from '../../lib/router.js';
import { showToast } from '../../lib/toastStore.js';
import { ModalOverlay } from '../ModalOverlay/ModalOverlay.js';

// Figma draws "Protect container from accidental deletion" unticked (1394:14812, 1349:12126).
const EMPTY: ARSNewOrganizationalUnitValues = { name: '', description: '', protect: false, openProperties: false };

export interface CreateOUModalProps {
  open: boolean;
  onClose: () => void;
  /** Directory node the OU goes in. */
  locationId: string;
}

/**
 * CreateOUModal — New Organizational Unit (ARS_New_Organizational_Unit). The
 * OU is added under the chosen folder; "Open properties" takes you to its page.
 */
export function CreateOUModal({ open, onClose, locationId }: CreateOUModalProps) {
  const { getPath } = useDirectory();
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setValues(EMPTY);
      setError('');
    }
  }, [open]);

  const locationLabel = getPath(locationId).map((n) => n.name).join('/');

  const create = () => {
    const name = values.name.trim();
    if (!name) {
      setError('Name is required.');
      return;
    }
    const id = addContainerNode(locationId, name, values.description);
    if (!id) return;
    saveGroupProps(id, { protect: values.protect });
    onClose();
    const href = `#/tree/${locationId}/${id}`;
    if (values.openProperties) navigate(href);
    showToast('Created successfully', {
      supportingText: `Organizational Unit ${name} created in ${locationLabel}`,
      viewHref: values.openProperties ? undefined : href,
    });
  };

  return (
    <ModalOverlay open={open} onClose={onClose} label="New Organizational Unit">
      <ARSNewOrganizationalUnit
        values={values}
        onValuesChange={(patch) => {
          setValues((v) => ({ ...v, ...patch }));
          if (patch.name !== undefined) setError('');
        }}
        nameError={error}
        location={locationLabel}
        onClose={onClose}
        onCreate={create}
      />
    </ModalOverlay>
  );
}
