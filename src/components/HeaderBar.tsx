import React, { useState } from 'react';
import { RotateCcw, Eye, Activity, X } from 'lucide-react';
import { useAppState } from '../state/StateContext';

export default function HeaderBar() {
  const { reset, ...state } = useAppState();
  const [show, setShow] = useState(false);

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white shadow-sm relative">
      <div className="flex items-center gap-2 font-semibold text-lg">
        <Activity className="w-5 h-5" />
        <span>Pulse Onboarding</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={reset} className="flex items-center gap-1 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        <button onClick={() => setShow(true)} className="flex items-center gap-1 px-3 py-1 rounded bg-indigo-100 hover:bg-indigo-200 text-sm">
          <Eye className="w-4 h-4" /> View State
        </button>
      </div>
      {show && (
        <div className="absolute top-full right-4 mt-2 z-10 w-96 max-h-[60vh] bg-white border rounded shadow-lg flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <span className="font-medium text-sm">Current State</span>
            <button onClick={() => setShow(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
          <pre className="text-xs p-3 overflow-auto flex-1 bg-gray-50">{JSON.stringify(state, null, 2)}</pre>
        </div>
      )}
    </header>
  );
}
