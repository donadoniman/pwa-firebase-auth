import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './providers/AuthProvider';

// Was asserting "learn react" -- the default CRA boilerplate text, long
// gone from App.tsx (it renders AppRoutes now) -- so this test was
// already failing before this pass touched anything. App.tsx doesn't
// mount AuthProvider itself (that happens once, in index.tsx, wrapping
// App from outside) so the real session hydration Home.tsx now depends
// on via useAuth() needs a real AuthProvider here too, same as
// production. onAuthStateChanged is mocked -- a live Firebase project
// isn't available/wanted in a unit test.
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: (_auth: unknown, callback: (user: unknown) => void) => {
    callback(null); // no persisted session -- renders the signed-out Home copy
    return jest.fn();
  },
  signOut: jest.fn(),
}));
jest.mock('./services/firebase', () => ({ auth: {} }));

test('renders the Home route once auth has hydrated to signed-out', async () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  expect(await screen.findByRole('heading', { name: /welcome to focusapp/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login');
});
