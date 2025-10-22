import React from 'react';
import { useDrag } from 'react-dnd';

interface DraggableContactProps { id: string; name: string; email: string; onRemove(id: string): void }

export function DraggableContact({ id, name, email, onRemove }: DraggableContactProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CONTACT',
    item: { contactId: id },
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  }), [id]);
  return (
    <div
      ref={drag}
      className={`group px-3 py-2 rounded border text-sm flex flex-col cursor-move transition bg-white hover:bg-gray-50 border-gray-200 relative ${isDragging ? 'opacity-40' : ''}`}
      title="Drag contact"
    >
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(id); }}
        title="Remove contact"
        className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded text-gray-400 hover:text-red-600 hover:bg-red-50"
      >
        ×
      </button>
      <span className="font-medium pr-4">{name}</span>
      <span className="text-xs text-gray-600 pr-4">{email}</span>
    </div>
  );
}

export default DraggableContact;