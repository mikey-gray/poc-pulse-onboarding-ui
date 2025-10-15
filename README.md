# Pulse Onboarding UI

## Overview

Prototype single-page React + TypeScript application for organising contacts into company, workspaces, and clients. Built with Vite and Tailwind.

## Getting Started

Install dependencies and start dev server:

```bash
npm install
npm run dev
```

Then open the printed localhost port (default 5173).

## Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Production build (not required for local POC)
- `npm run preview` - Preview production build
- `npm run test` - Run Vitest tests (to be added)
- `npm run lint` - Lint sources

## Tech Stack

- React 18 + TypeScript
- Vite bundler
- Tailwind CSS for styling
- Lucide icons
- react-dnd

## Authentication & Microsoft Graph Import

The Import Contacts button authenticates with Azure AD (MSAL popup) and fetches your personal contacts from the Microsoft Graph endpoint `GET /me/contacts`.

### Azure App Registration (Quick Setup)

1. Navigate to Azure Portal > Azure Active Directory > App registrations > New registration.
2. Name: "Pulse Onboarding POC" (any). Supported account types: Single tenant (or Multi-tenant for broader testing).
3. Redirect URI: Add `http://localhost:5173` (type: SPA) or the dev port Vite prints.
4. After creation, copy the Application (client) ID.
5. Under Authentication, ensure "Access tokens" and "ID tokens" are checked for implicit/hybrid if offered. (For MSAL v2 SPA public client, defaults are fine.)
6. Under API Permissions, add Microsoft Graph delegated permissions:
   - `User.Read` (default)
   - `Contacts.Read`
   Grant admin consent if required by your tenant.

### Environment Variables

Create a `.env` file at repo root:

```env
VITE_AZURE_CLIENT_ID=YOUR_CLIENT_ID
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/YOUR_TENANT_ID
```

If `VITE_AZURE_AUTHORITY` is omitted the app falls back to the `common` tenant for multi-tenant sign-in.

Restart `npm run dev` after adding environment variables.

### Permissions & Data Returned

`Contacts.Read` returns only contacts you have stored (not directory users). Each contact is mapped to a local `{ name, email }` shape using `displayName` and the first email address. Contacts without an email are ignored.

### Paging

The fetch routine pages up to 10 iterations of 50 contacts (max ~500) following `@odata.nextLink`.

### POC Limitations

- No token refresh timer; relies on silent acquisition when needed.
- No backend; all tokens live in browser localStorage via MSAL cache.
- No deduplication of existing contacts vs imported ones.
- No CSV import implemented yet.
- Errors are surfaced inline near the Import button.

### Logout

Logout clears the cached account using `logoutPopup`.

## Testing

Vitest is configured. Sample unit tests cover state mutations & Graph mapping logic.

Run:

```bash
npm run test
```

## Future Enhancements

- CSV upload for contacts
- Persistent storage (IndexedDB or backend API)
- Role editing (change assigned role per contact)
- Contact search & filtering
- Accessibility polish for drag & drop
- Deduplicate imports by email
- Offline caching
- Animated drag previews


## State Shape

Refer to `src/state/types.ts` for full interfaces of contacts, workspaces, clients, and assignments.
