# KrazyTrader prototype

A cross-platform Expo prototype for a Kenyan rider membership and mobility network. The same app runs on Android and the web, using fictional demonstration data stored locally on each device or browser. It does not connect to a production service.

## Run locally

From the workspace root:

- `pnpm --filter @workspace/krazytrader dev` — start the Expo development server; press `a` for Android or `w` for web.
- `pnpm --filter @workspace/krazytrader android` — start Expo and open a running Android emulator.
- `pnpm --filter @workspace/krazytrader android:qr` — start a minified Expo Go ngrok preview and a live QR page at `http://localhost:5001`.
- `pnpm --filter @workspace/krazytrader web` — start the app directly in a web browser.
- `pnpm --filter @workspace/krazytrader build` — export a production web build to `dist/` for static hosting.
- `pnpm --filter @workspace/krazytrader typecheck` — typecheck the app.

Android simulation requires Android Studio with an emulator running and available to ADB, or Expo Go on a physical Android device. The QR command may prompt to install Expo's `@expo/ngrok` tunnel helper globally on first use. No Expo account or Replit environment variables are required. Set `EXPO_PORT` or `EXPO_QR_PORT` to change the default ports if needed.

## Deploy to Vercel

Connect the repository to Vercel with the repository root as the project root. The root `vercel.json` serves the information/QR landing page at `/`, keeps `/qr` as an alias, and enables the Expo web routes at clean URLs such as `/welcome`. The landing page includes separate Expo Go QR, APK download, and web preview actions. Reproduce the deployment output locally with `pnpm --filter @workspace/krazytrader run build`.

Vercel hosts the web app and QR page, not Metro. Set `EXPO_ANDROID_APK_URL` in Vercel to the direct HTTPS `.apk` artifact URL from EAS. The landing page links directly to the EAS-hosted APK because the artifact exceeds Vercel's 100 MiB static-file limit. Internal EAS artifact URLs expire, so replace the URL and redeploy after each new APK build. Do not use the EAS build-details page URL here. The QR itself contains only an `exp://` or `exps://` Expo Go URL. Optionally set `EXPO_GO_URL` to prefill the QR; because tunnel URLs can change, operators can instead paste the current link into the hosted page without redeploying.

## Android Preview Release

The EAS `preview` profile builds an installable internal-distribution APK. This is the persistent internet preview; Expo Go is only a development client and requires a running Metro server.

1. Install the EAS CLI with `npm install --global eas-cli`. Create an Expo access token in your Expo account settings, then set `EXPO_TOKEN` in the terminal environment. This token-based flow avoids the localhost OAuth callback, which is not reachable from some Codespaces browser setups. Never commit the token or paste it into chat.
2. Verify authentication with `eas whoami`. From `artifacts/krazytrader`, run `eas init` once to create/link the Expo project. Keep the generated `extra.eas.projectId` in `app.json`.
3. From the workspace root, run `pnpm --filter @workspace/krazytrader run android:build:preview`. The preview APK is configured for EAS Update on the `preview` channel.
4. Copy the completed EAS build's direct `.apk` artifact URL into Vercel's `EXPO_ANDROID_APK_URL` environment variable and redeploy.
5. Install this OTA-enabled APK once. Later JavaScript and asset updates are downloaded by the app automatically; users do not need to download or reinstall another APK.

Rebuild the preview APK and update that Vercel variable when native app configuration or dependencies change. The `production` EAS profile creates an Android App Bundle for a later Play Store release.

## Over-the-Air Updates

EAS Update is configured with an `appVersion` runtime policy and `preview`/`production` channels. A GitHub Actions workflow publishes Android updates to `preview` when app source or assets change on `main`. Add an Expo access token as the repository Actions secret `EXPO_TOKEN` to enable it. Changes to native dependencies, `app.json`, `eas.json`, or build settings are intentionally excluded and require a new APK.

To publish manually, run `pnpm --filter @workspace/krazytrader run android:update:preview` and provide an update message when prompted. OTA bundles are downloaded by the installed app and activate on a subsequent app launch; they do not replace the APK or require reinstalling it. Only JavaScript and bundled assets are eligible. The workspace's one-day package age gate remains enabled; the exact Expo OTA package versions are temporarily allowlisted and should be removed from `pnpm-workspace.yaml` once they pass the age check.

For Expo Go simulation, `pnpm --filter @workspace/krazytrader run android:qr` starts Metro through ngrok with `--no-dev --minify` and serves a local QR page. This reduces the JS bundle sent to Expo Go and disables development tooling/Fast Refresh. The Expo URL expires when that server stops; for an internet-facing simulation, keep the command running on an always-on host, then paste its printed `exp://…exp.direct` URL into the Vercel QR page. The APK download button is independent of the Expo Go QR.

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
