import React from 'react';
import { X } from 'lucide-react';

export type Palette = 'company' | 'workspace' | 'client';

interface ChipProps {
  palette: Palette;
  children: React.ReactNode;
  onRemove(): void;
}

const paletteClasses: Record<Palette, string> = {
  company: 'bg-company-100 border-company-300 text-company-800',
  workspace: 'bg-workspace-100 border-workspace-300 text-workspace-800',
  client: 'bg-client-100 border-client-300 text-client-800',
};

export function Chip({ palette, children, onRemove }: ChipProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] ${paletteClasses[palette]}`}>
      {children}
      <button onClick={onRemove} aria-label="Remove" className="hover:text-red-600 text-gray-500">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

export default Chip;