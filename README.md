# Prosperr Checkout Suite (Assisted Checkout UI)

Frontend prototype for Prosperr's assisted payment checkout journeys:

- customer checkout with OTP and payment flow
- sales/BDA assisted session creation and monitoring
- supervisor approval workflows for below-threshold pricing
- renewal and dependent-ready UX paths

The canonical product/backend source-of-truth for this repo is:

- `docs/assisted-checkout-flow-definition.md`

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Framer Motion (transitions/UX feedback)

## Local setup

```bash
npm install
npm run dev
```

App runs at the Vite default URL (typically `http://localhost:8080` or `http://localhost:5173` depending on your local config).

## Key routes

- `/` - home
- `/checkout` - customer/organic checkout
- `/checkout/session/:sessionId`
- `/checkout/session/:sessionId/:mobile` - assisted customer flow
- `/checkout/sales` - sales portal
- `/checkout/sales/new-session` - create assisted session
- `/checkout/sales/session/:sessionId` - session detail and approval state
- `/checkout/sales/renewal` - renewal flow

## Mock login roles (UI-only)

Sales login is currently mocked for role switching:

- supervisor emails: `a@prosperr.io` ... `f@prosperr.io`
- any other email logs in as BDA

Password is not validated in mock mode.

## NPM scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run preview` - preview built app

## Current status

- UI aligned to assisted checkout flow definitions in sectioned doc
- backend integration points are represented via mock data/state
- approval history, draft/self-approval handling, and session-state messaging are included in UI behavior
