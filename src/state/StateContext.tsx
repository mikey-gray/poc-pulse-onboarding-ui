import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, Contact } from './types';

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
  assignOwner(contactId: string): void;
  assignWorkspaceAdmin(workspaceId: string, contactId: string): void;
  assignWorkspaceSeniorManager(workspaceId: string, contactId: string): void;
  assignAccountManager(workspaceId: string, clientId: string, contactId: string): void;
  removeOwnerAssignment(contactId: string): void;
  removeWorkspaceAdminAssignment(workspaceId: string, contactId: string): void;
  removeWorkspaceSeniorManagerAssignment(workspaceId: string, contactId: string): void;
  removeAccountManagerAssignment(clientId: string, contactId: string): void;
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
    ownerAssignments: [],
    workspaceAdminAssignments: [],
    workspaceSeniorManagerAssignments: [],
    accountManagerAssignments: [],
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
      ownerAssignments: s.ownerAssignments.filter(a => a.contactId !== contactId),
      workspaceAdminAssignments: s.workspaceAdminAssignments.filter(a => a.contactId !== contactId),
      workspaceSeniorManagerAssignments: s.workspaceSeniorManagerAssignments.filter(a => a.contactId !== contactId),
      accountManagerAssignments: s.accountManagerAssignments.filter(a => a.contactId !== contactId),
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
        workspaceAdminAssignments: s.workspaceAdminAssignments.filter(a => a.workspaceId !== workspaceId),
        workspaceSeniorManagerAssignments: s.workspaceSeniorManagerAssignments.filter(a => a.workspaceId !== workspaceId),
        accountManagerAssignments: s.accountManagerAssignments.filter(a => !clientIds.includes(a.clientId)),
      };
    });

  const removeClient = (workspaceId: string, clientId: string) =>
    setState(s => ({
      ...s,
      workspaces: s.workspaces.map(w =>
        w.id === workspaceId ? { ...w, clients: w.clients.filter(c => c.id !== clientId) } : w
      ),
      accountManagerAssignments: s.accountManagerAssignments.filter(a => a.clientId !== clientId),
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

  const assignOwner = (contactId: string) =>
    setState(s => ({
      ...s,
      ownerAssignments: s.ownerAssignments.some(a => a.contactId === contactId)
        ? s.ownerAssignments
        : [...s.ownerAssignments, { contactId, role: 'Owner' }],
    }));

  const assignWorkspaceAdmin = (workspaceId: string, contactId: string) =>
    setState(s => ({
      ...s,
      workspaceAdminAssignments: s.workspaceAdminAssignments.some(
        a => a.workspaceId === workspaceId && a.contactId === contactId
      )
        ? s.workspaceAdminAssignments
        : [...s.workspaceAdminAssignments, { workspaceId, contactId, role: 'WorkspaceAdmin' }],
    }));

  const assignWorkspaceSeniorManager = (workspaceId: string, contactId: string) =>
    setState(s => ({
      ...s,
      workspaceSeniorManagerAssignments: s.workspaceSeniorManagerAssignments.some(
        a => a.workspaceId === workspaceId && a.contactId === contactId
      )
        ? s.workspaceSeniorManagerAssignments
        : [...s.workspaceSeniorManagerAssignments, { workspaceId, contactId, role: 'SeniorManager' }],
    }));

  const assignAccountManager = (workspaceId: string, clientId: string, contactId: string) =>
    setState(s => ({
      ...s,
      accountManagerAssignments: s.accountManagerAssignments.some(
        a => a.clientId === clientId && a.contactId === contactId
      )
        ? s.accountManagerAssignments
        : [...s.accountManagerAssignments, { clientId, contactId, role: 'AccountManager' }],
    }));

  const removeOwnerAssignment = (contactId: string) =>
    setState(s => ({
      ...s,
      ownerAssignments: s.ownerAssignments.filter(a => a.contactId !== contactId),
    }));

  const removeWorkspaceAdminAssignment = (workspaceId: string, contactId: string) =>
    setState(s => ({
      ...s,
      workspaceAdminAssignments: s.workspaceAdminAssignments.filter(
        a => !(a.workspaceId === workspaceId && a.contactId === contactId)
      ),
    }));

  const removeWorkspaceSeniorManagerAssignment = (workspaceId: string, contactId: string) =>
    setState(s => ({
      ...s,
      workspaceSeniorManagerAssignments: s.workspaceSeniorManagerAssignments.filter(
        a => !(a.workspaceId === workspaceId && a.contactId === contactId)
      ),
    }));

  const removeAccountManagerAssignment = (clientId: string, contactId: string) =>
    setState(s => ({
      ...s,
      accountManagerAssignments: s.accountManagerAssignments.filter(
        a => !(a.clientId === clientId && a.contactId === contactId)
      ),
    }));

  const reset = () =>
    setState({
      companyName: '',
      contacts: initialContacts,
      workspaces: [],
      ownerAssignments: [],
      workspaceAdminAssignments: [],
      workspaceSeniorManagerAssignments: [],
      accountManagerAssignments: [],
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
    assignOwner,
    assignWorkspaceAdmin,
    assignWorkspaceSeniorManager,
    assignAccountManager,
    removeOwnerAssignment,
    removeWorkspaceAdminAssignment,
    removeWorkspaceSeniorManagerAssignment,
    removeAccountManagerAssignment,
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
