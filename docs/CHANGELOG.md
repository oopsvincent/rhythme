## Changle-Log

---

PR #83
commit no - c25f0bffdadba6b202f505c9d49af6b6f93ab719
## [0.59.0] - 2026-03-07

### Highlights
- The app now displays proper Apple launch screens when installed as a PWA on iOS devices, improving the native app feel on Apple hardware across all supported device sizes.

### Added
- `AppleSplashScreens` component generating device-specific `apple-touch-startup-image` meta tags for iOS launch screen support.
- Full set of splash screen PNG assets under `public/splash_screens/splash_screens/` covering all supported Apple device sizes.
- `public/splash_screens/icon.png` as the new PWA manifest icon.
- README documentation for the splash screen assets.

### Changed
- Included `AppleSplashScreens` component in `app/layout.tsx` head for automatic iOS splash screen injection.
- Updated the web app manifest to reference the new `splash_screens/icon.png` asset.

---

PR #82
commit no - b508adcf96a94abe041cbb1a33c4c60a6234f2c0
## [0.58.0] - 2026-03-07

### Highlights
- The loading experience has been upgraded from a plain skeleton to an animated progress bar with rotating microcopy messages, making wait times feel shorter and more engaging.

### Added
- Simulated non-linear progress animation capped at 99% to indicate active loading without implying completion.
- Rotating predefined loading messages cycling during the loading state for better UX.
- CSS-based progress bar replacing the previous `Skeleton` placeholder.
- Dynamic percentage and message display during loading.
- Interval cleanup on component unmount to prevent memory leaks.

### Changed
- Converted the `Loading` component from a server component to a client component using `useState` and `useEffect` to drive progress and message state.

---

PR #81
commit no - 6dd7287fc4ad5d8c97fabcb3733990be865e4ec9
## [0.57.0] - 2026-03-07

### Highlights
- Habit tracking gets a visual upgrade with a 90-day heatmap and a daily activity inspector in the right sidebar, making it easy to spot patterns and review completions for any selected date at a glance.

### Added
- `HabitHeatmap` component displaying a 90-day grid with per-day completion intensity visualization.
- `DailyActivityInspector` component in the right sidebar showing habit completions for the currently selected date.
- Zustand calendar stores for dashboard, task, and habit contexts to sync `selectedDate` across the app.
- `selectedDate` prop support in `CalendarWithFilters` with month state syncing and updated `onDateSelect` handling.

### Changed
- `SidebarRight` updated to use the active calendar state, render `CalendarWithFilters` with the `selectedDate` prop, and display the `DailyActivityInspector`.
- `CalendarWithFilters` API updated to require `selectedDate` as a prop.
- Integrated `HabitHeatmap` into both the habit list and habit detail pages.
- Added type annotations for habit filters and reductions across habit-related files.

### Fixed
- Removed obsolete `pages/Marketing.tsx` that was no longer in use.

### Breaking Changes
- `CalendarWithFilters` now requires a `selectedDate` prop. Any existing usage of this component without the prop will need to be updated to pass a valid date value, otherwise the component will not render correctly.

---

PR #80
commit no - 3f9e251de914f58268c6083ad764c5ffc328aa87
## [0.56.0] - 2026-03-06

### Highlights
- The dashboard layout and sidebar architecture have been significantly refactored for better performance and maintainability: auth gating moved to middleware, the sidebar converted to a client component with live data fetching, and a new Zustand store introduced to manage right sidebar state cleanly.

### Added
- `store/useRightSidebarStore.ts` Zustand store to manage right sidebar collapsed and mobile states.
- Desktop toggle for the right sidebar moved outside the collapsible area for always-accessible control.
- `useIsMobile` hook integration in `TeamSwitcher` to adjust dropdown side on mobile.

### Changed
- Dashboard layout made synchronous with server-side auth and data fetching removed, auth gating delegated to middleware.
- Adjusted main content and card spacing with improved responsive rounding in the dashboard layout.
- Replaced hard-coded sidebar accent colors with semi-transparent RGBA values across all theme variants.
- Converted `AppSidebarWrapper` from a server component to a client component using `useEffect` and the Supabase client to fetch the current user and workspace goal.
- Updated `AppSidebarWrapper` to pass typed `user` and `workspaceGoal` props to `AppSidebarClient`.
- Swapped `NavUser` dropdown icon to `EllipsisVertical`.
- Right sidebar collapsible container simplified with improved animations and layout for sidebar content.
- Updated `TeamSwitcher` UI with revised icons, sizes, and mobile dropdown positioning.
- Renamed schema files from `.pgsql` to `.sql` for consistency.

### Breaking Changes
- Server-side auth and data fetching have been removed from the dashboard layout. Auth gating is now handled entirely by middleware. Any custom server-side auth logic in the dashboard layout will need to be migrated to middleware to maintain route protection.
- `AppSidebarWrapper` is now a client component. Any usage expecting it to behave as a server component will need to be reviewed and updated accordingly.

---

PR #79
commit no - fa32523f23b0c9d323768e5338117fc6094646df
## [0.55.0] - 2026-03-05

### Highlights
- The habit model has been unified around a numeric frequency system with target count and period tracking, replacing the previous separate daily/weekly logic — simplifying the codebase and enabling more flexible habit scheduling across all frequencies.

### Added
- `lib/habit-helpers.ts` utility file with helper functions for the new unified habit frequency model.
- `frequency_num`, `target_count`, and `period` fields to the habit model for unified frequency tracking.
- Frequency and target count UI in habit creation and editing forms using radio buttons and a numeric target input.
- DB schema files at `components/schemas/*.pgsql` for the updated habit model.
- Supabase migration `supabase/migrations/001_unified_habits.sql` for the unified habits schema.
- `periodCompletions`, `periodTarget`, and `isCompletedForPeriod` logic across components and hooks.

### Changed
- Updated `HabitDetailClient`, `HabitsPage`, and `HabitItem` components to use the new unified frequency model and period-based completion tracking.
- Updated `hooks/use-habits` to use `periodCompletions`, `periodTarget`, and `isCompletedForPeriod`.
- Updated `lib/habit-prediction` to use the new `frequency_num` and `target_count` fields.
- Improved optimistic updates across habit components to reflect period-based completions accurately.
- Updated sidebar navigation to point to `/dashboard/habits`.
- UI polish for habit badges and completion text labels.
- Minor copy and label tweaks across habit-related components.
- Updated `types/database.ts` to reflect the new habit model fields.

### Deprecated
- Old weekly-specific habit pages and client components have been removed in favor of the unified frequency model.

### Breaking Changes
- The habit model has migrated from separate daily/weekly fields to a unified `frequency_num`, `target_count`, and `period` structure. The Supabase migration `001_unified_habits.sql` must be applied to the database before deploying this update, otherwise habit-related features will break.
- Old weekly-specific pages and clients have been removed. Any routes or components referencing the previous weekly habit pages will result in 404 errors and must be updated to use the new unified habits flow.

---

PR #78
commit no - 2da3a837749cbd8dd6f077ff3bfe352e0815a267
## [0.54.0] - 2026-03-03

### Highlights
- The sidebar has been significantly refactored with a cleaner layout, collapsible submenus, improved active-state detection, and a new workspace goal feature that surfaces each user's personal goal directly in the sidebar for quick reference.

### Added
- `app/actions/sidebar.ts` server action to fetch a user's workspace goal from `user_preferences`.
- `WorkspaceGoal` client component to display the user's workspace goal in the sidebar.
- `workspaceGoal` prop passed from `providers/appSidebarWrapper.tsx` to the sidebar after querying `user_preferences`.
- `TeamSwitcher` integration into the refactored `AppSidebarClient`.
- Collapsible submenu support in `NavMain` with icon rendering.
- Improved active-state detection in `NavMain` for accurate nav highlighting.

### Changed
- Wrapped dashboard content in a styled card with adjusted layout padding.
- Refactored `AppSidebarClient` with updated styling, sidebar collapse state handling, and a compact header and footer.
- Restructured sidebar nav data into `navigationItems` and `secondaryNavItems`, replacing the previous weekly/habits grouping.
- `appSidebarWrapper.tsx` now queries `user_preferences` to pass workspace goal data to the sidebar.
- Overall UI and CSS tweaks across the sidebar for visual consistency.
- Minor housekeeping and import cleanup across sidebar-related files.

### Breaking Changes
- The previous weekly/habits nav grouping in the sidebar has been replaced with the new `navigationItems` and `secondaryNavItems` structure. Any components or tests referencing the old nav grouping will need to be updated to reflect the new structure.

---

PR #77
commit no - 399013c3761a22978f30398f16c08dd9eef22216
## [0.53.0] - 2026-03-03

### Highlights
- Weekly habits are now fully supported with dedicated pages, week-based completion tracking, streak calculation, and optimistic UI updates — giving users a complete habit management experience for both daily and weekly cadences.

### Added
- Weekly habits listing page at `app/.../habits/weekly/page.tsx`.
- Weekly habit detail page at `app/.../habits/weekly/[habitId]/page.tsx`.
- `weekly-habit-detail-client.tsx` client component for the weekly habit detail UI.
- Week-based server logic in `app/actions/habits.ts`: `getWeekBounds`, `isCompletedThisWeek`, `getISOWeekKey`, and `computeWeeklyStreak` utilities.
- Weekly completion and streak handling in `getHabits`, `getHabit`, and `logHabitCompletion` server actions.
- Grouped weekly logs view in the habit detail UI.
- Slug-based navigation for weekly habit detail pages.
- AI prediction handling support for weekly habits.

