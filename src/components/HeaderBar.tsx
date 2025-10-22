import React, { useState } from 'react';
import { RotateCcw, Activity, X, Database, Boxes } from 'lucide-react';
import { useAppState } from '../state/StateContext';
import { generateSql } from '../utils/generateSql';

export default function HeaderBar() {
  const { reset, ...state } = useAppState();
  const [showState, setShowState] = useState(false);
  const [showSql, setShowSql] = useState(false);
  const sql = showSql ? generateSql(state) : '';

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
        <button onClick={() => setShowState(true)} className="flex items-center gap-1 px-3 py-1 rounded bg-indigo-100 hover:bg-indigo-200 text-sm">
          <Boxes className="w-4 h-4" /> View State
        </button>
        <button onClick={() => setShowSql(true)} className="flex items-center gap-1 px-3 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-sm">
          <Database className="w-4 h-4" /> View SQL
        </button>
      </div>
      {showState && (
        <div className="absolute top-full right-4 mt-2 z-10 w-96 max-h-[60vh] bg-white border rounded shadow-lg flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <span className="font-medium text-sm flex items-center gap-1"><Boxes className="w-4 h-4" />Current State</span>
            <button onClick={() => setShowState(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
          <pre className="text-xs p-3 overflow-auto flex-1 bg-gray-50">{JSON.stringify(state, null, 2)}</pre>
        </div>
      )}
      {showSql && (
        <div className="absolute top-full right-4 mt-2 z-10 w-[640px] max-h-[70vh] bg-white border rounded shadow-lg flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <span className="font-medium text-sm flex items-center gap-1"><Database className="w-4 h-4" />Example SQL</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowSql(false)} className="p-1 hover:bg-gray-100 rounded" title="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <pre className="text-[11px] leading-[14px] p-3 overflow-auto flex-1 bg-gray-50 whitespace-pre">{sql}</pre>
        </div>
      )}
    </header>
  );
}
