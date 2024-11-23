# PWA Firebase Auth
PWA Firebase Auth Test App

### Directory Explanation

- `/public`: Contains static files like the `index.html` template and any images or assets that don't require bundling.
- `/src`: All source code for the application. Contains React components, pages, services, and logic.
  - `/api`: API calls and functions, including any wrappers around Axios or `fetch`.
  - `/assets`: Static files such as images, fonts, icons, etc.
  - `/components`: Reusable components that are shared across different parts of the app.
  - `/features`: Feature-specific directories which may contain a combination of components, hooks, and logic for a specific feature.
  - `/hooks`: Custom React hooks that encapsulate reusable logic.
  - `/layouts`: Layout components that define page structure (e.g., header, footer, sidebar).
  - `/pages`: Contains the React components that correspond to individual pages or routes in the app.
  - `/providers`: Context API or global state providers used to manage app-wide state (e.g., AuthContext, ThemeContext).
  - `/routes`: Contains route configuration and route-based components.
  - `/services`: External services, like Firebase, Stripe, or other APIs.
  - `/store`: Global state management for the app (e.g., Redux, Zustand, Recoil).
  - `/styles`: Global styles, including base CSS files or styled components.
  - `/types`: TypeScript types and interfaces that are shared across the app.
  - `/utils`: Utility functions or helper methods used across the app.
  
- `.env`: Environment variables that contain sensitive information, such as API keys and Firebase credentials.
- `package.json`: Contains the project's dependencies, scripts, and other configuration.
- `tsconfig.json`: Configuration file for TypeScript compiler options.

### Installation

To set up the project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/donadoniman/pwa-firebase-auth.git