### Changed
- Updated `use-habits` hook to support weekly habit creation, deletion, completion, removal of completions, and optimistic updates.
- Updated `app-sidebar` to include weekly habits navigation.
- Updated `habits-widget` to reflect weekly habit progress.
- Updated `nav-weekly` to include weekly habits nav item.
- Updated `types/database.ts` to support weekly habit and completion types.

### Breaking Changes
- `getHabits`, `getHabit`, and `logHabitCompletion` server actions have been updated to handle weekly frequency logic. Any custom integrations calling these actions directly should be reviewed to ensure compatibility with the new weekly completion and streak handling.

---

PR #76
commit no - fff87feec3962fdeb2095ca75e6c33ba43d94be6
## [0.52.0] - 2026-03-02

### Highlights
- OAuth redirect behavior is now reliable across all deployment environments with an improved base URL resolution chain, and the app branding has been refreshed with a new OG image and updated PWA manifest icons.

### Added
- `public/OG-Rhythme.jpg` as the new Open Graph and preview image for app metadata.
- `public/rhythme_z_o.png` as the new PWA manifest icon asset.
- Manifest version field added to the PWA manifest.

### Changed
- Base URL resolution for server actions now follows a priority chain: `NEXT_PUBLIC_APP_URL` → request headers → Vercel production URL → localhost, ensuring OAuth callbacks use the correct visited domain.
- Swapped OG/preview image in app metadata to `public/OG-Rhythme.jpg`.
- Replaced PWA manifest icons with `public/rhythme_z_o.png`.
- Bumped `package.json` version to reflect latest release.

### Fixed
- OAuth redirect callbacks incorrectly resolving to the wrong domain in certain deployment environments, particularly on preview and production Vercel deployments.

---

PR #75
commit no - 1dae0243eb3cf5dadcc8acf12b27f408de5a75eb
## [0.51.0] - 2026-03-02

### Highlights
- A full notifications system has been introduced with a header popover, unread count badge, optimistic mark-as-read updates, and background polling — keeping users informed of important activity without interrupting their workflow.

### Added
- `app/actions/notifications.ts` server actions to fetch notifications, get unread count, and mark single or all notifications as read.
- `notification-popover.tsx` client component for displaying notifications in a header popover with optimistic updates.
- `notification-item.tsx` client component for rendering individual notification entries.
- Unread count polling in the notification popover for real-time badge updates.
- `Notification` type added to `types/database.ts`.
- Notifications popover wired into `components/site-header.tsx`.

### Changed
- Updated `site-header.tsx` to include the notifications popover alongside existing header elements.
- Tweaked global selection styling in `app/layout.tsx`.

---

PR #74
commit no - 91dc5f8411bbff52b0c0e1fb39005e7c1d7e9779
## [0.50.1] - 2026-02-24

### Highlights
- The weekly workflow has been fleshed out with Plan, Review, and History pages, a dashboard widget, and an improved edit modal — giving users a complete end-to-end experience for managing their weekly goals and reflections.

### Added
- Weekly Plan, Review, and History pages under the week layout.
- `SiteHeader` integrated into the week layout.
- `WeeklyWidget` component for the dashboard providing a quick overview of the weekly workflow.
- Edit modal on the weekly plan page for adding, removing, and editing plan items.
- Weekly History timeline for browsing past weekly entries.
- `NavWeekly` dedicated weekly navigation section in the app sidebar.
- Weekly widget component export added to the component index.
- PRD documentation for the Weekly System.

### Changed
- Refactored the weekly plan page to use structured item lists with improved layout and actions.
- Enhanced weekly review carousel UI for a smoother review experience.
- Updated app sidebar to include `NavWeekly` for dedicated weekly navigation.
- Tweaked dashboard layout padding for better spacing consistency.
- Updated package metadata.

---

PR #74
commit no - 7f5029d68e3f7cc50e2dc4d3bcd5708b9bdc0c96
## [0.50.0] - 2026-02-24

### Highlights
- The Weekly System MVP has arrived, introducing dedicated weekly plan and review pages with new UI components for mood tracking, correlations, and a review carousel — giving users a structured way to plan and reflect on their week.

### Added
- Weekly System MVP with new `dashboard/week` routes: layout, index, plan, and review pages.
- `weekly-review-carousel` component for stepping through weekly review content.
- `correlation-card` component for displaying habit and mood correlation insights.
- `mood-sparkline` component for compact inline mood trend visualization.
- Weekly nav items and section titles wired up in the sidebar and header.
- Roadmap documentation at `docs/roadmaps/5.5WeeklySystem` describing the planned schema and UX for the Weekly System.

### Changed
- Added container query on the dashboard main layout for improved responsive behaviour.
- Updated root metadata URL configuration.
- Applied selection styling improvements at the root level.
- Minor sidebar and header style adjustments to accommodate weekly nav items.
- Updated `getBaseUrl` environment handling in `app/actions/auth.ts`.

---

PR #73
commit no - 5b1a9ad75a4b81b189dafada69ec2f6d5d121851
## [0.49.0] - 2026-02-21

### Highlights
- Account deletion is now a safer, more transparent process with a three-step confirmation flow, explicit server-side data cleanup across all user tables, and clearer UX copy — reducing the risk of accidental deletion while ensuring complete data removal.

### Added
- Three-step confirmation flow in the delete account modal with step indicators and icons at each stage.
- Uppercase confirmation input requirement before deletion can proceed.
- Client-side redirect via `router.push` on successful account deletion.
- Detailed server-side error reporting on deletion failure.

### Changed
- `auth.deleteAccount` now explicitly deletes user data from `habit_logs`, `habits`, `journals`, and `user_preferences` tables before removing the account, replacing the previous single RPC call.
- `auth.deleteAccount` now signs the user out as part of the deletion flow.
- Delete account modal converted from a single-step to a three-step confirmation flow.
- Improved button states and loading text during the deletion process.
- Updated UX copy and styles across the delete account flow for clearer, safer communication.

### Fixed
- Account deletion previously relied on a single RPC call that lacked granular error handling; explicit per-table cleanup now returns detailed errors on failure.

### Security
- Explicit server-side deletion of all user-related data across multiple tables ensures no orphaned records remain after account removal.
- User session is signed out server-side as part of the deletion process, preventing any lingering authenticated state.

### Breaking Changes
- The account deletion backend has been replaced from a single RPC call to explicit multi-table deletion. Any custom integrations or scripts relying on the previous RPC deletion behaviour will need to be updated accordingly.

---

PR #72
commit no - 5e4654264ad04ba99b7bf2dd30309e8e21b01b8c
## [0.48.0] - 2026-02-21

### Highlights
- Authentication flows have been polished end-to-end with a reusable password input component featuring visibility toggle and strength meter, stricter password rules, improved session handling, and better success/error feedback across login, signup, and password reset pages.

### Added
- Reusable `PasswordInput` component with visibility toggle and live password strength meter.
- Live password mismatch validation on signup and update-password flows.
- Expired session UI on the update-password page for handling stale or invalid sessions.
- Success state UI on the update-password page with a longer redirect delay for better user feedback.
- Success confirmation UI and alerts on the reset-password request page.
- `redirect` query parameter support on the login form to send users back to their intended page after signing in.

### Changed
- Replaced plain password inputs with the new `PasswordInput` component across login, signup, and update-password flows.
- Hardened password rules to enforce a minimum of 8 characters.
- Moved and renamed the update-password page to an improved path.
- Improved session checks on the update-password page.
- Enhanced reset-password request UI with better navigation and alert feedback.
- Minor visual and icon tweaks across auth components.

### Fixed
- Auth flows lacking proper expired-session handling now correctly show an expired-session UI instead of failing silently.

### Security
- Minimum password length enforced at 8 characters across all auth flows.
- Live password strength meter added to guide users toward stronger passwords during signup and password updates.
- Improved session validation on the update-password page to prevent actions on expired or invalid sessions.

### Breaking Changes
- The update-password page has been moved and renamed to a new path. Any hardcoded links or emails pointing to the old update-password URL will need to be updated.
- Obsolete `auth/new` page has been removed. Any references to this route will result in a 404.

---

PR #71
commit no - a8a7ffc840cd0b31b7e307c0a420fde617d9d8e3
## [0.47.0] - 2026-02-21

### Highlights
- The focus floating widget now behaves robustly with viewport-clamped dragging, bounce animations, background session completion detection, and smart auto-dismiss/undismiss logic — making the focus timer seamlessly usable across the entire dashboard.

### Added
- Viewport clamping with edge padding for the floating widget position, applied on drag release with a bounce animation.
- Position persistence for the floating widget across sessions.
- Dismiss state for the floating widget, replacing the old visibility toggle.
- Background session completion detection in the widget: plays a sound, triggers a browser notification, and shows a toast when a session finishes while the app is inactive.
- Completed session persistence to IndexedDB from the floating widget.
- Session marking and advancing logic with optional auto-start for the next session.
- Auto-undismiss behaviour when a new focus session starts.
- Guard in `FocusTimer.handleSessionComplete` to prevent duplicate completion handling if the store already shows the session as finished.
- Bell sound and toast notification in the Zustand store when the timer completes while the app is inactive.

### Changed
- Floating widget now only appears when a session has been started, hiding on the main focus page.
- Replaced the separate hidden-toggle UI with the new dismiss state system.
- Free dragging allowed during a session but position is clamped to viewport bounds on release.
- Updated Zustand store to handle inactive-state timer completion with audio and toast feedback.

### Fixed
- Duplicate session completion handling when the store and timer both attempted to finalize the same session simultaneously.

