import { useEffect, useState } from 'react';
import { Button } from '../../components/Button/Button.js';
import { SideSheet } from '../../components/SideSheet/SideSheet.js';
import { FolderTree } from '../FolderTree/FolderTree.js';

export interface SelectFolderSheetProps {
  open: boolean;
  onClose: () => void;
  /** Names what the folder is for, in the subtitle. */
  objectName: string;
  /** The folder ticked when the sheet opens. */
  initialId: string | null;
  onSelect: (id: string) => void;
}

/**
 * SelectFolderSheet — the Select folder side sheet (Figma 1746:14585) a New object form opens from "Select
 * destination folder": browse the directory tree, tick a folder, then Select.
 */
export function SelectFolderSheet({ open, onClose, objectName, initialId, onSelect }: SelectFolderSheetProps) {
  const [choice, setChoice] = useState<string | null>(initialId);

  useEffect(() => {
    if (open) setChoice(initialId);
  }, [open, initialId]);

  return (
    <SideSheet
      open={open}
      onClose={onClose}
      title="Select folder"
      subtitle={`Browse and select a destination folder for ${objectName}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!choice}
            onClick={() => {
              if (choice) onSelect(choice);
              onClose();
            }}
          >
            Select
          </Button>
        </>
      }
    >
      <FolderTree selectedId={choice} onSelect={setChoice} />
    </SideSheet>
  );
}
