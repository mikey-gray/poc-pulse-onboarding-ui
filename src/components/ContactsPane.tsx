import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { UserPlus, Import } from 'lucide-react';
import { useAppState } from '../state/StateContext';

export default function ContactsPane() {
  const { contacts, addContact, importContacts } = useAppState();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const sorted = [...contacts].sort((a, b) => a.name.localeCompare(b.name));

  const submit = () => {
    if (!name.trim() || !email.trim()) return;
    addContact({ name: name.trim(), email: email.trim() });
    setName('');
    setEmail('');
    setShowAdd(false);
  };

  const importSample = () => {
    importContacts([
      { name: 'Charlie Adams', email: 'charlie@example.com' },
      { name: 'Dana Lee', email: 'dana@example.com' },
    ]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap items-center gap-2 p-2 border-b border-gray-100">
        <h2 className="font-medium mr-auto">Contacts</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 px-2 py-1 rounded bg-company-100 hover:bg-company-200 text-company-800 text-xs">
            <UserPlus className="w-4 h-4" /> Add Contact
          </button>
          <button onClick={importSample} className="flex items-center gap-1 px-2 py-1 rounded bg-workspace-100 hover:bg-workspace-200 text-workspace-800 text-xs">
            <Import className="w-4 h-4" /> Import
          </button>
        </div>
      </div>
      {showAdd && (
        <div className="p-2 border-b bg-gray-50 flex flex-wrap gap-2 text-xs">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="border rounded px-2 py-1 flex-1" />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border rounded px-2 py-1 flex-1" />
          <button onClick={submit} className="px-2 py-1 rounded bg-workspace-200 hover:bg-workspace-300 text-workspace-900">Save</button>
          <button onClick={() => setShowAdd(false)} className="px-2 py-1 rounded bg-company-100 hover:bg-company-200 text-company-800">Cancel</button>
        </div>
      )}
  <div className="overflow-y-auto p-2 space-y-2">
        {sorted.map(c => (
          <DraggableContact key={c.id} id={c.id} name={c.name} email={c.email} />
        ))}
      </div>
    </div>
  );
}

interface DraggableContactProps { id: string; name: string; email: string }
function DraggableContact({ id, name, email }: DraggableContactProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CONTACT',
    item: { contactId: id },
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  }), [id]);
  return (
    <div
      ref={drag}
    className={`px-3 py-2 rounded border text-sm flex flex-col cursor-move transition bg-white hover:bg-gray-50 border-gray-200 ${isDragging ? 'opacity-40' : ''}`}
      title="Drag contact"
    >
      <span className="font-medium">{name}</span>
      <span className="text-xs text-gray-600">{email}</span>
    </div>
  );
}
