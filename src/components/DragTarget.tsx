import React from 'react';
import { useDrop } from 'react-dnd';
import Chip, { Palette } from './Chip';

interface DragTargetProps {
  palette: Palette;
  roleLabel: string;
  assignments: string[]; // contactIds
  contacts: { id: string; name: string }[];
  onRemove(contactId: string): void;
  onDrop(contactId: string): void;
  children?: React.ReactNode;
}

export function DragTarget({ palette, roleLabel, assignments, contacts, onRemove, onDrop, children }: DragTargetProps) {
  const [{ isOver }, drop] = useDrop<{ contactId: string }, void, { isOver: boolean }>(() => ({
    accept: 'CONTACT',
    drop: item => onDrop(item.contactId),
    collect: monitor => ({ isOver: monitor.isOver() }),
  }), [onDrop]);

  const paletteStyles = {
    company: { box: 'border-company-400 bg-company-50', active: 'ring-2 ring-company-300' },
    workspace: { box: 'border-workspace-400 bg-workspace-50', active: 'ring-2 ring-workspace-300' },
    client: { box: 'border-client-400 bg-client-50', active: 'ring-2 ring-client-300' },
  }[palette];

  return (
    <div ref={drop} className={`rounded border-dashed border px-2 py-2 space-y-1 transition ${paletteStyles.box} ${isOver ? paletteStyles.active : ''}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium">Drag contacts here for <span className="font-semibold">{roleLabel}</span></span>
        {children}
      </div>
      {!!assignments.length && (
        <div className="flex flex-wrap gap-1">
          {assignments.map(id => {
            const contact = contacts.find(c => c.id === id);
            if (!contact) return null;
            return (
              <Chip key={id} palette={palette} onRemove={() => onRemove(id)}>
                {contact.name}
              </Chip>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DragTarget;