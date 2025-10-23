export interface Contact {
  id: string;
  name: string;
  email: string;
}

export type Role = 'Owner' | 'WorkspaceAdmin' | 'SeniorManager' | 'AccountManager';

export interface AccountManagerAssignment {
  clientId: string;
  contactId: string;
  role: Role; // AccountManager
}

export interface WorkspaceAdminAssignment {
  workspaceId: string;
  contactId: string;
  role: Role; // WorkspaceAdmin
}

export interface WorkspaceSeniorManagerAssignment {
  workspaceId: string;
  contactId: string;
  role: Role; // SeniorManager
}

export interface OwnerAssignment {
  contactId: string;
  role: Role; // Owner
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
  ownerAssignments: OwnerAssignment[];
  workspaceAdminAssignments: WorkspaceAdminAssignment[];
  workspaceSeniorManagerAssignments: WorkspaceSeniorManagerAssignment[];
  accountManagerAssignments: AccountManagerAssignment[];
}