---

PR #70
commit no - 04d314b
## [0.46.0] - 2026-02-21

### Highlights
- Journal entries now get AI-powered sentiment analysis with emotion detection and suggestions, and the dashboard surfaces 7-day mood and sentiment confidence charts — giving users meaningful insights into their mental and emotional patterns over time.

### Added
- `insights-client` component that decrypts journal entries, calls `analyzeJournalSentiment`, and displays sentiment scores, detected emotions, and suggestions.
- `analyzeJournalSentiment` server action that calls the sentiment ML service, persists `mood_tags` and `sentiment_score` to Supabase, and revalidates the journal path.
- `mood-chart` component with skeleton loader for displaying 7-day mood trends on the dashboard.
- `sentiment-chart` component with skeleton loader for displaying 7-day sentiment confidence on the dashboard.
- `lib/journal-sentiment.ts` helper for journal sentiment utilities.
- Exported `mood-chart` and `sentiment-chart` from the dashboard index.

### Changed
- Converted the journal insights page to a server component responsible for loading the journal, user, and encryption token before mounting the client.
- Updated dashboard page to include the 7-day mood and sentiment confidence charts.
- Updated journal-related types to support `mood_tags` and `sentiment_score` fields.
- Tweaked auth base URL fallback logic.
- Minor UI spacing adjustment in `journal-detail-client`.

### Security
- AI sentiment analysis is performed only after client-side decryption, ensuring encrypted journal content is never sent to the ML service in ciphertext form without the user's key being present.

---

PR #69
commit no - dc11021
## [0.45.0] - 2026-02-08

### Highlights
- The focus timer has been significantly upgraded with local session persistence, a draggable floating widget for quick access, a monthly heatmap calendar, and a richer settings and history experience — making focus tracking more powerful and accessible across the dashboard.

### Added
- `FocusFloatingWidget` component: a draggable and hideable floating timer for quick focus session access from anywhere in the dashboard.
- `FocusHeatmapCalendar` component: a monthly heatmap view of focus session history.
- `lib/focus/focus-db.ts` for IndexedDB-based local storage of focus sessions.
- `useFocusStore` Zustand store for persisted focus session state management.
- `FocusWidgetProvider` integrated into the dashboard layout to expose widget state globally.
- Session grouping view in the focus history UI.
- Data deletion flow for clearing focus session history.
- Device naming support in the focus timer.
- Fullscreen handling for the focus timer.
- Implementation plan documentation added.
- New dependencies added to `package.json` to support focus features.

### Changed
- Refactored `components/focus-timer.tsx` to use the new store and IndexedDB layer for full session lifecycle management.
- Improved focus timer display with smoother updates and progress animation timing.
- Enhanced history and settings UI with a drawer and tabbed layout.
- Reorganized dashboard focus page layout and session visuals.
- Wrapped dashboard layout with `FocusWidgetProvider` for widget state access.
- Minor UI adjustments to timer display and session visuals.

### Breaking Changes
- Focus session data is now stored in IndexedDB locally. Any previous session data not migrated to the new storage layer will not appear in history. Users may need to clear stale state if conflicts arise after updating.

---

PR #68
commit no - e5283c2
## [0.44.0] - 2026-02-08

### Highlights
- Journal entries are now protected with client-side end-to-end encryption. Titles and body content are encrypted before being saved and only decrypted on the user's device, ensuring private journal data never reaches the server in plaintext.

### Added
- `app/actions/encryption.ts` server actions to get and save a per-user encryption validation token.
- `lib/crypto.ts` crypto utility module for deriving and managing encryption keys.
- `store/useJournalEncryptionStore.ts` in-memory store to hold derived encryption keys during a session.
- `JournalPassphraseSetup` component for first-time passphrase setup flow.
- `JournalUnlockModal` component for unlocking encrypted journals with a passphrase.
- `iv` (initialization vector) field support in server-side journal actions for persisting encryption metadata.
- Placeholder UI shown when journals are encrypted but the key is not yet available.
- Redirect to login if user session is missing on journal pages.
- Backward compatibility support for reading legacy plaintext journal entries.

### Changed
- Journal creation and editing components (new entry, journal list, detail) now encrypt content before saving and decrypt on load when a key is available.
- Server-side journal actions updated to accept and persist encrypted content along with `iv` metadata.
- Routing and pages updated to fetch and pass `userId` and `encryptionToken` down to client components.
- Minor UI and text adjustments to the quick journal card and login flow.

### Security
- End-to-end client-side encryption implemented for journal entry titles and body content.
- Encryption keys are derived from a user passphrase and held only in memory, never persisted to the server.
- Per-user encryption validation token stored server-side to verify correct passphrase without exposing the key.

### Breaking Changes
- Journal entries created going forward will be encrypted. Any existing plaintext entries remain readable but new entries require passphrase setup. Integrations or scripts that read journal content directly from the database will receive encrypted ciphertext instead of plaintext.

---

PR #67
commit no - 0c64f8c
## [0.43.0] - 2026-02-07

### Highlights
- Journal pages have been split into proper server and client components, improving performance, data fetching clarity, and laying the groundwork for future local-first offline sync.

### Added
- `JournalDetailClient` component to handle rendering, editing, and UI for individual journal entries.
- `JournalPageClient` component to handle journal list UI, filtering, and editing on the client side.
- `notFound()` handling on the journal detail page when a journal entry is missing.
- `LOCAL_OPS` comments throughout the codebase marking hooks and storage helpers reserved for a future local-first sync implementation.

### Changed
- Refactored journal pages into server components responsible for data fetching (`getJournalById` / journals list) and client components responsible for UI and interactions.
- `NewJournalPage` now uses the `createJournal` server action and has updated type and mood handling.
- Journal detail page now delegates all rendering and editing to `JournalDetailClient`.
- Updated journal-related types and storage helpers to support the refactor.
- Minor UI and component adjustments across journal pages.

### Deprecated
- Direct localStorage-based journal operations are being phased out in favor of server actions, with local-first sync planned as a future replacement via `LOCAL_OPS` hooks.

---

PR #66
commit no - 518a667
## [0.42.9] - 2026-02-03

### Highlights
- Major overhaul of the habit management experience with optimistic UI updates, an inline edit feature, and smarter state handling — making the app feel significantly faster and more responsive.

### Added
- Optimistic updates for habit completion and removal, giving instant UI feedback before server confirmation.
- Edit dialog and form inside `HabitDetailClient` for updating habits in place.
- New hooks: `useLogCompletion`, `useRemoveCompletion`, `useHabitPrediction`, and `useUpdateHabit` to centralize habit mutations.
- Prediction UI integrated into habit lists with per-habit loading state, badge indicators, and days-until-prediction display.
- Overview stats section on the Habits page.
- Grouped habit lists by frequency on the Habits page.
- Empty and error states on the Habits page for better feedback.
- Facebook as a supported OAuth provider in the connections section.
- `public/Facebook_Logo_Primary.png` asset for the Facebook provider icon.
- `HabitFrequency` type import for improved type safety.

### Changed
- Refactored `HabitDetailClient` to use local optimistic state and new hooks instead of direct action calls.
- Reworked habit cards and dialogs (complete, remove, edit) with updated layout and consistent loading indicators.
- Improved accessibility across habit card and dialog components.
- Updated Habits page with client-side validation and confirm-before-delete flow.
- Switched to using `current_streak` consistently across habit displays.
- Improved create habit dialog UX and pending state handling.
- Adjusted avatar and background CSS classes in the connections section.
- Improved prediction loading and error states in `HabitDetailClient`.
- Minor formatting and progress/badge styling refinements.

---

PR #66
commit no - 3b45f66
## [0.42.8] - 2026-01-31

### Highlights
- The app now supports Progressive Web App (PWA) installation and handles offline usage gracefully with a visual indicator and service worker caching.

### Added
- `OfflineIndicator` component to notify users when they lose internet connection.
- Custom PWA manifest for app installation support on supported devices.
- Service worker for offline caching, enabling basic app functionality without a network.
- App icons for PWA installation across different platforms.

### Changed
- Updated the main layout to include the `OfflineIndicator` component.
- Removed the manifest reference from metadata in favor of the new custom PWA manifest.

---

PR #66
commit no - dfb2ee4
## [0.42.7] - 2026-01-30

### Highlights
- Spotify has been disabled as a connected account provider, streamlining the supported OAuth options.

### Changed
- Removed Spotify from the `ALL_PROVIDERS` array.
- Commented out the Spotify entry in the `PROVIDERS` object, disabling it from the provider list.

### Deprecated
- Spotify as a connected account provider is disabled and may be permanently removed in a future release.

### Breaking Changes
- Users who previously connected their Spotify account may lose access to that integration. Manual review or migration may be needed if Spotify data was in use.

---

PR #66
commit no - f163f1d
## [0.42.6] - 2026-01-30

### Highlights
- The connections section now uses proper SVG icons for OAuth providers, making the UI cleaner and more visually consistent.

### Added
- SVG assets for OAuth provider icons: Google, GitHub, Discord, and Apple.

### Changed
- Refactored the connections section to use SVG icons for OAuth providers.
- Improved the overall UI layout of the connections section.
- Updated button styles in the connections section.

### Fixed
- Minor style issue in the `nav-user` component.

### Deprecated
- Spotify removed from the list of supported OAuth providers and may be permanently dropped in a future release.

---

PR #66
commit no - 4c2dab4
## [0.42.5] - 2026-01-28

### Highlights
- Settings pages have been completely redesigned with a clean flat-design system, modular sections, and mobile navigation support — making account management significantly more organized and user-friendly.

