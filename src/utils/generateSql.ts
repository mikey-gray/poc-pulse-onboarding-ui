import { AppState } from '../state/types';

// Generate illustrative SQL statements representing current state.
// Schema assumptions (simplified / fictional):
// users(id, name, email)
// pulse_companies(id, name)
// pulse_workspaces(id, company_id, name)
// pulse_clients(id, workspace_id, name)
// pulse_user_companies(user_id, company_id, role)
// pulse_workspace_user(workspace_id, user_id, role)
// pulse_user_clients(client_id, user_id, role)
// Notes: company id is fixed to 1 for this prototype. Workspace/client ids use in-memory ids.

export function generateSql(state: AppState): string {
  const lines: string[] = [];

  // Company
  const companyId = 1;
  lines.push('-- Company');
  lines.push(`INSERT INTO pulse_companies (id, name) VALUES (${companyId}, ${sqlLit(state.companyName || 'Untitled Company')});`);
  lines.push('');

  // Users (only those with a role anywhere)
  lines.push('-- Users (with roles)');
  const roleContactIds = new Set<string>([
    ...state.ownerAssignments.map(a => a.contactId),
    ...state.workspaceAdminAssignments.map(a => a.contactId),
    ...state.workspaceSeniorManagerAssignments.map(a => a.contactId),
    ...state.accountManagerAssignments.map(a => a.contactId),
    ...state.recipientAssignments.map(a => a.contactId),
  ]);
  state.contacts.forEach(c => {
    if (roleContactIds.has(c.id)) {
      lines.push(`INSERT INTO users (id, name, email) VALUES (${sqlLit(c.id)}, ${sqlLit(c.name)}, ${sqlLit(c.email)});`);
    }
  });
  lines.push('');

  // Workspaces
  lines.push('-- Workspaces');
  state.workspaces.forEach(w => {
    lines.push(`INSERT INTO pulse_workspaces (id, company_id, name) VALUES (${sqlLit(w.id)}, ${companyId}, ${sqlLit(w.name || 'Untitled Workspace')});`);
    w.clients.forEach(cl => {
      lines.push(`INSERT INTO pulse_clients (id, workspace_id, name) VALUES (${sqlLit(cl.id)}, ${sqlLit(w.id)}, ${sqlLit(cl.name || 'Untitled Client')});`);
    });
  });
  lines.push('');

  // Company Owner assignments
  lines.push('-- Company Owner Assignments');
  state.ownerAssignments.forEach(a => {
    lines.push(`INSERT INTO pulse_user_companies (user_id, company_id, role) VALUES (${sqlLit(a.contactId)}, ${companyId}, ${sqlLit(a.role)});`);
  });
  lines.push('');

  // Workspace Admin assignments
  lines.push('-- Workspace Admin Assignments');
  state.workspaceAdminAssignments.forEach(a => {
    lines.push(`INSERT INTO pulse_workspace_user (workspace_id, user_id, role) VALUES (${sqlLit(a.workspaceId)}, ${sqlLit(a.contactId)}, ${sqlLit(a.role)});`);
  });
  lines.push('');
  // Workspace Senior Manager assignments
  lines.push('-- Workspace Senior Manager Assignments');
  state.workspaceSeniorManagerAssignments.forEach(a => {
    lines.push(`INSERT INTO pulse_workspace_user (workspace_id, user_id, role) VALUES (${sqlLit(a.workspaceId)}, ${sqlLit(a.contactId)}, ${sqlLit(a.role)});`);
  });
  lines.push('');

  // Client Account Manager assignments
  lines.push('-- Client Account Manager Assignments');
  state.accountManagerAssignments.forEach(a => {
    lines.push(`INSERT INTO pulse_user_clients (client_id, user_id, role) VALUES (${sqlLit(a.clientId)}, ${sqlLit(a.contactId)}, ${sqlLit(a.role)});`);
  });
  lines.push('');

  // Client Recipient assignments
  lines.push('-- Client Recipient Assignments');
  state.recipientAssignments.forEach(a => {
    lines.push(`INSERT INTO pulse_client_recipients (client_id, user_id, role) VALUES (${sqlLit(a.clientId)}, ${sqlLit(a.contactId)}, ${sqlLit(a.role)});`);
  });
  lines.push('');

  // Basic commentary for referential integrity (fictional)
  lines.push('-- NOTE: This SQL is illustrative only and may need adaptation for actual schema constraints.');

  return lines.join('\n');
}

function sqlLit(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return value.toString();
  // Escape single quotes
  return `'$${value.replace(/'/g, "''")}$'`.replace(/^'\$\$/,'$$'); // simple placeholder quoting; adjust as needed
}
