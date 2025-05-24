import React, { createContext, useContext, useEffect, useState } from 'react';
import { PrivyProvider, usePrivy } from '@privy-io/react-auth';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: () => void;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_CONFIG = {
  appId: 'cmaisgjg700a7l20m3bydnz79', // From your backend config
  config: {
    loginMethods: ['email', 'sms'],
    appearance: {
      theme: 'light',
      accentColor: '#0082FF',
    },
    embeddedWallets: {
      createOnLogin: 'users-without-wallets',
      requireUserPasswordOnCreate: false,
    },
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider appId={AUTH_CONFIG.appId} config={AUTH_CONFIG.config}>
      <AuthContextProvider>{children}</AuthContextProvider>
    </PrivyProvider>
  );
}

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, user, login, logout, getAccessToken } = usePrivy();
  const [token, setToken] = useState<string | null>(null);

  // Get and store access token
  useEffect(() => {
    if (authenticated && ready) {
      getAccessToken().then(async (accessToken) => {
        if (accessToken) {
          setToken(accessToken);
          // Store token securely
          await SecureStore.setItemAsync('auth_token', accessToken);
          // Send handshake to backend
          await sendHandshake(accessToken);
        }
      });
    } else {
      setToken(null);
      await SecureStore.deleteItemAsync('auth_token');
    }
  }, [authenticated, ready]);

  const sendHandshake = async (accessToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/handshake`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Handshake failed');
      }
    } catch (error) {
      console.error('Authentication handshake failed:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        isAuthenticated: authenticated && ready,
        user,
        login,
        logout,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}; 