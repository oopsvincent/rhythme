## Changelog

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

