import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, Contact, Workspace, WorkspaceAssignment, CompanyAssignment, ClientAssignment } from './types';

interface StateContextValue extends AppState {
  setCompanyName(name: string): void;
  addContact(contact: Omit<Contact, 'id'>): void;
  importContacts(list: Omit<Contact, 'id'>[]): void;
  removeContact(contactId: string): void;
  addWorkspace(): string;
  renameWorkspace(id: string, name: string): void;
  addClient(workspaceId: string): string;
  renameClient(workspaceId: string, clientId: string, name: string): void;
  removeWorkspace(id: string): void;
  removeClient(workspaceId: string, clientId: string): void;
  assignCompany(contactId: string): void;
  assignWorkspace(workspaceId: string, contactId: string): void;
  assignClient(workspaceId: string, clientId: string, contactId: string): void;
  removeCompanyAssignment(contactId: string): void;
  removeWorkspaceAssignment(workspaceId: string, contactId: string): void;
  removeClientAssignment(clientId: string, contactId: string): void;
  reset(): void;
}

const StateContext = createContext<StateContextValue | undefined>(undefined);

const initialContacts: Contact[] = [
  { id: crypto.randomUUID(), name: 'Example User', email: 'contact@example.com' },
];

export function StateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    companyName: '',
    contacts: initialContacts,
    workspaces: [],
    companyAssignments: [],
    workspaceAssignments: [],
    clientAssignments: [],
  });

  const setCompanyName = (companyName: string) => setState(s => ({ ...s, companyName }));

  const addContact = (contact: Omit<Contact, 'id'>) =>
    setState(s => ({ ...s, contacts: [...s.contacts, { ...contact, id: crypto.randomUUID() }] }));

  const importContacts = (list: Omit<Contact, 'id'>[]) =>
    setState(s => ({ ...s, contacts: [...s.contacts, ...list.map(c => ({ ...c, id: crypto.randomUUID() }))] }));

  const removeContact = (contactId: string) =>
    setState(s => ({
      ...s,
      contacts: s.contacts.filter(c => c.id !== contactId),
      companyAssignments: s.companyAssignments.filter(a => a.contactId !== contactId),
      workspaceAssignments: s.workspaceAssignments.filter(a => a.contactId !== contactId),
      clientAssignments: s.clientAssignments.filter(a => a.contactId !== contactId),
    }));

  const addWorkspace = () => {
    const id = crypto.randomUUID();
    setState(s => ({ ...s, workspaces: [...s.workspaces, { id, name: '', clients: [] }] }));
    return id;
  };

  const renameWorkspace = (id: string, name: string) =>
    setState(s => ({ ...s, workspaces: s.workspaces.map(w => (w.id === id ? { ...w, name } : w)) }));

  const addClient = (workspaceId: string) => {
    const id = crypto.randomUUID();
    setState(s => ({
      ...s,
      workspaces: s.workspaces.map(w =>
        w.id === workspaceId ? { ...w, clients: [...w.clients, { id, name: '' }] } : w
      ),
    }));
    return id;
  };

  const removeWorkspace = (workspaceId: string) =>
    setState(s => {
      const ws = s.workspaces.find(w => w.id === workspaceId);
      const clientIds = ws ? ws.clients.map(c => c.id) : [];
      return {
        ...s,
        workspaces: s.workspaces.filter(w => w.id !== workspaceId),
        workspaceAssignments: s.workspaceAssignments.filter(a => a.workspaceId !== workspaceId),
        clientAssignments: s.clientAssignments.filter(a => !clientIds.includes(a.clientId)),
      };
    });

  const removeClient = (workspaceId: string, clientId: string) =>
    setState(s => ({
      ...s,
      workspaces: s.workspaces.map(w =>
        w.id === workspaceId ? { ...w, clients: w.clients.filter(c => c.id !== clientId) } : w
      ),
      clientAssignments: s.clientAssignments.filter(a => a.clientId !== clientId),
    }));

  const renameClient = (workspaceId: string, clientId: string, name: string) =>
    setState(s => ({
      ...s,
      workspaces: s.workspaces.map(w =>
        w.id === workspaceId
          ? {
              ...w,
              clients: w.clients.map(c => (c.id === clientId ? { ...c, name } : c)),
            }
          : w
      ),
    }));

  const assignCompany = (contactId: string) =>
    setState(s => ({
      ...s,
      companyAssignments: s.companyAssignments.some(a => a.contactId === contactId)
        ? s.companyAssignments
        : [...s.companyAssignments, { contactId, role: 'Admin' }],
    }));

  const assignWorkspace = (workspaceId: string, contactId: string) =>
    setState(s => ({
      ...s,
      workspaceAssignments: s.workspaceAssignments.some(
        a => a.workspaceId === workspaceId && a.contactId === contactId
      )
        ? s.workspaceAssignments
        : [...s.workspaceAssignments, { workspaceId, contactId, role: 'Manager' }],
    }));

  const assignClient = (workspaceId: string, clientId: string, contactId: string) =>
    setState(s => ({
      ...s,
      clientAssignments: s.clientAssignments.some(
        a => a.clientId === clientId && a.contactId === contactId
      )
        ? s.clientAssignments
        : [...s.clientAssignments, { clientId, contactId, role: 'Account' }],
    }));

  const removeCompanyAssignment = (contactId: string) =>
    setState(s => ({
      ...s,
      companyAssignments: s.companyAssignments.filter(a => a.contactId !== contactId),
    }));

  const removeWorkspaceAssignment = (workspaceId: string, contactId: string) =>
    setState(s => ({
      ...s,
      workspaceAssignments: s.workspaceAssignments.filter(
        a => !(a.workspaceId === workspaceId && a.contactId === contactId)
      ),
    }));

  const removeClientAssignment = (clientId: string, contactId: string) =>
    setState(s => ({
      ...s,
      clientAssignments: s.clientAssignments.filter(
        a => !(a.clientId === clientId && a.contactId === contactId)
      ),
    }));

  const reset = () =>
    setState({
      companyName: '',
      contacts: initialContacts,
      workspaces: [],
      companyAssignments: [],
      workspaceAssignments: [],
      clientAssignments: [],
    });

  const value: StateContextValue = {
    ...state,
    setCompanyName,
    addContact,
    importContacts,
    addWorkspace,
    renameWorkspace,
    addClient,
    renameClient,
    assignCompany,
    assignWorkspace,
    assignClient,
    removeCompanyAssignment,
    removeWorkspaceAssignment,
    removeClientAssignment,
    removeWorkspace,
    removeClient,
    removeContact,
    reset,
  };

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error('useAppState must be used within StateProvider');
  return ctx;
}