### Added
- New modular settings section components for: Profile, Connections, Security, Onboarding, Privacy, Theme, Custom Themes, Notifications, General, Subscription, Billing History, and Delete Account.
- Mobile navigation support for the new settings layout.
- Toast notifications for improved user feedback across settings actions.
- `SettingsLayoutWrapper` component for the refactored settings layout.
- `SidebarRightWrapper` integration into the dashboard layout.

### Changed
- Redesigned the entire settings system with a flat-design approach and grouped sections.
- Refactored settings layout to use `SettingsLayoutWrapper`.
- Updated dashboard layout to use `SidebarRightWrapper`.
- Improved UX for account linking, notification preferences, and theme selection.
- Updated routing to redirect old settings page URLs to their new locations.

### Breaking Changes
- Old settings page routes have been redirected to new locations. Any hardcoded links or bookmarks to previous settings URLs will need to be updated to avoid redirect issues.

---

PR #66
commit no - 1b4e89b
## [0.42.4] - 2026-01-28

### Highlights
- Journal storage logic has been centralized for better maintainability, and account security has been significantly enhanced with password update, account deletion, and improved route protection.

### Added
- `lib/journal-storage.ts` utility file centralizing all journal localStorage logic.
- Account deletion modal for users to delete their account from the UI.
- Session info component to display current session details.
- Password update server action for changing account passwords.
- Account deletion server action for permanently removing accounts.

### Changed
- Updated all journal-related components and pages to use the new `lib/journal-storage.ts` utilities.
- Improved security settings UI layout and interactions.
- Updated connected accounts logic for better consistency.
- Refined Supabase middleware for stronger route protection.

### Security
- Password update functionality added, allowing users to change credentials directly from account settings.
- Account deletion flow implemented with proper server-side handling.
- Improved route protection via updated Supabase middleware, reducing unauthorized access risks.

### Breaking Changes
- Journal components previously managing localStorage directly now depend on `lib/journal-storage.ts`. Any custom extensions to journal storage logic will need to be migrated to use the new utility.

---

PR #66
commit no - ef131d9
## [0.42.3] - 2026-01-28

### Highlights
- Users can now see the live status of backend ML services directly in the site header, improving transparency around AI-powered feature availability.

### Added
- `ServiceStatusIndicator` component to display real-time status of backend ML services in the site header.
- `useWarmServices` hook to manage and trigger warm-up calls for backend ML services.

### Changed
- Updated the site header to include the `ServiceStatusIndicator`.

### Fixed
- Apostrophe escaping and quote formatting issues across several dashboard and landing page components.

---

PR #66
commit no - e9eb475
## [0.42.2] - 2026-01-27

### Highlights
- The dashboard has been significantly expanded with five new widgets covering mood tracking, habit progress, quick journaling, daily reflection prompts, and productivity summaries — giving users a much richer home screen experience.

### Added
- `MoodInputCard` widget for tracking mood directly from the dashboard.
- `HabitsWidget` for viewing habit progress at a glance.
- `QuickJournalCard` for fast journal entries without leaving the dashboard.
- `ReflectionPrompt` for daily reflection prompts on the dashboard.
- `ProductivitySummary` widget for an overview of productivity stats.
- Skeleton loaders for all five new dashboard widgets for smoother loading states.

### Changed
- Restructured the dashboard page layout to a grid-based system accommodating the new widgets.
- Refactored the dashboard index to export all new widget components cleanly.

---

PR #66
commit no - 0ce905d
## [0.42.1] - 2026-01-27

### Highlights
- Auth redirect URLs now consistently point to the correct production environment by using `VERCEL_PROJECT_PRODUCTION_URL`.

### Changed
- Replaced `VERCEL_URL` with `VERCEL_PROJECT_PRODUCTION_URL` for constructing redirect URLs in authentication flows.

### Fixed
- Redirect URLs in auth flows incorrectly resolving to preview/branch deployment URLs instead of the production URL.

### Breaking Changes
- Environments must have `VERCEL_PROJECT_PRODUCTION_URL` set correctly in Vercel project settings, otherwise auth redirects will fail in production.

---

PR #66 
commit no - 93f262a

## [0.42.0] - 2026-01-27

### Highlights
- Authentication redirect URLs now correctly resolve in Vercel deployments by switching to the `VERCEL_URL` environment variable.

### Changed
- Replaced `NEXT_PUBLIC_SITE_URL` with `VERCEL_URL` for constructing redirect URLs in authentication flows.

### Fixed
- Incorrect redirect URL generation during auth flows in Vercel-hosted deployments.

### Breaking Changes
- Projects relying on `NEXT_PUBLIC_SITE_URL` for auth redirects will need to ensure `VERCEL_URL` is properly set in their Vercel environment variables, or redirects may break.

---

## [0.41.0] - 2026-02-03

### Highlights
- Major overhaul of the habit management experience with optimistic UI updates, an inline edit feature, and smarter state handling — making the app feel significantly faster and more responsive.

### Added
- Optimistic updates for habit completion and removal, giving instant UI feedback before server confirmation.
- Edit dialog and form inside `HabitDetailClient` for updating habits in place.
- New hooks: `useLogCompletion`, `useRemoveCompletion`, `useHabitPrediction`, and `useUpdateHabit` to centralize habit mutations.
- Prediction UI integrated into habit lists with per-habit loading state, badge indicators, and days-until-prediction display.
- Overview stats section on the Habits page.
- Grouped habit lists by frequency on the Habits page.
- Empty and error states on the Habits page for better feedback.
- Facebook as a supported OAuth provider in the connections section.
- `public/Facebook_Logo_Primary.png` asset for the Facebook provider icon.
- `HabitFrequency` type import for improved type safety.

### Changed
- Refactored `HabitDetailClient` to use local optimistic state and new hooks instead of direct action calls.
- Reworked habit cards and dialogs (complete, remove, edit) with updated layout and consistent loading indicators.
- Improved accessibility across habit card and dialog components.
- Updated Habits page with client-side validation and confirm-before-delete flow.
- Switched to using `current_streak` consistently across habit displays.
- Improved create habit dialog UX and pending state handling.
- Adjusted avatar and background CSS classes in the connections section.
- Improved prediction loading and error states in `HabitDetailClient`.
- Minor formatting and progress/badge styling refinements.

---

## [0.40.0] - 2026-01-31

### Highlights
- The app now supports Progressive Web App (PWA) installation and handles offline usage gracefully with a visual indicator and service worker caching.

### Added
- `OfflineIndicator` component to notify users when they lose internet connection.
- Custom PWA manifest for app installation support on supported devices.
- Service worker for offline caching, enabling basic app functionality without a network.
- App icons for PWA installation across different platforms.

### Changed
- Updated the main layout to include the `OfflineIndicator` component.
- Removed the manifest reference from the metadata in favor of the new custom PWA manifest.

---

## [0.39.1] - 2026-01-30

### Highlights
- Spotify has been disabled as a connected account provider, streamlining the supported OAuth options.

### Changed
- Removed Spotify from the `ALL_PROVIDERS` array.
- Commented out the Spotify entry in the `PROVIDERS` object, disabling it from the provider list.

### Deprecated
- Spotify as a connected account provider is disabled and may be permanently removed in a future release.

### Breaking Changes
- Users who previously connected their Spotify account may lose access to that integration. Manual review or migration may be needed if Spotify data was in use.

---

## [0.39.0] - 2026-01-30

### Highlights
- Revamped the connections UI with proper SVG icons for OAuth providers, making the interface cleaner and more visually consistent.

### Added
- SVG assets for OAuth provider icons: Google, GitHub, Discord, and Apple.

### Changed
- Refactored the connections section to use SVG icons instead of text/placeholder elements for OAuth providers.
- Improved the overall layout and button styles in the connections UI.
- Updated nav-user component with a minor style fix.

### Removed
- Spotify removed from the list of supported OAuth providers.

---

## [0.38.0] - 2026-01-28

### Highlights
- Complete redesign of dashboard settings with a modern flat layout, improved navigation, and modular sections for better organization and user experience.

### Added
- New modular settings pages for: profile, connections, security, onboarding, privacy, theme, custom themes, notifications, general, subscription, billing history, and delete account.
- `SidebarRightWrapper` and `SettingsLayoutWrapper` for consistent layout and navigation.
- Toast notifications for enhanced user feedback.
- Improved mobile navigation for settings sections.

### Changed
- Updated routing to redirect legacy settings pages to the new structure.
- Refactored settings layout for flat-design consistency and improved UX in account linking, notifications, and theme selection.
- Dashboard layout updated to integrate new sidebar and settings wrappers.

### Fixed
- Minor UX inconsistencies in previous settings pages.

### Deprecated
- Legacy settings page files and routing.

### Security
- Enhanced account and notification settings management.

### Breaking Changes
- Old settings page URLs are redirected; integrations using previous layout/components need to be updated to use the new wrappers and page structure.

---

## [0.37.0] - 2026-01-28

### Highlights
- Centralized journal storage and strengthened account security, providing safer data handling and improved user control over account settings.

### Added
- `lib/journal-storage.ts` for centralized localStorage handling of journal data.
- Account deletion modal for secure account removal.
- Session info component to display active session details.
- Server actions for password updates and account deletion.
- Enhanced security settings UI for better usability and clarity.

### Changed
- Updated all journal components and pages to use centralized storage utilities.
- Refined Supabase middleware for improved route protection.
- Updated connected accounts logic in settings.

### Fixed
- None (refactors and new features only).

### Deprecated
- None.

