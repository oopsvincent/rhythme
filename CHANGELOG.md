## Changle-Log

## [0.9.1] - 2025-10-24

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

