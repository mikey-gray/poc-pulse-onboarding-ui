import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import HeaderBar from './components/HeaderBar';
import Layout from './components/Layout';
import { StateProvider } from './state/StateContext';

export default function App() {
  return (
    <StateProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col h-full">
          <HeaderBar />
          <Layout />
        </div>
      </DndProvider>
    </StateProvider>
  );
}
