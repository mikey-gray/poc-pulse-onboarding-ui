import React, { createContext, useContext, useMemo } from 'react';
import { PublicClientApplication, Configuration, AccountInfo, AuthenticationResult } from '@azure/msal-browser';

interface AuthContextValue {
  msal: PublicClientApplication;
  account: AccountInfo | null;
  login(): Promise<AccountInfo | null>;
  logout(): Promise<void>;
  acquireToken(scopes?: string[]): Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// POC configuration (replace with your real values / .env in production)
const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || 'YOUR_CLIENT_ID',
    authority: import.meta.env.VITE_AZURE_AUTHORITY || 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin,
  },
  cache: { cacheLocation: 'localStorage' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const msal = useMemo(() => new PublicClientApplication(msalConfig), []);
  const [account, setAccount] = React.useState<AccountInfo | null>(null);

  React.useEffect(() => {
    msal.initialize().then(() => {
      const accounts = msal.getAllAccounts();
      if (accounts.length) setAccount(accounts[0]);
    });
  }, [msal]);

  const login = async (): Promise<AccountInfo | null> => {
    try {
      const result: AuthenticationResult = await msal.loginPopup({
        scopes: ['User.Read', 'Contacts.Read'],
      });
      setAccount(result.account || null);
      return result.account || null;
    } catch (e) {
      console.error('Login failed', e);
      return null;
    }
  };

  const logout = async () => {
    if (!account) return;
    try {
      await msal.logoutPopup({ account });
      setAccount(null);
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  const acquireToken = async (scopes: string[] = ['User.Read', 'Contacts.Read']) => {
    if (!account) return null;
    try {
      const result = await msal.acquireTokenSilent({ account, scopes });
      return result.accessToken;
    } catch (e) {
      try {
        const interactive = await msal.acquireTokenPopup({ account, scopes });
        return interactive.accessToken;
      } catch (err) {
        console.error('Token acquisition failed', err);
        return null;
      }
    }
  };

  const value: AuthContextValue = { msal, account, login, logout, acquireToken };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}