import React from 'react';
import { X } from 'lucide-react';
import { useDrop } from 'react-dnd';
import { useAppState } from '../state/StateContext';
import DragTarget from './DragTarget';

interface ClientBoxProps {
  workspaceId: string;
  client: { id: string; name: string };
}

export function ClientBox({ workspaceId, client }: ClientBoxProps) {
  const {
    renameClient,
    assignClient,
    clientAssignments,
    removeClientAssignment,
    removeClient,
    contacts,
  } = useAppState();

  const [{ isOverClient }, clientDrop] = useDrop<{ contactId: string }, void, { isOverClient: boolean }>(() => ({
    accept: 'CONTACT',
    drop: item => assignClient(workspaceId, client.id, item.contactId),
    collect: monitor => ({ isOverClient: monitor.isOver() }),
  }), [workspaceId, client.id, assignClient]);

  const assignedIds = clientAssignments.filter(a => a.clientId === client.id).map(a => a.contactId);

  return (
    <div className="rounded p-2 space-y-2 transition bg-client-100 border border-transparent hover:border-client-300">
      <div className="flex items-center gap-2">
        <input
          value={client.name}
          onChange={e => renameClient(workspaceId, client.id, e.target.value)}
          placeholder="Client"
          className="flex-1 text-xs bg-transparent border border-transparent focus:border-client-400 focus:bg-client-50/40 hover:border-client-300 rounded px-2 py-1 transition"
        />
        <button
          onClick={() => removeClient(workspaceId, client.id)}
          className="flex items-center justify-center h-4 w-4 -mt-4 -mr-1 rounded-full border border-client-300 text-client-500 hover:border-red-500 hover:text-red-600 bg-white text-xs"
          title="Remove client"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div ref={clientDrop}>
        <DragTarget
          palette="client"
          roleLabel="Account Manager"
          assignments={assignedIds}
          contacts={contacts}
          onRemove={(id) => removeClientAssignment(client.id, id)}
          onDrop={(contactId) => assignClient(workspaceId, client.id, contactId)}
        />
      </div>
    </div>
  );
}

export default ClientBox;