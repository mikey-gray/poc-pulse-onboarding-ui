# Pulse Onboarding UI

## Overview

Prototype single-page React + TypeScript application for organising contacts into company, workspaces, and clients.

## Getting Started

Install dependencies and start dev server:

```bash
npm install
npm run dev
```

## Commands

- `npm run dev` - Start Vite dev server
- `npm run build` - Production build (optional for local POC)
- `npm run preview` - Preview production build
- `npm run lint` - Lint sources

## CSV Contact Import (POC)

Clicking "Import CSV" opens a native file picker restricted to `.csv`. Each non-empty row should contain two comma-separated values: `name,email`. Lines where the second value is not a valid email are ignored. If no valid rows are found an error message appears showing an example format.

Example rows:

```text
John Doe,john@example.com
Jane Smith,jane@domain.org
```

Duplicate handling: Rows whose email already exists in the current contact list are skipped silently. Manual add form also prevents duplicates and flags invalid emails with a red outline.

An example file is provided at `example-contacts.csv` with 25 sample rows.

Future: Could reintroduce Graph import behind a feature flag, add CSV header handling, or support other delimiters.

## Roles & Assignments

You can remove:

- A contact (removes all its owner/workspace/client role assignments)
- A workspace (removes its Workspace Admin and Senior Manager assignments and all Account Manager assignments for its clients)
- A client (removes its Account Manager and Recipient assignments)

Drag & drop:

- Drag a contact onto the company box to assign as an Owner
- Drag onto a workspace (first drop zone) to assign as a Workspace Admin
- Drag onto the second workspace drop zone to assign as a Senior Manager
- Drag onto a client to assign as an Account Manager
- Drag onto the second client drop zone to add as a Recipient

Chips appear for each assignment; click the × to remove that single assignment.

## Refactor Notes

Components have been extracted for clarity and reduced prop drilling:

- `WorkspaceBox` and `ClientBox` use the state hook directly
- `DraggableContact` encapsulates drag behavior
- `DragTarget` centralizes drop zone visuals & logic
- `Chip` unifies styling for assignment pills

Assignment arrays now in state:

- `ownerAssignments`
- `workspaceAdminAssignments`
- `workspaceSeniorManagerAssignments`
- `accountManagerAssignments`
- `recipientAssignments`

Action type aliases are defined in `src/state/actions.ts` for developer ergonomics.

## State Shape

Refer to `src/state/types.ts` for full interfaces of contacts, workspaces, clients, and assignments. See `src/state/StateContext.tsx` for mutation logic.
