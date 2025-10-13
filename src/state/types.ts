export interface Contact {
  id: string;
  name: string;
  email: string;
}

export type Role = 'Admin' | 'Manager' | 'Account';

export interface ClientAssignment {
  clientId: string;
  contactId: string;
  role: Role; // Account
}

export interface WorkspaceAssignment {
  workspaceId: string;
  contactId: string;
  role: Role; // Manager
}

export interface CompanyAssignment {
  contactId: string;
  role: Role; // Admin
}

export interface Client {
  id: string;
  name: string;
}

export interface Workspace {
  id: string;
  name: string;
  clients: Client[];
}

export interface AppState {
  companyName: string;
  contacts: Contact[];
  workspaces: Workspace[];
  companyAssignments: CompanyAssignment[];
  workspaceAssignments: WorkspaceAssignment[];
  clientAssignments: ClientAssignment[];
}
