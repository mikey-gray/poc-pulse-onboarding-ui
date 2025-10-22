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
- `npm run build` - Production build (not required for local POC)
- `npm run preview` - Preview production build
- `npm run test` - Run Vitest tests (to be added)
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

## Testing

Vitest is configured. Sample unit tests cover state mutations. 

Run:

```bash
npm run test
```

## State Shape

Refer to `src/state/types.ts` for full interfaces of contacts, workspaces, clients, and assignments.