### Security
- Strengthened account protection via session handling, password updates, and deletion actions.

### Breaking Changes
- Components using previous local journal storage methods must now use `lib/journal-storage.ts` utilities.

---

## [0.36.0] - 2026-01-28

### Highlights
- Added visibility into backend ML service status with a dashboard-integrated indicator and a warm-up hook, improving user feedback and system readiness.

### Added
- `ServiceStatusIndicator` component to display ML service status.
- `useWarmServices` hook to pre-warm and manage ML services.
- Integration of service status indicator into the site header.

### Changed
- Minor text fixes for apostrophe escaping and quote formatting across dashboard and landing components.

### Fixed
- None (UI/UX improvements only).

### Deprecated
- None.

### Security
- None.

### Breaking Changes
- None.

---

## [0.35.0] - 2026-01-27

### Highlights
- Major dashboard update introducing interactive widgets for mood tracking, habits, journaling, and productivity summaries, providing users with richer insights and actionable prompts.

### Added
- New dashboard components:
  - `MoodInputCard` for tracking user mood.
  - `HabitsWidget` for viewing habit progress.
  - `QuickJournalCard` for rapid journaling.
  - `ReflectionPrompt` for daily reflection suggestions.
  - `ProductivitySummary` for summarizing daily productivity.
- Skeleton loaders for all new dashboard widgets.
- Updated dashboard grid layout to accommodate the new widgets.

### Changed
- Refactored `dashboard/index` to export new components and use the new grid layout.

### Fixed
- None (new features only).

### Deprecated
- None.

### Security
- None.

### Breaking Changes
- Any code relying on the old dashboard layout may need updates to integrate with the new grid and widget structure.

---

## [0.34.0] - 2026-01-27

### Highlights
- Simplified the calendar interface by removing unused filter and drawer components, improving maintainability and reducing UI clutter.

### Added
- None.

### Changed
- Removed calendar filter logic from `CalendarWithFilters`.
- Deleted unused `calendar-drawer` component.
- Removed calendar sheet and related logic from `SiteHeader`.

### Fixed
- None (code cleanup and simplification).

### Deprecated
- Calendar filter and drawer UI/logic are now removed and no longer supported.

### Security
- None.

### Breaking Changes
- Any code or components depending on the removed calendar drawer or filter logic will need to be updated or removed.

---

## [0.33.0] - 2026-01-27

### Highlights
- Improved reliability of authentication redirects by correctly targeting the production deployment URL on Vercel.

### Added
- None.

### Changed
- Updated authentication redirect URL construction to use `VERCEL_PROJECT_PRODUCTION_URL` instead of `VERCEL_URL` for production environments.

### Fixed
- Incorrect or inconsistent redirect behavior in production caused by environment URL mismatches.

### Deprecated
- Usage of `VERCEL_URL` for production redirect logic.

### Security
- Ensures authentication redirects consistently resolve to the intended production domain, reducing the risk of misdirected auth flows.

### Breaking Changes
- None (requires the `VERCEL_PROJECT_PRODUCTION_URL` environment variable to be set in production).

---

## [0.32.0] - 2026-01-27

### Highlights
- Introduced a redesigned journal experience with a new AI insights UI, laying the groundwork for future intelligence features while significantly improving writing and reading UX.

### Added
- New **Journal Insights** page UI showcasing emotional analysis, key phrases, and suggestions (UI-only, static data).
- New journal UI components including journal cards, emotional aura visualization, reading progress indicator, and sidebar content.
- Local draft auto-save behavior for journal entries (client-side only).
- Keyboard shortcuts and keyboard helper UI for habit creation and completion dialogs.

### Changed
- Refactored journal **new** and **detail** pages for a smoother editing and reading experience.
- Improved mood selection and visualization in journal entries.
- Enhanced habit creation and completion dialogs with better form handling and accessibility-focused interactions.

### Fixed
- Minor layout inconsistencies and UX friction in journal and habit-related views.

### Deprecated
- None.

### Security
- None (all features are UI-only and run locally with no persistence or server interaction).

### Breaking Changes
- None.

---

## [0.31.0] - 2026-01-27

### Highlights
- Auth redirects now correctly resolve in all Vercel environments, eliminating deployment-specific login issues.

### Added
- None.

### Changed
- Updated authentication redirect URL generation to use the `VERCEL_URL` environment variable instead of `NEXT_PUBLIC_SITE_URL`.

### Fixed
- Incorrect redirect behavior after login, signup, and OAuth flows in Vercel deployments.
- Edge cases where users were redirected to invalid or non-production URLs.

### Deprecated
- Using `NEXT_PUBLIC_SITE_URL` for authentication redirects in Vercel-hosted environments.

### Security
- Ensures authentication flows redirect users only to the correct deployment domain, reducing the risk of misrouted auth callbacks.

### Breaking Changes
- Deployments must rely on `VERCEL_URL` being available for auth redirects; custom setups should verify environment configuration.

---

## [0.30.0] - 2026-01-07
### Highlights
- Major visual and structural overhaul of the AI dashboard, paired with a clear revamp of billing plans to align product direction with monetization.

### Added
- New AI dashboard sections including:
  - Roadmap overview
  - “Next best actions” guidance
  - Agent-based views for future AI workflows
- Animated backgrounds and mouse-responsive interactions on the AI dashboard.
- New Starter and Premium billing plans with updated feature breakdowns.

### Changed
- AI dashboard UI/UX redesigned for clearer positioning and feature previewing.
- Billing settings updated with revised pricing structure and plan descriptions.
- Feature lists adjusted to better differentiate free vs paid tiers.

### Fixed
- No explicit bug fixes included in this update.

### Deprecated
- Previous billing plan structure and feature definitions.

### Security
- No security-related changes.

### Breaking Changes
- Billing plan changes may affect existing users relying on previous plan definitions and feature availability; manual review of entitlements may be required.

---

## [0.29.0] - 2026-01-06
### Highlights
- Introduces a full journal entry CRUD system and significantly upgrades the AI companion demo — laying groundwork for future user-facing features, even though much of this remains code-only for now.

### Added
- Journal entry CRUD implementation using local storage.
- New journal entry creation and detail pages.
- Mood selection support for journal entries.
- Rich text editor for journal content.
- Context and supporting components for journal functionality.
- Enhanced AI companion demo with:
  - Step-by-step interactive showcase
  - Animated UI elements
  - Improved visual presentation
- Journal listing logic with demo analysis and AI model selection (currently not exposed in UI).

### Changed
- Journal listing page layout refactored for richer analysis and future AI integration.
- AI demo UI updated for better storytelling and interaction flow.

### Fixed
- No user-facing bug fixes; changes are primarily additive and structural.

### Deprecated
- None.

### Security
- No security-related changes (journal data currently stored locally only).

### Breaking Changes
- None externally, but internal journal architecture has changed and may require refactoring when persistence moves from local storage to backend storage.

---

## [0.28.0] - 2025-12-16
### Highlights
- Strengthens onboarding by capturing long-term goals and reflecting them across the app.
- Cleans up and stabilizes habits, journal, and privacy flows with clearer UX and future-ready structure.

### Added
- Long-term goal step in onboarding.
- User’s long-term goal displayed in the navigation.
- SEO-friendly slugs for habits.
- Updated habit navigation using slug-based routing.
- “Coming soon” feedback for security-related actions.

### Changed
- Journal page redesigned with a simplified layout and “coming soon” state.
- Privacy settings UI simplified by removing toggle-based controls.
- Security settings updated to use toast feedback instead of inactive actions.
- Increased glassmorphism blur for improved visual depth.
- Updated loading messages for better clarity.
- Removed notifications from onboarding and settings flows.
- Bumped Next.js to a newer version.

### Fixed
- Navigation inconsistencies related to habits and onboarding flow.
- Minor UX issues across onboarding, journal, and settings pages.

### Deprecated
- Old habit URL structure without slugs.
- Notification-related UI in onboarding and settings.

### Security
- No direct security fixes; settings now clearly indicate unavailable features instead of exposing inactive controls.

### Breaking Changes
- Habit URLs now rely on slug-based routing, which may break existing deep links or bookmarks.

---

## [0.27.0] - 2025-12-15
### Highlights
- Introduces a public beta entry point and formal legal compliance pages.
- Cleans up dashboard placeholders and improves auth-related UX consistency.

### Added
- New beta landing page at `/beta` with hero, features, and sharing sections.
- Cookie Policy page at `/legal/cookie`.
- Reusable legal layout component for policy and compliance pages.
- Beta entry highlighted in main navigation.

### Changed
- Login and signup pages updated to include legal links.
- Dashboard refined to remove placeholder and mock data.
- Navigation updated to better surface beta access.
- Minor improvements to authentication and settings flows.

### Fixed
- Small bugs related to auth handling and settings UI.
- Inconsistencies caused by leftover placeholder content in the dashboard.

### Security
- Improved legal compliance by explicitly surfacing cookie usage and policies.

### Breaking Changes
- None.

---

## [0.26.0] - 2025-12-11
### Highlights
- Major overhaul of Habits and Tasks dashboards with modern client-side components.
- Improves data handling, interaction flow, and visual clarity for daily productivity tracking.

### Added
- New client-based Habits and Tasks dashboard components.
- Detailed habit and task views with richer interaction.
- Custom hooks for habits and tasks data fetching and mutations.
- Dialog-based interactions for creating and managing habits and tasks.
- Progress tracking and prediction UI elements for habits.

### Changed
- Replaced legacy Habits and Tasks dashboard sections with new implementations.
- Updated data fetching and mutation logic for better performance and consistency.
- Improved overall UI/UX for habit and task management workflows.

