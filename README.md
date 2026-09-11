# Choro

Choro is a mobile app that helps parents turn everyday chores into a playful reward system for kids.

Parents create children profiles, assign daily tasks, set coin rewards, approve completed tasks, and manage prizes. Kids log in with their child code, complete quests, upload photo proof, earn coins and XP, unlock achievements, redeem rewards, and grow a 3D pet.

## What The App Does

### Parent Experience

- Create and manage a parent account with email/password, Google Sign-In, or Apple Sign-In.
- Complete onboarding by creating the first child, default tasks, and first reward.
- Add and edit children profiles with avatar images.
- Create custom tasks, assign them to one or more children, set repeat days, categories, emoji/icons, coins, and XP.
- Review photo proof submitted by children and approve tasks.
- Create rewards for one or more children, including emoji/icon or uploaded reward image.
- Confirm when a requested reward has been given.
- See dashboard stats for today, pending, review, and done tasks.
- Manage settings: profile image, name, email, password, language, notifications, support links, and account deletion.

### Kid Experience

- Log in with a child code.
- See daily quests in list or map view.
- Submit a task for review with a proof photo.
- Track coins, XP, level progress, streaks, and achievements.
- Claim achievements for coins and XP.
- Redeem available rewards.
- See a 3D pet that grows with level progress.
- Receive push notifications when parents approve tasks or give rewards.

## Tech Stack

- Expo SDK 54
- React Native 0.81
- Expo Router
- TypeScript
- Supabase Auth, Database, Storage, RPC, and Edge Functions
- React Query
- Redux Toolkit
- React Hook Form and Zod
- i18next / react-i18next
- Expo Notifications
- Expo Image Picker
- Three.js / React Three Fiber for the 3D pet
- Jest and React Native Testing Library
- ESLint and Prettier

## Project Structure

```text
app/                         Expo Router routes
features/auth/               Parent and kid auth flows
features/onboarding/         Parent onboarding flow
features/parent-dashboard/   Parent home, children, tasks, rewards, settings
features/kid-dashboard/      Kid home, tasks, rewards, settings, 3D pet
features/notifications/      Push token and notification helpers
components/                  Shared UI components
constants/                   Theme, palette, fonts
hooks/                       Shared React hooks
lib/                         Supabase client, types, constants, utils, i18n helpers
store/                       Redux slices and selectors
supabase/migrations/         Database schema and RPC migrations
supabase/functions/          Supabase Edge Functions
legal-pages/                 Static privacy policy and terms pages
```

## Requirements

- Node.js
- npm
- Expo CLI through `npx expo`
- Supabase project
- EAS account for preview/production builds
- Apple Developer account for TestFlight, Sign in with Apple, and App Store release
- Android Studio / emulator if testing Android locally
- Xcode / iOS Simulator if testing iOS locally on macOS

## Environment Variables

Create a `.env` file in the project root:

```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_or_publishable_key
```

The app reads these values from the Expo public environment. Do not commit real production secrets. The Supabase anon/publishable key is safe for client apps when Row Level Security policies are configured correctly.

## Installation

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm start
```

Run on iOS:

```bash
npm run ios
```

Run on Android:

```bash
npm run android
```

Run on web:

```bash
npm run web
```

Some native features, including Apple Sign-In, push notifications, camera permissions, and the 3D pet stack, should be tested in a development build or EAS build rather than Expo Go.

## Supabase Setup

This project depends on Supabase database tables, storage buckets, RPC functions, and Edge Functions.

Apply database migrations:

```bash
npx supabase db push --linked
```

Deploy Edge Functions:

```bash
npx supabase functions deploy notify-parent-task-review
npx supabase functions deploy notify-child-task-approved
npx supabase functions deploy notify-child-reward-redeemed
npx supabase functions deploy notify-child-reward-given
```

Expected storage buckets:

- `reward-images`
- `task-proofs`
- `profile-avatars`
- `child-avatars`

Make sure each bucket has the correct Row Level Security policies for the app flows.

## Auth Providers

### Email And Password

Supabase email/password auth is used for the parent account.

### Google Sign-In

Google OAuth is configured through Supabase Auth. The app uses the custom scheme:

```text
choro://auth/callback
```

### Sign In With Apple

The app uses native Apple Sign-In through `expo-apple-authentication` and Supabase `signInWithIdToken`.

Required config:

- iOS bundle identifier: `com.kisto4ka.choro`
- `ios.usesAppleSignIn: true` in `app.json`
- Apple provider enabled in Supabase Auth
- `com.kisto4ka.choro` added as an Apple Client ID in Supabase
- Sign in with Apple capability enabled in Apple Developer for the bundle ID

## Push Notifications

The app uses Expo push notifications for:

- notifying parents when a child submits a task for review;
- notifying children when a task is approved;
- notifying parents when a child requests a reward;
- notifying children when a reward is given.

Push tokens are stored in Supabase and Edge Functions send Expo push messages.

For real push tokens, use a real device or an EAS build. iOS simulators may not return valid Expo push tokens.

## Development Scripts

```bash
npm start              # start Expo
npm run ios            # start iOS
npm run android        # start Android
npm run web            # start web
npm run lint           # run Expo ESLint
npm run lint:fix       # fix ESLint issues
npm run prettier:fix   # format files with Prettier
npm run formatter      # run lint fix and Prettier
npm test               # run Jest tests
npm run test:watch     # run Jest in watch mode
```

## Quality Checks

Before opening a PR or making a release build, run:

```bash
npx tsc --noEmit
npm run lint
npm test -- --runInBand --watchman=false
```

## EAS Builds

The project includes `eas.json` with three build profiles:

- `development` for development clients;
- `preview` for internal testing;
- `production` for App Store / Play Store builds.

Build iOS preview:

```bash
eas build --profile preview --platform ios
```

Build Android preview:

```bash
eas build --profile preview --platform android
```

Build production:

```bash
eas build --profile production --platform all
```

## Localization

The app supports English and Ukrainian through i18next.

Translation files live in:

```text
lib/locales/en/translation.json
lib/locales/uk/translation.json
```

Default tasks are stored in Supabase with a stable `default_task_key`, then displayed through localized strings. Custom parent-created task titles stay exactly as the parent typed them.

## Legal Pages

Static Privacy Policy and Terms pages live in:

```text
legal-pages/
```

These pages can be deployed to Netlify or another static hosting provider and used for App Store / Google Play privacy and terms URLs.

## Notes

- The package name in `package.json` is still `my-app`; the Expo app name and slug are configured as Choro in `app.json`.
- For production, confirm all Supabase migrations are applied, storage buckets exist, Edge Functions are deployed, and RLS policies are correct.
- For App Store review, verify privacy policy content, TestFlight build behavior, Sign in with Apple, account deletion, push permissions, and child data handling.
