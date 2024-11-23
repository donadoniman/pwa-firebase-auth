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

2. Navigate to the project directory:

    ```bash
    cd pwa-firebase-auth

3. Install dependencies:

    ```bash
    npm install

4. Create a .env file in the root directory and add your Firebase credentials:

    ```bash
    REACT_APP_FIREBASE_API_KEY=your-api-key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
    REACT_APP_FIREBASE_PROJECT_ID=your-project-id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    REACT_APP_FIREBASE_APP_ID=your-app-id
    REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id

5. Start the development server:

    ```bash
    npm start



### Changes made:
- Fixed the indentation and organized the directory structure properly for better readability.
- Clarified explanations for various directories.
- Added placeholders in the `.env` section for Firebase configuration.
- Added installation, development, and build instructions to the README.

Let me know if you need further changes or clarifications!