### Fixed
- UI inconsistencies and interaction issues in the previous Habits and Tasks dashboards.
- Data sync edge cases caused by older fetching logic.

### Deprecated
- Old Habits dashboard section and related legacy components.

### Security
- No direct security-related changes.

### Breaking Changes
- Removal of legacy Habits components may break any custom integrations or assumptions relying on the old structure.

---

## [0.25.0] - 2025-12-10
### Highlights
- Introduces an AI companion entry point, setting the foundation for future AI-powered features.
- Refactors and modernizes settings navigation and layout for better scalability and usability.
- Polishes landing, dashboard, and about pages for a more cohesive visual experience.

### Added
- New AI companion page at `/dashboard/ai` with a “coming soon” interface.
- New Security section in Settings.
- Redesigned Settings home page for clearer navigation and discoverability.
- Client-side layout for Settings to improve navigation responsiveness.

### Changed
- Sidebar navigation updated to include the AI page and reflect new settings structure.
- Settings area refactored with improved layout and navigation flow.
- Landing and dashboard components received UI and layout refinements.
- About page content and layout polished.
- Glassmorphism styles improved across relevant UI surfaces.

### Fixed
- Minor UI inconsistencies across dashboard, landing, and settings pages.
- Layout edge cases caused by previous settings structure.

### Deprecated
- Legacy settings home layout.

### Security
- No direct security fixes, but groundwork laid via the new Security settings section.

### Breaking Changes
- Any direct links or assumptions tied to the old settings home layout may need updating.

---

## [0.24.0] - 2025-12-08
### Highlights
- Complete UI revamp of the dashboard and settings for better clarity, scalability, and maintainability.
- Dashboard is now modular and data-driven, making it easier to extend and reason about.
- Settings are transformed into a full-featured control center instead of a basic config page.

### Added
- Modular dashboard components for:
  - Stats overview
  - Quick actions
  - Activity feed
  - Charts and summaries
- New settings sections and components:
  - Account (profile, goals, connected accounts)
  - Appearance (theme and UI preferences)
  - Billing & subscription management
  - Notifications
  - Privacy
- Forms for profile updates, goal management, theme selection, and subscription settings.
- Loading skeletons across dashboard and settings pages for smoother perceived performance.

### Changed
- Dashboard layout refactored to use composable, reusable components.
- Settings pages rebuilt with dedicated content components per section.
- Navigation and layout logic improved for consistency and usability.
- Data fetching streamlined to reduce redundancy and improve performance.

### Fixed
- Inconsistent loading behavior across dashboard and settings pages.
- Layout and navigation edge cases caused by legacy components.
- Minor UI glitches introduced by unused or stale code.

### Deprecated
- Legacy dashboard layout and monolithic settings components.

### Security
- No direct security-related changes.

### Breaking Changes
- Custom extensions relying on the old dashboard or settings component structure will need updates.
- Any direct imports from removed settings components must be refactored.

---

## [0.23.0] - 2025-12-06
### Highlights
- Major dashboard and routing reorganization to improve scalability and long-term maintainability.
- Onboarding is now a guided, multi-step experience that actually captures user intent instead of being a checkbox flow.
- Task and focus experiences are rebuilt with better UX, clearer states, and real-time feedback.

### Added
- Nested `(dashboard)` route group for dashboard and settings pages.
- Multi-step onboarding flow with role selection and daily goals setup.
- New `TaskDetailEditor` for richer task editing.
- Loading skeletons for focus, task detail, and dashboard pages.
- New task statistics and extended task status support.
- Additional utility libraries and reusable UI components.

### Changed
- Dashboard and settings routes moved into a `(dashboard)` directory.
- Focus and task detail pages replaced with redesigned versions.
- Task actions refactored to support new statuses and analytics.
- Calendar and task components reworked for improved usability and clarity.
- Onboarding logic expanded and restructured for better user guidance.

### Fixed
- UX inconsistencies in task and calendar interactions.
- Loading state gaps across dashboard-related pages.

### Deprecated
- Old dashboard route structure and legacy focus/task detail implementations.

### Security
- No direct security changes.

### Breaking Changes
- Existing links and imports pointing to the old dashboard or settings routes will break.
- Any code relying on previous task statuses or task detail components must be updated.
- Custom onboarding logic must be aligned with the new multi-step flow.

---


## [0.22.0] - 2025-12-04
### Highlights
- Supabase integration has been fully reorganized with a proper server/client split, reducing confusion and preventing inconsistent runtime behavior.
- RSC and SSR are now applied across most of the auth route group, improving performance and reducing unnecessary client-side work.
- Sidebar logic is now cleaner and more maintainable with a server-side wrapper and a dedicated client component.

### Added
- Server and client variants of the Supabase client.
- Server-side `AppSidebarWrapper` for providing user context to the sidebar.
- Server action–based OAuth button workflow.
- Widespread adoption of React Server Components and SSR in the auth routes.

### Changed
- Moved Supabase utilities from `utils/supabase` → `lib/supabase` and updated all imports.
- Refactored the sidebar to run as a client component wrapped in a server layer.
- Removed the client-side `TaskList` and disabled its usage in the dashboard.
- Updated to Next.js **16.0.7**.
- Cleaned up unused imports, components, and legacy code.

### Fixed
- No direct bug fixes, but the refactor resolves several structural issues linked to mixed client/server usage.

### Deprecated
- None.

### Security
- No security-specific changes.

### Breaking Changes
- Any code referencing the old `utils/supabase` path will break until updated.
- Removal of the client-side `TaskList` may require updates to any dependent features.

---

## [0.21.0] - 2024-12-01

### Highlights
- Improved user experience with SEO-friendly task URLs and smarter authentication flow.
- Performance optimizations with Next.js Image components and code cleanup.

### Added
- Server component layout for auth pages with automatic redirect for logged-in users.
- Slug-based URL format for task details (includes task title and ID for better SEO).

### Changed
- Replaced `<img>` tags with Next.js `<Image>` components in error and not-found pages for optimized image loading.
- Updated task detail URL structure to include human-readable slugs alongside task IDs.
- Refactored task fetching logic to handle new slug-based URL format.
- Improved auth flow to automatically redirect authenticated users away from auth pages to dashboard.

### Fixed
- Corrected apostrophe escaping in user-facing messages for proper text rendering.
- Removed unused imports and components for cleaner, more maintainable codebase.
- Enhanced code organization by eliminating dead code.

---

## [0.20.0] - 2025-12-01

### Highlights
- New user onboarding flow ensures seamless first-time user experience and proper account setup.
- Enhanced authentication system with improved error handling and additional password management features.
- Better user journey control with automatic onboarding status checks after login and email confirmation.

### Added
- New onboarding page for first-time user setup and configuration.
- `OnboardingCheck` component to verify onboarding completion before dashboard access.
- Password reset page for secure password recovery.
- Password update page for changing existing passwords.
- Auth code error page for better error communication during authentication flows.
- Onboarding status verification in Supabase authentication logic.

### Changed
- Refactored authentication routes for improved organization and clarity.
- Enhanced authentication forms with better error handling and user feedback.
- Updated Supabase logic to automatically check onboarding status after login.
- Improved email confirmation flow to include onboarding status validation.
- Updated package.json dependencies to latest versions.

### Fixed
- Enhanced error handling across authentication flows for better user experience.
- Improved authentication state management and route protection.

### Deprecated
- Removed legacy confirm route in favor of new authentication flow structure.

### Breaking Changes
- Users will be required to complete onboarding flow before accessing dashboard.
- Legacy confirm route has been removed; existing deep links may need updating.

---

## [0.19.0] - 2025-12-15

### Highlights
- Complete landing page overhaul with new feature cards, testimonials, and enhanced hero section for better user engagement.
- New About and Features pages added to provide comprehensive product information.
- Improved code organization with dedicated landing components directory for better maintainability.

### Added
- New About page with detailed company/product information.
- New Features page showcasing product capabilities.
- Feature cards component for highlighting key functionalities.
- Testimonial cards component for social proof.
- Dedicated `components/landing` directory for landing-related components.
- Enhanced hero section with improved design and call-to-action elements.

### Changed
- Replaced `<a>` tags with Next.js `<Link>` components in error and not-found pages for optimized client-side navigation.
- Refactored landing page layout with improved visual hierarchy and design.
- Updated typography to use proper HTML entities for apostrophes and dashes across about and pricing components.
- Reorganized component imports to reflect new directory structure.
- Enhanced CTA (Call-to-Action) sections throughout landing pages.
- Updated navigation links to include new About and Features pages.

### Fixed
- Improved typographic rendering with proper HTML entities replacing straight quotes.
- Enhanced routing performance by using Next.js Link components instead of anchor tags.

### Deprecated
- Removed old landing-page component in favor of modularized landing components.

---

```markdown
## [0.18.0] - 2025-12-14

### Highlights
- Major architectural refactor introducing new layout system for better code organization and scalability.
- Comprehensive UI/UX improvements across the app with enhanced error handling, loading states, and user feedback.
- New dedicated error and not-found pages with polished animations and modern design.

### Added
- New `(root)` and `(auth)` layout groups for improved app structure and routing organization.
- Dedicated loading pages with creative SVG animations and CSS effects for better visual feedback.
- Custom error pages with improved design and user-friendly messaging.
- Enhanced 404 not-found page with modern styling and navigation options.
- Global styles and not-found specific stylesheets for consistent theming.

### Changed
- Relocated pricing page to align with new directory structure.
- Redesigned dashboard page with improved layout and user experience.
- Refactored tasks page for better organization and performance.
- Updated loading indicators across the app with more engaging visual effects.
- Improved overall app navigation and routing architecture.

### Fixed
- Enhanced error boundary handling across different routes.
- Improved consistency in loading states throughout the application.
```

