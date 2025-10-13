import React, { useState } from 'react';
import ContactsPane from './ContactsPane';
import WorkspacesPane from './WorkspacesPane';

export default function Layout() {
  const [leftWidth, setLeftWidth] = useState(320); // px

  const minLeft = 200;
  const minRight = 320; // ensure right pane remains usable
  const onDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftWidth;
    const onMove = (moveEvt: MouseEvent) => {
      const delta = moveEvt.clientX - startX;
      const newLeft = Math.max(minLeft, startWidth + delta);
      // Constrain so right pane not below minRight
      const totalWidth = window.innerWidth;
      if (totalWidth - newLeft < minRight) {
        setLeftWidth(totalWidth - minRight);
      } else {
        setLeftWidth(newLeft);
      }
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <div style={{ width: leftWidth }} className="border-r border-gray-200 flex flex-col">
        <ContactsPane />
      </div>
      <div
        onMouseDown={onDrag}
        className="w-1 cursor-col-resize bg-gray-200 hover:bg-gray-300 active:bg-gray-400"
        title="Drag to resize"
      />
      <div className="flex-1 flex flex-col">
        <WorkspacesPane />
      </div>
    </div>
  );
}
