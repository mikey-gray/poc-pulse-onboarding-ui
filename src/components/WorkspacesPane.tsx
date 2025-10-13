import React from 'react';
import { useDrop } from 'react-dnd';
import { Plus } from 'lucide-react';
import { useAppState } from '../state/StateContext';

export default function WorkspacesPane() {
  const {
    companyName,
    setCompanyName,
    workspaces,
    addWorkspace,
    renameWorkspace,
    addClient,
    renameClient,
    assignWorkspace,
    assignClient,
    assignCompany,
  } = useAppState();

  const [{ isOverCompany }, companyDrop] = useDrop(
    () => ({
      accept: 'CONTACT',
      drop: (item: { contactId: string }) => assignCompany(item.contactId),
      collect: monitor => ({ isOverCompany: monitor.isOver() }),
    }),
    [assignCompany]
  );

  return (
    <div className="flex flex-col h-full p-3 gap-3 overflow-y-auto" ref={companyDrop}>
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
      <div
        className={`text-xs px-2 py-1 rounded border transition-colors ${
          isOverCompany
            ? 'bg-yellow-50 border-yellow-300'
            : 'bg-gray-50 border-dashed border-gray-300'
        }`}
      >
        Drag contacts here to assign as <span className="font-semibold">Admin</span>
      </div>
      <div className="space-y-4">
        {workspaces.map(w => (
          <WorkspaceBox
            key={w.id}
            workspaceId={w.id}
            name={w.name}
            clients={w.clients}
            addClient={addClient}
            renameWorkspace={renameWorkspace}
            renameClient={renameClient}
            assignWorkspace={assignWorkspace}
            assignClient={assignClient}
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
  addClient(id: string): string;
  renameWorkspace(id: string, name: string): void;
  renameClient(workspaceId: string, clientId: string, name: string): void;
  assignWorkspace(workspaceId: string, contactId: string): void;
  assignClient(workspaceId: string, clientId: string, contactId: string): void;
}

function WorkspaceBox({
  workspaceId,
  name,
  clients,
  addClient,
  renameWorkspace,
  renameClient,
  assignWorkspace,
  assignClient,
}: WorkspaceBoxProps) {
  const [{ isOverWorkspace }, workspaceDrop] = useDrop(
    () => ({
      accept: 'CONTACT',
      drop: (item: { contactId: string }) => assignWorkspace(workspaceId, item.contactId),
      collect: monitor => ({ isOverWorkspace: monitor.isOver() }),
    }),
    [workspaceId, assignWorkspace]
  );

  return (
    <div
      ref={workspaceDrop}
      className={`rounded border p-3 bg-white shadow-sm space-y-2 transition ${
        isOverWorkspace ? 'ring-2 ring-blue-300' : ''
      }`}
    >
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
      <div className="pl-4 space-y-2">
        {clients.map(c => (
          <ClientBox
            key={c.id}
            workspaceId={workspaceId}
            clientId={c.id}
            name={c.name}
            renameClient={renameClient}
            assignClient={assignClient}
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
}

function ClientBox({ workspaceId, clientId, name, renameClient, assignClient }: ClientBoxProps) {
  const [{ isOverClient }, clientDrop] = useDrop(
    () => ({
      accept: 'CONTACT',
      drop: (item: { contactId: string }) => assignClient(workspaceId, clientId, item.contactId),
      collect: monitor => ({ isOverClient: monitor.isOver() }),
    }),
    [workspaceId, clientId, assignClient]
  );

  return (
    <div
      ref={clientDrop}
      className={`rounded border p-2 bg-gray-50 space-y-2 transition ${
        isOverClient ? 'ring-2 ring-purple-300' : ''
      }`}
    >
      <input
        value={name}
        onChange={e => renameClient(workspaceId, clientId, e.target.value)}
        placeholder="New Client"
        className="border rounded px-2 py-1 w-full text-xs"
      />
      <div className="text-[10px] text-gray-600">
        Drag contacts here for <span className="font-semibold">Account</span> role
      </div>
    </div>
  );
}
