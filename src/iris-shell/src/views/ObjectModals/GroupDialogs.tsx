import { useEffect, useState } from 'react';
import { ARSDeprovisionGroup, ARSRenameGroup } from '@ars';
import { OBJECT_TYPE_META, type DirectoryObject } from '../../lib/directoryData.js';
import { useDirectory } from '../../lib/directoryStore.js';
import { saveGroupProps, useGroupProps } from '../../lib/groupDetailsStore.js';
import { copyObject } from '../../lib/copyObject.js';
import { showToast } from '../../lib/toastStore.js';
import { ModalOverlay } from '../ModalOverlay/ModalOverlay.js';
import { MoveObjectSheet } from '../MoveObjectSheet/MoveObjectSheet.js';

export interface GroupDialogsProps {
  /** The open dialog from the address: rename, copy or deprovision. Any other value shows none of them. */
  dialog: string | null;
  group: DirectoryObject;
  /** The folder the group is in. */
  nodeId: string;
  onClose: () => void;
  /** Saves the group's new name on the directory object. */
  onRename: (name: string) => void;
}

/**
 * GroupDialogs — a group's Rename, Copy and Deprovision dialogs (written requirements 64:6802, 64:6804,
 * 64:6805), shared by the group page and the Groups list's row menu.
 */
export function GroupDialogs({ dialog, group, nodeId, onClose, onRename }: GroupDialogsProps) {
  const p = useGroupProps(group);
  const { getNodeName } = useDirectory();
  const renameOpen = dialog === 'rename';
  const [draft, setDraft] = useState({ name: '', groupName: '' });
  const [errors, setErrors] = useState({ name: '', groupName: '' });

  // The Rename form starts from the saved values each time it opens.
  useEffect(() => {
    if (!renameOpen) return;
    setDraft({ name: group.name, groupName: p.groupName });
    setErrors({ name: '', groupName: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renameOpen, group.id]);

  const rename = () => {
    const next = {
      name: draft.name.trim() ? '' : 'Name is required.',
      groupName: draft.groupName.trim() ? '' : 'Group name (Pre-Windows 2000) is required.',
    };
    setErrors(next);
    if (next.name || next.groupName) return;
    onRename(draft.name.trim());
    saveGroupProps(group.id, { groupName: draft.groupName.trim() });
    onClose();
    showToast('Successfully renamed Group', { supportingText: `Group renamed to ${draft.name.trim()}` });
  };

  const deprovision = () => {
    onClose();
    saveGroupProps(group.id, { deprovisioned: true });
    showToast(`Group ${group.name} deprovisioned successfully.`, {
      onUndo: () => saveGroupProps(group.id, { deprovisioned: false }),
    });
  };

  const copyTo = (destId: string) => {
    onClose();
    const result = copyObject(nodeId, group.id, destId);
    if (!result) return;
    saveGroupProps(result.copy.id, { ...p, groupName: result.copy.name });
    showToast(`Group ${group.name} copied to ${getNodeName(destId) ?? 'the folder'} successfully.`, {
      onUndo: result.undo,
      viewHref: `#/tree/${destId}/${result.copy.id}`,
      viewLabel: 'View object',
    });
  };

  return (
    <>
      <MoveObjectSheet
        open={dialog === 'copy'}
        mode="copy"
        onClose={onClose}
        objects={[{ id: group.id, name: group.name }]}
        objectType={OBJECT_TYPE_META.group.label}
        currentNodeId={nodeId}
        canMoveTo={() => true}
        onMove={copyTo}
      />
      <ModalOverlay open={renameOpen} onClose={onClose} label="Rename Group">
        <ARSRenameGroup
          name={draft.name}
          onNameChange={(name) => setDraft((d) => ({ ...d, name }))}
          groupName={draft.groupName}
          onGroupNameChange={(groupName) => setDraft((d) => ({ ...d, groupName }))}
          nameError={errors.name}
          groupNameError={errors.groupName}
          onClose={onClose}
          onCancel={onClose}
          onRename={rename}
        />
      </ModalOverlay>
      <ModalOverlay open={dialog === 'deprovision'} onClose={onClose} label="Deprovision AD Group">
        <ARSDeprovisionGroup name={group.name} onClose={onClose} onNo={onClose} onYes={deprovision} />
      </ModalOverlay>
    </>
  );
}
