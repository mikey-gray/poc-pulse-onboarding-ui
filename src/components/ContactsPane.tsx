import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { UserPlus, Import } from 'lucide-react';
import { useAppState } from '../state/StateContext';
import { parseCsvContacts, validateCsvExample } from '../utils/parseCsvContacts';

export default function ContactsPane() {
  const { contacts, addContact, importContacts } = useAppState();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  const sorted = [...contacts].sort((a, b) => a.name.localeCompare(b.name));

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailExists = email ? contacts.some(c => c.email.toLowerCase() === email.toLowerCase()) : false;
  const emailValid = email ? emailRegex.test(email) : false;

  const submit = () => {
    if (!name.trim() || !email.trim() || !emailValid || emailExists) return;
    addContact({ name: name.trim(), email: email.trim() });
    setName('');
    setEmail('');
    setShowAdd(false);
  };

  const onPickFile = () => {
    setImportError(null);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
  const existing = new Set(contacts.map(c => c.email.toLowerCase()));
  const parsed = parseCsvContacts(text, existing);
        if (!parsed.length) {
          setImportError(
            'No valid contacts found. Provide CSV with name,email in each row. ' + validateCsvExample()
          );
          return;
        }
        importContacts(parsed);
      } catch (e: any) {
        setImportError(e.message || 'Failed to read file');
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap items-center gap-2 p-2 border-b border-gray-100">
        <h2 className="font-medium mr-auto">Contacts</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs">
            <UserPlus className="w-4 h-4" /> Add Contact
          </button>
          <button onClick={onPickFile} className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs" title="Import contacts from CSV">
            <Import className="w-4 h-4" /> Import CSV
          </button>
        </div>
      </div>
      {importError && (
        <div className="p-3 border-y bg-red-50 border-red-200 text-xs text-red-700 whitespace-pre-line">
          {importError}
        </div>
      )}
      {showAdd && (
        <div className="p-2 border-b bg-gray-50 flex flex-wrap gap-2 text-xs">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
            className="border rounded px-2 py-1 flex-1"
          />
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className={`border rounded px-2 py-1 flex-1 ${email && (!emailValid || emailExists) ? 'border-red-500 bg-red-50' : ''}`}
          />
          <button
            onClick={submit}
            disabled={!name.trim() || !email.trim() || !emailValid || emailExists}
            className={`px-2 py-1 rounded text-indigo-900 ${(!name.trim() || !email.trim() || !emailValid || emailExists) ? 'bg-indigo-100 cursor-not-allowed opacity-60' : 'bg-indigo-200 hover:bg-indigo-300'}`}
          >
            Save
          </button>
          <button onClick={() => setShowAdd(false)} className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800">Cancel</button>
          {email && (!emailValid || emailExists) && (
            <div className="basis-full text-red-600 mt-1">
              {!emailValid ? 'Invalid email format.' : 'Email already exists.'}
            </div>
          )}
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
