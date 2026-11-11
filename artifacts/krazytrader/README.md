# KrazyTrader prototype

A cross-platform Expo prototype for a Kenyan rider membership and mobility network. The same app runs on Android and the web, using fictional demonstration data stored locally on each device or browser. It does not connect to a production service.

## Run locally

From the workspace root:

- `pnpm --filter @workspace/krazytrader dev` — start the Expo development server; press `a` for Android or `w` for web.
- `pnpm --filter @workspace/krazytrader android` — start Expo and open a running Android emulator.
- `pnpm --filter @workspace/krazytrader android:qr` — start an ngrok tunnel and a live QR page at `http://localhost:5001` for Expo Go.
- `pnpm --filter @workspace/krazytrader web` — start the app directly in a web browser.
- `pnpm --filter @workspace/krazytrader build` — export a production web build to `dist/` for static hosting.
- `pnpm --filter @workspace/krazytrader typecheck` — typecheck the app.

Android simulation requires Android Studio with an emulator running and available to ADB, or Expo Go on a physical Android device. The QR command may prompt to install Expo's `@expo/ngrok` tunnel helper globally on first use. No Expo account or Replit environment variables are required. Set `EXPO_PORT` or `EXPO_QR_PORT` to change the default ports if needed.

## Deploy to Vercel

Connect the repository to Vercel with the repository root as the project root. The root `vercel.json` runs the Expo static export and serves the app at `/` and the QR utility at `/qr`. Reproduce the deployment output locally with `pnpm --filter @workspace/krazytrader run build`.

The Vercel QR page is a static QR generator; it does not host Metro or create an Expo tunnel. To connect it to a live development app, run `pnpm --filter @workspace/krazytrader run android:qr` locally, then paste the `exp://…exp.direct` address shown by Expo into the deployed `/qr` page. The same address can be passed as a URL-encoded `url` query parameter.

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

## Demo boundary

Sign-in uses a repeatable demo code; registration, profile changes, preferences and membership state are local-only. There is no live authentication, SMS, identity verification, document upload, API persistence, vehicle financing, insurance, notification delivery or support submission.
