import React from 'react';
import { useDrop } from 'react-dnd';
import { Plus, X } from 'lucide-react';
import { useAppState } from '../state/StateContext';

// Clean implementation replacing corrupted nested content
function Chip({ children, onRemove, color }: { children: React.ReactNode; onRemove(): void; color: 'yellow' | 'blue' | 'purple' }) {
  const colorClasses = {
    yellow: 'bg-yellow-50 border-yellow-300',
    blue: 'bg-blue-50 border-blue-300',
    purple: 'bg-purple-50 border-purple-300',
  }[color];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] ${colorClasses}`}>
      {children}
      <button onClick={onRemove} aria-label="Remove" className="hover:text-red-600 text-gray-500">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

export default function WorkspacesPane() {
  const {
    companyName,
    setCompanyName,
    workspaces,
    addWorkspace,
    renameWorkspace,
    addClient,
    renameClient,
    assignCompany,
    assignWorkspace,
    assignClient,
    companyAssignments,
    workspaceAssignments,
    clientAssignments,
    removeCompanyAssignment,
    removeWorkspaceAssignment,
    removeClientAssignment,
    contacts,
  } = useAppState();

  const [{ isOverCompany }, companyDrop] = useDrop<{ contactId: string }, void, { isOverCompany: boolean }>(() => ({
    accept: 'CONTACT',
    drop: item => assignCompany(item.contactId),
    collect: monitor => ({ isOverCompany: monitor.isOver() }),
  }), [assignCompany]);

  return (
    <div ref={companyDrop} className="flex flex-col h-full p-3 gap-3 overflow-y-auto">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          placeholder="My Company"
          className="border rounded px-2 py-1 flex-1 text-sm"
        />
        <button
          onClick={addWorkspace}
          className="flex items-center gap-1 px-3 py-1 rounded bg-green-100 hover:bg-green-200 text-sm"
        >
          <Plus className="w-4 h-4" /> Add Workspace
        </button>
      </div>
      <div className={`text-xs px-2 py-1 rounded border transition-colors ${isOverCompany ? 'bg-yellow-50 border-yellow-300' : 'bg-gray-50 border-dashed border-gray-300'}`}>
        Drag contacts here to assign as <span className="font-semibold">Admin</span>
      </div>
      {!!companyAssignments.length && (
        <div className="flex flex-wrap gap-1">
          {companyAssignments.map(a => {
            const contact = contacts.find(c => c.id === a.contactId);
            if (!contact) return null;
            return (
              <Chip
                key={a.contactId}
                color="yellow"
                onRemove={() => removeCompanyAssignment(a.contactId)}
              >
                {contact.name}
              </Chip>
            );
          })}
        </div>
      )}
      <div className="space-y-4">
        {workspaces.map(w => (
          <WorkspaceBox
            key={w.id}
            workspaceId={w.id}
            name={w.name}
            clients={w.clients}
            renameWorkspace={renameWorkspace}
            addClient={addClient}
            renameClient={renameClient}
            assignWorkspace={assignWorkspace}
            assignClient={assignClient}
            workspaceAssignments={workspaceAssignments}
            clientAssignments={clientAssignments}
            removeWorkspaceAssignment={removeWorkspaceAssignment}
            removeClientAssignment={removeClientAssignment}
            contacts={contacts}
          />
        ))}
      </div>
    </div>
  );
}

interface WorkspaceBoxProps {
  workspaceId: string;
  name: string;
  clients: { id: string; name: string }[];
  renameWorkspace(id: string, name: string): void;
  addClient(workspaceId: string): string;
  renameClient(workspaceId: string, clientId: string, name: string): void;
  assignWorkspace(workspaceId: string, contactId: string): void;
  assignClient(workspaceId: string, clientId: string, contactId: string): void;
  workspaceAssignments: { workspaceId: string; contactId: string }[];
  clientAssignments: { clientId: string; contactId: string }[];
  removeWorkspaceAssignment(workspaceId: string, contactId: string): void;
  removeClientAssignment(clientId: string, contactId: string): void;
  contacts: { id: string; name: string; email: string }[];
}

function WorkspaceBox(props: WorkspaceBoxProps) {
  const {
    workspaceId,
    name,
    clients,
    renameWorkspace,
    addClient,
    renameClient,
    assignWorkspace,
    assignClient,
    workspaceAssignments,
    clientAssignments,
    removeWorkspaceAssignment,
    removeClientAssignment,
    contacts,
  } = props;

  const [{ isOverWorkspace }, workspaceDrop] = useDrop<{ contactId: string }, void, { isOverWorkspace: boolean }>(() => ({
    accept: 'CONTACT',
    drop: item => assignWorkspace(workspaceId, item.contactId),
    collect: monitor => ({ isOverWorkspace: monitor.isOver() }),
  }), [workspaceId, assignWorkspace]);

  const assigned = workspaceAssignments.filter(a => a.workspaceId === workspaceId);

  return (
    <div ref={workspaceDrop} className={`rounded border p-3 bg-white shadow-sm space-y-2 transition ${isOverWorkspace ? 'ring-2 ring-blue-300' : ''}`}>
      <div className="flex items-center gap-2">
        <input
          value={name}
          onChange={e => renameWorkspace(workspaceId, e.target.value)}
          placeholder="New Workspace"
          className="border rounded px-2 py-1 flex-1 text-sm"
        />
        <button
          onClick={() => addClient(workspaceId)}
          className="flex items-center gap-1 px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-xs"
        >
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>
      <div className="text-[10px] text-gray-600">Drag contacts here for <span className="font-semibold">Manager</span> role</div>
      {!!assigned.length && (
        <div className="flex flex-wrap gap-1">
          {assigned.map(a => {
            const contact = contacts.find(c => c.id === a.contactId);
            if (!contact) return null;
            return (
              <Chip
                key={a.contactId}
                color="blue"
                onRemove={() => removeWorkspaceAssignment(workspaceId, a.contactId)}
              >
                {contact.name}
              </Chip>
            );
          })}
        </div>
      )}
      <div className="pl-4 space-y-2">
        {clients.map(c => (
          <ClientBox
            key={c.id}
            workspaceId={workspaceId}
            clientId={c.id}
            name={c.name}
            renameClient={renameClient}
            assignClient={assignClient}
            clientAssignments={clientAssignments}
            removeClientAssignment={removeClientAssignment}
            contacts={contacts}
          />
        ))}
      </div>
    </div>
  );
}

interface ClientBoxProps {
  workspaceId: string;
  clientId: string;
  name: string;
  renameClient(workspaceId: string, clientId: string, name: string): void;
  assignClient(workspaceId: string, clientId: string, contactId: string): void;
  clientAssignments: { clientId: string; contactId: string }[];
  removeClientAssignment(clientId: string, contactId: string): void;
  contacts: { id: string; name: string; email: string }[];
}

function ClientBox(props: ClientBoxProps) {
  const { workspaceId, clientId, name, renameClient, assignClient, clientAssignments, removeClientAssignment, contacts } = props;
  const [{ isOverClient }, clientDrop] = useDrop<{ contactId: string }, void, { isOverClient: boolean }>(() => ({
    accept: 'CONTACT',
    drop: item => assignClient(workspaceId, clientId, item.contactId),
    collect: monitor => ({ isOverClient: monitor.isOver() }),
  }), [workspaceId, clientId, assignClient]);

  const assigned = clientAssignments.filter(a => a.clientId === clientId);

  return (
    <div ref={clientDrop} className={`rounded border p-2 bg-gray-50 space-y-2 transition ${isOverClient ? 'ring-2 ring-purple-300' : ''}`}>
      <input
        value={name}
        onChange={e => renameClient(workspaceId, clientId, e.target.value)}
        placeholder="New Client"
        className="border rounded px-2 py-1 w-full text-xs"
      />
      <div className="text-[10px] text-gray-600">Drag contacts here for <span className="font-semibold">Account</span> role</div>
      {!!assigned.length && (
        <div className="flex flex-wrap gap-1">
          {assigned.map(a => {
            const contact = contacts.find(c => c.id === a.contactId);
            if (!contact) return null;
            return (
              <Chip
                key={a.contactId}
                color="purple"
                onRemove={() => removeClientAssignment(clientId, a.contactId)}
              >
                {contact.name}
              </Chip>
            );
          })}
        </div>
      )}
    </div>
  );
}