---

## [0.17.0] - 2025-10-27

### Highlights
- Major framework upgrade to **Next.js v16** with the **React Compiler** and **Turbopack**. This update modernizes the app’s architecture, improving performance, build speed, and development experience.

### Added
- **React Compiler** integration for optimized rendering and improved runtime performance.
- **Turbopack** support for faster builds and hot reloading.
- Added new dependencies to support updated Next.js and React ecosystem.

### Changed
- **Next.js** upgraded to v16.
- **React** and related libraries updated to latest versions.
- **TypeScript configuration** updated for better compatibility with the new build system.
- Updated several **@radix-ui** packages and `date-fns` to align with the new framework setup.

### Fixed
- Resolved potential type conflicts and dependency mismatches caused by older configurations.

### Deprecated
- None.

### Security
- Updated core dependencies to the latest stable versions for improved security and reliability.

### Breaking Changes
- Requires **Node.js 18+** and updated **TypeScript** configuration.
- Custom build scripts or plugins relying on older Next.js APIs may need manual adjustments.

---

## [0.16.0] - 2025-10-24

### Highlights
- Introduced dynamic **Framer Motion animations** to the authentication pages for a smoother, more engaging user experience.  
- Enhanced **Tasks section styling** with improved badge consistency and maintainability.

### Added
- Animated hero sections on **Login** and **Signup** pages using **Framer Motion** to improve visual appeal and user engagement.

### Changed
- Refactored **Tasks section** to use `badgeVariants` for consistent priority-based styling.  
- Updated all **Badge** components to use `className` instead of `variant` for color and priority representation.

### Fixed
- Minor visual inconsistencies between priority badges in the Tasks section.

---

## [0.15.0] - 2025-10-10

### Highlights
- Major productivity update introducing **Goals**, **Habits**, and **Tasks** sections to the dashboard. This release expands functionality and improves navigation, laying the foundation for a more interactive and goal-oriented user experience.

### Added
- **New sections:** Introduced dedicated **Goals**, **Habits**, and **Tasks** modules integrated into the dashboard.
- **UI components:** Added context menu, progress bar, and textarea components for improved interaction.
- **Enhanced navigation:** Sidebar and section cards updated to include new sections.
- **Header improvements:** Updated site header for clearer navigation and section awareness.
- **Dependencies:** Added new Radix UI components for menus and progress tracking.

### Changed
- **Dashboard layout:** Refactored to support context menus and new content sections.
- **Avatar logic:** Improved user avatar initials generation for better fallback consistency.
- **UI consistency:** Enhanced layout styling and visual hierarchy across dashboard sections.

### Fixed
- Minor UI alignment and responsiveness issues within the dashboard.

### Deprecated
- None.

### Security
- None.

### Breaking Changes
- None.

---

## [0.14.0] - 2025-10-09

### Highlights
- Major navigation and layout upgrade introducing modular sidebar components, interactive calendars, and improved section-based dashboard rendering. This update enhances usability, organization, and scalability of the dashboard experience.

### Added
- **Sidebar system:** Introduced new components including sidebar-left, sidebar-right, team-switcher, nav-favorites, nav-workspaces, resizable, collapsible, and popover.
- **Calendar and date-picker:** Added interactive calendar UI and date-picker components.
- **Active section navigation:** Dashboard now dynamically renders content based on the selected section.
- **New dependencies:** Updated `package.json` to include libraries supporting sidebar and calendar functionality.

### Changed
- **Dashboard page:** Refactored to utilize new sidebar and navigation structure.
- **Navigation components:** Updated `nav-main` and `nav-user` to use Lucide icons.
- **Loading screens:** Improved loading behavior and visual transitions for better UX.

### Fixed
- Minor inconsistencies in navigation and section rendering logic.

### Deprecated
- None.

### Security
- None.

### Breaking Changes
- None.

---

## [0.13.0] - 2025-10-08

### Highlights
- Improves mobile settings UX by replacing the custom BottomSheet with the standardized Shadcn Drawer component, ensuring better consistency, accessibility, and maintainability across the UI.

### Added
- **Drawer component integration:** Adopted Shadcn’s Drawer for mobile settings interactions to align with design standards and simplify maintenance.

### Changed
- **Settings dialog:** Replaced the previous BottomSheet implementation with the Drawer component.
- **Code cleanup:** Commented out unused `lucide-react` icon imports in PrivacyPolicy and Terms pages.

### Fixed
- Minor inconsistencies in mobile settings presentation and layout behavior.

### Deprecated
- None.

### Security
- None.

### Breaking Changes
- None.

---

## [0.12.0] - 2025-10-08

### Highlights
- Refactors the landing page for improved modularity and cleaner architecture by isolating the features section into a dedicated component. Enhances routing consistency through Next.js Link integration.

### Added
- **FeaturesSectionLanding component:** New standalone component for the landing page’s features section to improve modularity and code organization.

### Changed
- **Landing page:** Updated `landing-page.tsx` to use the new `FeaturesSectionLanding` component.
- **Sidebar links:** Replaced `<a>` tags with Next.js `<Link>` for improved client-side routing and performance.
- **Code structure:** Improved maintainability through better component separation.

### Fixed
- Minor routing and styling inconsistencies on the landing page and sidebar.

### Deprecated
- None.

### Security
- Improved navigation reliability and safety through consistent use of framework-level routing.

### Breaking Changes
- None.

---

## [0.11.0] - 2025-10-08

### Highlights
- Revamps the settings experience with a fully redesigned, responsive dialog and modernized theme toggle. Enhances usability across devices with mobile-friendly navigation, animated transitions, and improved visual consistency.

### Added
- **Sectioned settings dialog:** New responsive design with mobile bottom sheet navigation and desktop-friendly sections.
- **Custom switch component:** Introduced a reusable toggle switch UI built on `@radix-ui/react-switch`.
- **Framer Motion animations:** Integrated into theme toggle for smooth transitions.
- **System theme detection:** Automatically detects and applies system theme preferences.
- **Dependency updates:** Added `@radix-ui/react-switch` to support new UI interactions.

### Changed
- **Settings dialog:** Replaced sidebar-based version with a responsive, modular dialog.
- **Theme toggle:** Refactored to use Framer Motion and system theme detection for dynamic visual feedback.
- **Settings controls:** Updated UI and layout for consistency with new switch and dialog components.

### Fixed
- Minor layout and alignment inconsistencies in settings and theme toggle UI.

### Deprecated
- None.

### Security
- No direct security updates, but improved UI isolation reduces risk of unintended state changes.

### Breaking Changes
- None.

---

## [0.10.0] - 2025-10-07

### Highlights
- Refactors the signup intro and landing page for cleaner, modular architecture. Introduces reusable UI components and improved navigation with authentication-aware logic, while ensuring compatibility with Next.js 15.

### Added
- **DragSlider component:** Reusable component replacing custom drag-to-continue logic in the signup intro.
- **Navbar component:** New landing page navigation bar featuring authentication-aware actions (login/logout/settings).
- **Middleware updates:** Supabase middleware now redirects unauthenticated users attempting to access the dashboard to the login page.

### Changed
- **Signup intro:** Refactored to use `DragSlider` for improved maintainability and smoother interaction.
- **Landing page:** Updated structure and layout to integrate the new `Navbar` component.
- **Type definitions:** Adjusted and refined for improved compatibility with Next.js 15.
- **General layout:** Minor updates for better responsiveness and consistency across pages.

### Fixed
- Minor layout and animation issues in signup and landing page interactions.

### Deprecated
- None.

### Security
- Strengthened authentication routing via updated middleware redirect logic for unauthenticated users.

### Breaking Changes
- None.

---

## [0.9.0] - 2025-10-07

### Highlights
- Major UX and UI refactor introducing a new landing page, settings dialog, and improved authentication flow. Enhances user experience, performance, and visual appeal across the app with refined navigation, layouts, and typography.

### Added
- **Landing page:** New marketing-focused landing page component for improved first impressions.
- **Settings dialog:** Introduced modal for user preferences and settings access.
- **Logout page:** Added spinner-based logout page for smooth sign-out transitions.
- **UI components:** Added reusable spinner and empty-state components for consistent UI handling.
- **Playfair Display font:** Integrated for improved marketing typography and branding consistency.

### Changed
- **Auth flow:** Refactored signup intro with enhanced slider interaction and removed redundant loading and signup pages.
- **Navigation:** Updated to support the new settings modal.
- **Dashboard and layout:** Improved structure, spacing, and responsiveness.
- **Landing page styles:** Updated with the new `font-marketing` class and typography improvements.
- **Dependencies:** Updated to support new UI components and styling.

### Fixed
- Minor layout and transition inconsistencies in authentication and dashboard flows.

### Deprecated
- Removed unused loading and legacy signup pages.

### Security
- Maintains secure session management and routing through updated navigation and logout logic.

### Breaking Changes
- None.

---

## [0.8.0] - 2025-10-04

### Highlights
- Introduces a fully reworked dashboard experience featuring a new layout, authentication checks, and modular UI components such as charts, tables, and cards. This update improves structure, usability, and scalability for future dashboard enhancements.

