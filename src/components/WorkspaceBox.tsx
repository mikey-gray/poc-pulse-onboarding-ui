import React from 'react';
import { SquarePlus, X } from 'lucide-react';
import { useDrop } from 'react-dnd';
import { useAppState } from '../state/StateContext';
import DragTarget from './DragTarget';
import ClientBox from './ClientBox';

interface WorkspaceBoxProps {
  workspace: { id: string; name: string; clients: { id: string; name: string }[] };
}

export function WorkspaceBox({ workspace }: WorkspaceBoxProps) {
  const {
    renameWorkspace,
    addClient,
    removeWorkspace,
    assignWorkspace,
    workspaceAssignments,
    removeWorkspaceAssignment,
    contacts,
    clientAssignments,
    assignClient,
  } = useAppState();

  const [{ isOverWorkspace }, workspaceDrop] = useDrop<{ contactId: string }, void, { isOverWorkspace: boolean }>(() => ({
    accept: 'CONTACT',
    drop: item => assignWorkspace(workspace.id, item.contactId),
    collect: monitor => ({ isOverWorkspace: monitor.isOver() }),
  }), [workspace.id, assignWorkspace]);

  const assignedIds = workspaceAssignments.filter(a => a.workspaceId === workspace.id).map(a => a.contactId);

  return (
    <div className="rounded p-3 shadow-sm space-y-3 transition bg-workspace-100 border border-transparent hover:border-workspace-300">
      <div className="flex items-center gap-2">
        <input
          value={workspace.name}
          onChange={e => renameWorkspace(workspace.id, e.target.value)}
          placeholder="Workspace"
          className="flex-1 font-medium text-base bg-transparent border border-transparent focus:border-workspace-400 focus:bg-workspace-50/40 hover:border-workspace-300 rounded px-2 py-1 transition"
        />
        <button onClick={() => addClient(workspace.id)} className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-client-500 hover:bg-client-600 text-white text-xs shadow-sm">
          <SquarePlus className="w-4 h-4" /> Client
        </button>
        <button
          onClick={() => removeWorkspace(workspace.id)}
          className="flex items-center justify-center px-2 py-1 rounded border border-workspace-300 text-workspace-500 hover:border-red-500 hover:text-red-600 bg-white text-xs"
          title="Remove workspace"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div ref={workspaceDrop}>
        <DragTarget
          palette="workspace"
          roleLabel="Senior Manager"
          assignments={assignedIds}
          contacts={contacts}
          onRemove={(id) => removeWorkspaceAssignment(workspace.id, id)}
          onDrop={(contactId) => assignWorkspace(workspace.id, contactId)}
        />
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))' }}>
        {workspace.clients.map(c => (
          <ClientBox key={c.id} workspaceId={workspace.id} client={c} />
        ))}
      </div>
    </div>
  );
}

export default WorkspaceBox;