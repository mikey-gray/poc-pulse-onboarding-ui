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
    assignWorkspaceAdmin,
    assignWorkspaceSeniorManager,
    workspaceAdminAssignments,
    workspaceSeniorManagerAssignments,
    removeWorkspaceAdminAssignment,
    removeWorkspaceSeniorManagerAssignment,
    contacts,
  } = useAppState();

  const [{ isOverWorkspaceAdmin: _isOverWorkspaceAdmin }, adminDrop] = useDrop<{ contactId: string }, void, { isOverWorkspaceAdmin: boolean }>(() => ({
    accept: 'CONTACT',
    drop: item => assignWorkspaceAdmin(workspace.id, item.contactId),
    collect: monitor => ({ isOverWorkspaceAdmin: monitor.isOver() }),
  }), [workspace.id, assignWorkspaceAdmin]);

  const [{ isOverWorkspaceSenior: _isOverWorkspaceSenior }, seniorDrop] = useDrop<{ contactId: string }, void, { isOverWorkspaceSenior: boolean }>(() => ({
    accept: 'CONTACT',
    drop: item => assignWorkspaceSeniorManager(workspace.id, item.contactId),
    collect: monitor => ({ isOverWorkspaceSenior: monitor.isOver() }),
  }), [workspace.id, assignWorkspaceSeniorManager]);

  const adminAssignedIds = workspaceAdminAssignments.filter(a => a.workspaceId === workspace.id).map(a => a.contactId);
  const seniorAssignedIds = workspaceSeniorManagerAssignments.filter(a => a.workspaceId === workspace.id).map(a => a.contactId);

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
          className="flex items-center justify-center h-5 w-5 -mt-6 -mr-1 rounded-full border border-workspace-300 text-workspace-500 hover:border-red-500 hover:text-red-600 bg-white text-xs"
          title="Remove workspace"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
        <div ref={adminDrop}>
          <DragTarget
            palette="workspace"
            roleLabel="Workspace Admin"
            assignments={adminAssignedIds}
            contacts={contacts}
            onRemove={(id) => removeWorkspaceAdminAssignment(workspace.id, id)}
            onDrop={(contactId) => assignWorkspaceAdmin(workspace.id, contactId)}
          />
        </div>
        <div ref={seniorDrop}>
          <DragTarget
            palette="workspace"
            roleLabel="Senior Manager"
            assignments={seniorAssignedIds}
            contacts={contacts}
            onRemove={(id) => removeWorkspaceSeniorManagerAssignment(workspace.id, id)}
            onDrop={(contactId) => assignWorkspaceSeniorManager(workspace.id, contactId)}
          />
        </div>
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