### Added
- **Dashboard layout:** New structured layout with sidebar navigation and authenticated access control.
- **Sidebar navigation component:** Provides intuitive navigation across dashboard sections.
- **UI components:** Added reusable charts, tables, and cards for displaying dashboard data.
- **Sample data file:** Added for showcasing dashboard functionality.
- **Utility hooks:** Introduced helper hooks to support Supabase data handling and dashboard logic.
- **Supabase integration updates:** Improved connection utilities for better data fetching.

### Changed
- **Dashboard page:** Refactored to use the new layout and modular UI components.
- **Global styles:** Updated for better dashboard visual hierarchy and consistency.
- **OAuth button styling:** Improved to align with updated dashboard theme.

### Fixed
- Minor visual inconsistencies and layout spacing within the dashboard interface.

### Deprecated
- None.

### Security
- Enforced authentication checks for all dashboard routes to prevent unauthorized access.

### Breaking Changes
- Dashboard structure and component imports have changed; developers must update references to align with the new layout and component structure.

---

## [0.7.0] - 2025-10-03

### Highlights
- Enhances user onboarding and overall UI polish with interactive animations, improved responsiveness, and refined theming. Introduces a slide-to-continue interaction on the signup intro page to boost engagement and smooth navigation.

### Added
- **Slide-to-continue interaction:** Replaces the static “Continue” button on the signup intro page with a sliding gesture for a more engaging onboarding experience.
- **Gradient avatar:** Added a dynamic gradient avatar for visual appeal on user-facing screens.

### Changed
- **Feature cards:** Updated styling and responsiveness for better layout consistency across devices.
- **Theme toggle transitions:** Refined icon animations using new CSS utility classes.
- **UI improvements:** General polish and layout refinements across multiple components.

### Fixed
- **OAuth error parsing:** Corrected error handling logic for more accurate feedback.
- **Redirect behavior:** Unauthenticated users are now redirected to the signup intro page instead of the login page.
- Minor UI alignment and spacing issues.

### Deprecated
- None.

### Security
- Improved authentication flow handling to ensure consistent redirects for unauthenticated users.

### Breaking Changes
- None.

---

## [0.6.0] - 2025-10-03

### Highlights
- Introduces full dark mode support across the app with dynamic theme switching. Enhances visual consistency and accessibility by adapting all major UI components to light and dark themes.

### Added
- **Dark mode support:** Implemented using `next-themes` with a `ThemeProvider` wrapper.
- **ModeToggle button:** Added a new component to switch between light and dark themes.
- **Dropdown menu:** Integrated Radix UI dropdown for theme selection.
- **Dependency updates:** Added `next-themes` and Radix UI packages to support theming and dropdown interactions.

### Changed
- **Layout:** Wrapped app content in `ThemeProvider` and added the theme toggle to the global layout.
- **Login and signup pages:** Refactored for improved color adaptation and consistent theming.
- **OAuth button styles:** Updated to adjust dynamically between light and dark modes.
- **Signup form:** Tweaked for visual consistency across themes.

### Fixed
- Minor color contrast and alignment issues on authentication screens.

### Deprecated
- None.

### Security
- No direct security changes, but enhanced visual clarity improves usability for all users.

### Breaking Changes
- None.

---

## [0.5.2] - 2025-10-02

### Highlights
- Improves OAuth authentication stability and user experience by correcting provider logic, fixing error handling, and refining post-signout navigation.

### Added
- None.

### Changed
- **OAuth providers:** Replaced `'meta'` with `'facebook'` in provider configuration and updated related logic accordingly.
- **Sign-out behavior:** Enhanced sign-out button to automatically redirect users to the login page after logging out.

### Fixed
- **useOAuthError hook:** Corrected query parameter key from `error_code` to `error` for accurate error handling and display.

### Deprecated
- None.

### Security
- Improved reliability of OAuth flow by ensuring consistent provider and error-handling behavior.

### Breaking Changes
- None.

---

## [0.5.1] - 2025-10-01

### Highlights
- Adds the ability for users to edit their display name directly from the dashboard, improving personalization and user control. Introduces a modal dialog for seamless inline updates integrated with Supabase.

### Added
- **Editable display name:** Users can now update their display name directly from the dashboard.
- **Dialog form:** Implemented using `@radix-ui/react-dialog` for smooth and accessible modal interactions.
- **Supabase utility:** New function for updating user profiles in the database.
- **Dependency updates:** Added `@radix-ui/react-dialog` and related dependencies to support new UI components.

### Changed
- **Dashboard UI:** Updated to display and handle editable user names.
- **OAuth button layout:** Improved display and alignment within the dashboard interface.

### Fixed
- Minor alignment and spacing issues in the dashboard UI.

### Deprecated
- None.

### Security
- Ensures user name updates are securely handled via authenticated Supabase requests.

### Breaking Changes
- None.

---

## [0.5.0] - 2025-09-30

### Highlights
- Introduces a polished, interactive authentication experience with reusable OAuth buttons, loading states, animated transitions, and real-time notifications. Lays groundwork for future OAuth provider expansions like Apple and Meta.

### Added
- **OAuth provider buttons:** Reusable UI components for sign-in across supported providers.
- **Loading states:** Implemented for login, signup, and other key routes to improve UX during authentication.
- **Sonner toaster integration:** Added real-time notification system for success, error, and info messages.
- **Animated signup layout:** Added transitions to improve visual flow during the signup process.
- **New dependencies:** Installed `react-icons`, `next-themes`, and `sonner` for enhanced UI and theming.
- **Apple and Meta OAuth placeholders:** Added support scaffolding with placeholder alerts to prevent unsupported login attempts.

### Changed
- **Login and signup forms:** Updated to use the new OAuth buttons and loading behavior.
- **Signup navigation flow:** Improved to streamline user progression and feedback.
- **UI updates:** General visual and structural improvements across authentication pages.

### Fixed
- Minor visual inconsistencies during route transitions and form submissions.

### Deprecated
- None.

### Security
- Added safeguards for unsupported OAuth providers by preventing invalid sign-in attempts.

### Breaking Changes
- None.

---

## [0.4.0] - 2025-09-26

### Highlights
- Enhances the login experience by introducing clear, actionable error messages for OAuth authentication failures. This improves user feedback and simplifies debugging during sign-in.

### Added
- **Custom Alert component:** Reusable UI component for displaying alerts and error messages consistently across the app.
- **useOAuthError hook:** Handles and surfaces OAuth provider errors within the login form.
- **Descriptive error messages:** Login form now provides detailed feedback when authentication fails.

### Changed
- **Login form behavior:** Updated to integrate the new Alert component and error-handling hook for improved user experience.

### Fixed
- Improved error visibility and clarity for failed OAuth logins.

### Deprecated
- None.

### Security
- No new security changes, but enhanced transparency during failed OAuth flows aids debugging without exposing sensitive data.

### Breaking Changes
- None.

---

## [0.3.0] - 2025-09-24

### Highlights
- Introduces a complete signup flow with animated onboarding steps and a cleaner, more responsive login experience. Enhances usability and visual consistency across authentication pages.

### Added
- **Signup flow:** Multi-step signup process with animations and an introductory page for better user onboarding.
- **Intro page:** Added to guide new users through the signup process.

### Changed
- **Login page layout:** Refactored for improved responsiveness across devices.
- **Login form:** Updated to prioritize social login options and simplify the overall UI.
- **Route naming:** Renamed confirm route for consistency within the authentication system.

### Fixed
- Minor layout inconsistencies between login and signup screens.

### Deprecated
- None.

### Security
- No direct security changes in this update.

### Breaking Changes
- None.

---

## [0.2.0] - 2025-09-22

### Highlights
- Major authentication refactor migrating from the legacy Next.js pages/router setup to the new App Router. Simplifies auth flow, improves reliability, and enhances session handling with middleware and client-side sign-out.

### Added
- **Middleware:** Introduced middleware for session management and protected route handling.
- **Client-side sign-out:** Added `SignOutButton` for faster and cleaner logout without full page reloads.
- **Server/client auth actions:** Added support for both email/password and social login through server and client actions.

### Changed
- **Authentication structure:** Reorganized auth routes, moving login page and actions to the new app router.
- **Dashboard and login form:** Updated to align with new authentication logic and improve user experience.
- **Supabase integration:** Simplified setup by removing dependency on old server-props utilities.

### Fixed
- Improved consistency and reliability in user session state across routes.

### Deprecated
- Removed legacy Supabase API and server-props-based authentication utilities.

### Security
- Strengthened session validation via middleware to prevent unauthorized dashboard access.

### Breaking Changes
- Authentication routes and utilities from the previous Next.js pages/router implementation have been removed. Developers must use the new App Router structure and client/server auth actions.

---

## [0.1.0] - 2025-09-21

### Highlights
- Initial release introducing authentication, legal, and dashboard functionality with a fully integrated Supabase backend and reusable UI components.

### Added
- **Authentication system:** Routes and pages for login, signup, callback, and signout.
- **Protected dashboard:** Basic authenticated area accessible only to logged-in users.
- **Legal pages:** Added terms and privacy policy pages.
- **Custom 404 page:** User-friendly not-found page.
- **Reusable UI components:** Button, card, input, and label components for consistent styling.
- **Utility functions:** Helper methods for Supabase integration and general app utilities.
- **Global styling and layout:** Theming, typography, and branding updates.
- **Dependency setup:** Installed and configured dependencies for authentication and UI frameworks.

### Changed
- Updated global metadata and layout structure to align with new branding and theming.

### Fixed
- N/A (initial release)

### Deprecated
- None

### Security
- Added secure authentication flow using Supabase’s OAuth and session management.

### Breaking Changes
- None (first release)

---

