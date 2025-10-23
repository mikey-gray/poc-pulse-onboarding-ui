import React from 'react';
import { useDrop } from 'react-dnd';
import { BookPlus } from 'lucide-react';
import { useAppState } from '../state/StateContext';
import DragTarget from './DragTarget';
import WorkspaceBox from './WorkspaceBox';

export default function WorkspacesPane() {
  const {
    companyName,
    setCompanyName,
    workspaces,
    addWorkspace,
  assignOwner,
  ownerAssignments,
  removeOwnerAssignment,
    contacts,
  } = useAppState();

  const [{ isOverCompany: _isOverCompany }, companyDrop] = useDrop<{ contactId: string }, void, { isOverCompany: boolean }>(() => ({
    accept: 'CONTACT',
    drop: item => assignOwner(item.contactId),
    collect: monitor => ({ isOverCompany: monitor.isOver() }),
  }), [assignOwner]);

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
          roleLabel="Owner"
          assignments={ownerAssignments.map(a => a.contactId)}
          contacts={contacts}
          onRemove={removeOwnerAssignment}
          onDrop={(contactId) => assignOwner(contactId)}
        />
      </div>
      <div className="space-y-4">
        {workspaces.map(w => (
          <WorkspaceBox key={w.id} workspace={w} />
        ))}
      </div>
    </div>
  );
}
