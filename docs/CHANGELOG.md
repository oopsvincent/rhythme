## Changelog

---

## [0.20.0] - 2025-11-14
### Highlights
- Major overhaul of the marketing-facing parts of the product with a new landing structure, pricing page, and footer. This improves clarity, branding consistency, and prepares the app for public visibility. Navigation now correctly adapts to authenticated/unauthenticated states using a client/server split, and layouts now support proper redirect behavior with return URLs.

### Added
- New landing page architecture with a server wrapper for better performance and auth-aware rendering.
- Enhanced feature section, testimonial section, and marketing layout improvements.
- Dedicated pricing page and pricing component.
- New global footer component.
- New public branding assets (logos, images, etc.).
- Updated dashboard and user layouts to support redirects with return URLs.

### Changed
- Navigation reworked to use a client/server split for accurate user state handling.
- Sidebar logo updated to use a new image.
- Landing page structure reorganized for maintainability and clearer content hierarchy.
- Dashboard and user layouts improved for more predictable routing.

### Fixed
- Resolved a large number of bugs caused by outdated components, inconsistent layouts, and previous refactors.
- Fixed routing inconsistencies when unauthenticated users attempted to access dashboard routes.
- Addressed various UI errors and broken asset references.

### Deprecated
- Old preview image.
- Old logo.
- `favicon.ico` (replaced by new branding assets).

### Breaking Changes
- Removal of old public assets may break any external or internal references relying on deprecated images or favicon files.
- Navigation refactor may require updating any custom components that previously depended on client-only navigation logic.

---

## [0.19.0] - 2025-11-01

### Highlights
- Introduces **user profile pages** and a **calendar drawer**, enhancing personalization and organization across the app.  
- Improves dashboard interactivity and navigation flow, particularly for mobile users.

### Added
- New **user profile pages** under `/user`, featuring detailed user information and a dedicated layout.
- **Calendar drawer** with a **filterable calendar component**, integrated into the dashboard for easy access.
- Support for **context and provider-based navigation and settings management** for improved global state handling.

### Changed
- Refactored **navigation** and **settings** to utilize new providers and context.
- Updated **sidebar** and **navigation components** for consistency and responsiveness.
- Enhanced **dashboard** and **journal pages** for smoother user experience and visual coherence.

### Fixed
- Minor UI inconsistencies across settings and navigation views.

### Deprecated
- None.

### Security
- None.

### Breaking Changes
- None.

---

## [0.18.0] - 2025-10-29

### Highlights
- Major update introducing a complete **Tasks CRUD system** with real-time updates, new dashboard sections, and an overhauled settings experience.  
- This release marks a significant step toward full product functionality and scalability, replacing legacy state management and improving overall app architecture.

### Added
- Full **Tasks CRUD system** (create, read, update, delete) with server actions and real-time updates.
- **Task list, item, and form components** for a dynamic and interactive dashboard experience.
- New **dashboard pages** for Focus, Goals, Habits, Journal, and Tasks.
- Comprehensive **Settings modal** with sections for:
  - Account  
  - Appearance  
  - Notifications  
  - Privacy
- Added **slug pages** for individual tasks using `task-id`.
- New **utility hooks** and **UI components** for scroll areas and responsive layouts.
- Responsive and adaptive **sidebar navigation** system.

### Changed
- Refactored **dashboard layout** for improved modularity and responsiveness.
- Removed **Zustand** state management in favor of server actions and context-based updates.
- Reworked **navigation logic**, improving route handling and sidebar synchronization.
- Enhanced **loading UI** and user feedback during transitions.

### Fixed
- Replaced placeholder context menu items with fully functional actions.
- Improved UI consistency and performance across dashboard sections.

### Deprecated
- Legacy Zustand store and related state management code have been fully removed.

### Security
- None in this release.

### Breaking Changes
- State management migrated from Zustand to server actions — existing local setups or custom states may require refactoring.
- Dashboard and settings route structures updated; ensure internal links and imports are aligned with new paths.

---

## [0.17.1] - 2025-10-28

### Highlights
- Improved project documentation to reflect recent updates and provide clearer insight into the team and project goals.

### Added
- Added detailed **team information** section to the README.

### Changed
- Updated **project description** and **status overview** in README to match the latest development progress.
- Enhanced formatting and clarity for better readability.

### Fixed
- None.

### Deprecated
- None.

### Security
- None.

### Breaking Changes
- None.

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

