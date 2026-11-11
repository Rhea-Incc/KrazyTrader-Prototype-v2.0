# KrazyTrader — Phase 01 prototype

An Android-oriented Expo shell for a Kenyan rider membership and mobility network. It establishes the visual identity, primary navigation, reusable mobile UI, fictional demonstration records and future route placeholders. It does not connect to a production service.

## Folder structure

- `app/` — Expo Router screens; `(tabs)/` contains Home, Membership, Vehicles, Benefits and Profile.
- `components/ui.tsx` — shared buttons, cards, fields, status indicators, dialogs and loading/empty/error states.
- `constants/` and `hooks/` — semantic brand colors and the theme hook.
- `types/models.ts` — shared TypeScript product models.
- `data/demo.ts` — fictional Kenyan riders, SACCO, vehicles, partners, benefits and notifications.
- `utils/format.ts` — KES, date and rider-name formatting helpers.
- `assets/` — supplied KrazyTrader logo and vehicle photos plus the app icon.

## Architecture decisions

- Expo Router owns navigation; the five primary destinations are tabs, with registration, financing, insurance, notifications, support and detail routes in the root stack.
- Product UI reads shared semantic colors from the local theme rather than defining component-specific palettes.
- Screens use local demonstration data only. No database, authentication, payments, OTP, KYC, lender, dealer or insurer integrations are active.
- Vehicle and offer detail screens are interactive previews. Their actions explain the scope and do not submit real requests.
- Kenyan currency is formatted in KES and the examples use fictional rider, SACCO, dealer and partner records.

## Phase boundary

This is the Phase 01 foundation only. Onboarding and membership management, real vehicle inquiries and financing, live partner benefits, insurance/emergency service flows, notification delivery and support requests remain for later phases.
