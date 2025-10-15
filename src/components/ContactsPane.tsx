import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { UserPlus, Import } from 'lucide-react';
import { useAppState } from '../state/StateContext';
import { useAuth } from '../auth/AuthContext';
import { fetchGraphContacts } from '../auth/graph';

export default function ContactsPane() {
  const { contacts, addContact, importContacts } = useAppState();
  const { account, login, acquireToken } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loadingImport, setLoadingImport] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const sorted = [...contacts].sort((a, b) => a.name.localeCompare(b.name));

  const submit = () => {
    if (!name.trim() || !email.trim()) return;
    addContact({ name: name.trim(), email: email.trim() });
    setName('');
    setEmail('');
    setShowAdd(false);
  };

  const importFromGraph = async () => {
    setImportError(null);
    setLoadingImport(true);
    try {
      // Ensure login
      if (!account) {
        const loggedIn = await login();
        if (!loggedIn) throw new Error('Login cancelled');
      }
      const token = await acquireToken(['Contacts.Read']);
      if (!token) throw new Error('Failed to acquire token');
      const graphContacts = await fetchGraphContacts(token);
      if (!graphContacts.length) throw new Error('No contacts returned');
      importContacts(graphContacts);
    } catch (e: any) {
      setImportError(e.message || 'Import failed');
      console.error(e);
    } finally {
      setLoadingImport(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap items-center gap-2 p-2 border-b border-gray-100">
        <h2 className="font-medium mr-auto">Contacts</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs">
            <UserPlus className="w-4 h-4" /> Add Contact
          </button>
          <button disabled={loadingImport} onClick={importFromGraph} className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-600 disabled:opacity-50 hover:bg-indigo-700 text-white text-xs">
            <Import className={`w-4 h-4 ${loadingImport ? 'animate-pulse' : ''}`} /> {loadingImport ? 'Importing...' : 'Import'}
          </button>
        </div>
      </div>
      {importError && <div className="px-2 py-1 text-xs text-red-600 bg-red-50 border border-red-200">{importError}</div>}
      {showAdd && (
        <div className="p-2 border-b bg-gray-50 flex flex-wrap gap-2 text-xs">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="border rounded px-2 py-1 flex-1" />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border rounded px-2 py-1 flex-1" />
          <button onClick={submit} className="px-2 py-1 rounded bg-indigo-200 hover:bg-indigo-300 text-indigo-900">Save</button>
          <button onClick={() => setShowAdd(false)} className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800">Cancel</button>
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
