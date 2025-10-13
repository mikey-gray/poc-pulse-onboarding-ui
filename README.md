## Pulse Onboarding UI

Prototype single-page React + TypeScript application for organising contacts into company, workspaces, and clients. Built with Vite and Tailwind.

### Features Implemented

- Header with Reset and View State (JSON) popover
- Resizable split layout (contacts left, workspaces/clients right)
- Add / Import sample contacts, alphabetised list
- Create workspaces and clients with editable names
- Centralised state context with reset capability

### Planned (Not Yet Implemented)

- Drag & drop of contacts assigning roles (Admin, Manager, Account)
- Azure AD OAuth import of real contacts
- Persistent storage (localStorage / backend API)
- Accessibility & keyboard navigation improvements
- Tests (state mutation logic)

### Getting Started

Install dependencies and start dev server:

```bash
npm install
npm run dev
```

Then open the printed localhost port (default 5173).

### Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Production build (not required for local POC)
- `npm run preview` - Preview production build
- `npm run test` - Run Vitest tests (to be added)
- `npm run lint` - Lint sources

### Tech Stack

- React 18 + TypeScript
- Vite bundler
- Tailwind CSS for styling
- Lucide icons
- react-dnd (planned drag & drop)
- Vitest (tests)

### State Shape

Refer to `src/state/types.ts` for full interfaces of contacts, workspaces, clients, and assignments.

### Next Steps

See Planned section above; after drag & drop is added, integrate role assignment and display under each entity. Add tests before expanding features.

# poc-pulse-onboarding-ui
A POC for a new way to onboard user to the clientshare pulse application
