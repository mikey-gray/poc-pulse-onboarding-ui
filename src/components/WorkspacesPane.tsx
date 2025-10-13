import React from 'react';
import { useDrop } from 'react-dnd';
import { BookPlus, SquarePlus, X } from 'lucide-react';
import { useAppState } from '../state/StateContext';

// Clean implementation replacing corrupted nested content
type Palette = 'company' | 'workspace' | 'client';

function Chip({ children, onRemove, palette }: { children: React.ReactNode; onRemove(): void; palette: Palette }) {
  const base = {
    company: 'bg-company-100 border-company-300 text-company-800',
    workspace: 'bg-workspace-100 border-workspace-300 text-workspace-800',
    client: 'bg-client-100 border-client-300 text-client-800',
  }[palette];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] ${base}`}>
      {children}
      <button onClick={onRemove} aria-label="Remove" className="hover:text-red-600 text-gray-500">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

interface DragTargetProps {
  palette: Palette;
  roleLabel: string;
  isOver: boolean;
  assignments: string[]; // contactIds
  contacts: { id: string; name: string }[];
  onRemove(contactId: string): void;
  children?: React.ReactNode; // optional extra (like add client button)
}

function DragTarget({ palette, roleLabel, isOver, assignments, contacts, onRemove, children }: DragTargetProps) {
  const paletteClasses = {
    company: {
      box: 'border-company-400 bg-company-50',
      active: 'ring-2 ring-company-300',
    },
    workspace: {
      box: 'border-workspace-400 bg-workspace-50',
      active: 'ring-2 ring-workspace-300',
    },
    client: {
      box: 'border-client-400 bg-client-50',
      active: 'ring-2 ring-client-300',
    },
  }[palette];
  return (
    <div className={`rounded border-dashed border px-2 py-2 space-y-1 transition ${paletteClasses.box} ${isOver ? paletteClasses.active : ''}`}>      
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
              <Chip
                key={id}
                palette={palette}
                onRemove={() => onRemove(id)}
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
    <div className="flex flex-col h-full p-3 gap-4 overflow-y-auto bg-company-100">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          placeholder="Company Name"
          className="flex-1 text-lg font-semibold bg-transparent border border-transparent focus:border-company-400 focus:bg-company-50/40 hover:border-company-300 rounded px-3 py-2 transition"
        />
        <button
          onClick={addWorkspace}
          className="flex items-center gap-1 px-3 py-2 rounded bg-workspace-500 hover:bg-workspace-600 text-white text-sm shadow-sm"
        >
          <BookPlus className="w-4 h-4" /> Workspace
        </button>
      </div>
      <div ref={companyDrop}>
        <DragTarget
          palette="company"
          roleLabel="Admin"
          isOver={isOverCompany}
          assignments={companyAssignments.map(a => a.contactId)}
          contacts={contacts}
          onRemove={removeCompanyAssignment}
        />
      </div>
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

  const assignedIds = workspaceAssignments.filter(a => a.workspaceId === workspaceId).map(a => a.contactId);

  return (
    <div className={`rounded p-3 shadow-sm space-y-3 transition bg-workspace-100 border border-transparent hover:border-workspace-300`}>      
      <div className="flex items-center gap-2">
        <input
          value={name}
          onChange={e => renameWorkspace(workspaceId, e.target.value)}
          placeholder="Workspace"
          className="flex-1 font-medium text-base bg-transparent border border-transparent focus:border-workspace-400 focus:bg-workspace-50/40 hover:border-workspace-300 rounded px-2 py-1 transition"
        />
        <button onClick={() => addClient(workspaceId)} className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-client-500 hover:bg-client-600 text-white text-xs shadow-sm">
          <SquarePlus className="w-4 h-4" /> Client
        </button>
      </div>
      <div ref={workspaceDrop}>
        <DragTarget
          palette="workspace"
          roleLabel="Senior Manager"
          isOver={isOverWorkspace}
          assignments={assignedIds}
          contacts={contacts}
          onRemove={(id) => removeWorkspaceAssignment(workspaceId, id)}
        />
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))' }}>
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

  const assignedIds = clientAssignments.filter(a => a.clientId === clientId).map(a => a.contactId);

  return (
    <div className={`rounded p-2 space-y-2 transition bg-client-100 border border-transparent hover:border-client-300`}>
      <input
        value={name}
        onChange={e => renameClient(workspaceId, clientId, e.target.value)}
        placeholder="Client"
        className="w-full text-xs bg-transparent border border-transparent focus:border-client-400 focus:bg-client-50/40 hover:border-client-300 rounded px-2 py-1 transition"
      />
      <div ref={clientDrop}>
        <DragTarget
          palette="client"
          roleLabel="Account Manager"
          isOver={isOverClient}
          assignments={assignedIds}
          contacts={contacts}
          onRemove={(id) => removeClientAssignment(clientId, id)}
        />
      </div>
    </div>
  );
}
