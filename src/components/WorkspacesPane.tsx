import React from 'react';
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
  } = useAppState();

  return (
    <div className="flex flex-col h-full p-3 gap-3 overflow-y-auto">
      <div className="flex items-center gap-2">
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
      <div className="space-y-4">
        {workspaces.map(w => (
          <div key={w.id} className="rounded border p-3 bg-white shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <input
                value={w.name}
                onChange={e => renameWorkspace(w.id, e.target.value)}
                placeholder="New Workspace"
                className="border rounded px-2 py-1 flex-1 text-sm"
              />
              <button
                onClick={() => addClient(w.id)}
                className="flex items-center gap-1 px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-xs"
              >
                <Plus className="w-4 h-4" /> Add Client
              </button>
            </div>
            <div className="pl-4 space-y-2">
              {w.clients.map(c => (
                <div key={c.id} className="rounded border p-2 bg-gray-50">
                  <input
                    value={c.name}
                    onChange={e => renameClient(w.id, c.id, e.target.value)}
                    placeholder="New Client"
                    className="border rounded px-2 py-1 w-full text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
