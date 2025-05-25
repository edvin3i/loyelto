import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Keychain from 'react-native-keychain';
import NetInfo from '@react-native-community/netinfo';
import { API_BASE_URL } from '../config/environment';

// Updated User interface to match backend model
export interface User {
  id: string;
  privy_id: string;
  email: string;
  phone: string;
  created_at: string;
  wallets?: Wallet[];
}

export interface Wallet {
  id: string;
  address: string;
  chain: string;
  user_id: string;
}

export interface AuthState {
  // State
  user: User | null;
  privyToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOnline: boolean;
  
  // Actions
  privyHandshake: (privyToken: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  checkAuthStatus: () => Promise<void>;
  setOnlineStatus: (status: boolean) => void;
  
  // Biometric authentication
  enableBiometric: () => Promise<boolean>;
  authenticateWithBiometric: () => Promise<boolean>;
  isBiometricEnabled: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      privyToken: null,
      isAuthenticated: false,
      isLoading: false,
      isOnline: true,

      // Privy Handshake (main authentication method)
      privyHandshake: async (privyToken: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/handshake`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${privyToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`Authentication failed: ${response.status}`);
          }

          // Store token securely
          await SecureStore.setItemAsync('privy_token', privyToken);
          
          // Get user data after successful handshake
          const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
            headers: {
              'Authorization': `Bearer ${privyToken}`,
              'Content-Type': 'application/json'
            }
          });

          let user = null;
          if (userResponse.ok) {
            user = await userResponse.json();
          }
          
          set({
            user,
            privyToken,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          console.error('Privy handshake failed:', error);
          throw error;
        }
      },

      // Logout
      logout: async () => {
        try {
          await SecureStore.deleteItemAsync('privy_token');
          await Keychain.resetInternetCredentials('biometric_auth');
          
          set({
            user: null,
            privyToken: null,
            isAuthenticated: false
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      // Update User
      updateUser: (userData: Partial<User>) => {
        set(state => ({
          user: state.user ? { ...state.user, ...userData } : null
        }));
      },

      // Check Auth Status
      checkAuthStatus: async () => {
        try {
          const token = await SecureStore.getItemAsync('privy_token');
          if (token) {
            // Verify token is still valid
            const response = await fetch(`${API_BASE_URL}/auth/handshake`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            if (response.ok) {
              set({ privyToken: token, isAuthenticated: true });
              
              // Get updated user data
              const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });

              if (userResponse.ok) {
                const user = await userResponse.json();
                set({ user });
              }
            } else {
              // Token invalid, logout
              await get().logout();
            }
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          await get().logout();
        }
      },

      // Set Online Status
      setOnlineStatus: (status: boolean) => {
        set({ isOnline: status });
      },

      // Biometric Authentication
      enableBiometric: async (): Promise<boolean> => {
        try {
          const credentials = await Keychain.getSupportedBiometryType();
          if (!credentials) return false;

          const token = get().privyToken;
          if (!token) return false;

          await Keychain.setInternetCredentials(
            'biometric_auth',
            'user',
            token,
            {
              accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
              authenticatePrompt: 'Authenticate to enable biometric login'
            }
          );
          return true;
        } catch (error) {
          console.error('Biometric setup failed:', error);
          return false;
        }
      },

      authenticateWithBiometric: async (): Promise<boolean> => {
        try {
          const credentials = await Keychain.getInternetCredentials('biometric_auth', {
            authenticatePrompt: 'Authenticate to login'
          });
          
          if (credentials && credentials.password) {
            await get().privyHandshake(credentials.password);
            return true;
          }
          return false;
        } catch (error) {
          console.error('Biometric auth failed:', error);
          return false;
        }
      },

      isBiometricEnabled: async (): Promise<boolean> => {
        try {
          const credentials = await Keychain.getInternetCredentials('biometric_auth');
          return !!credentials;
        } catch {
          return false;
        }
      }
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// Network status listener
NetInfo.addEventListener(state => {
  useAuthStore.getState().setOnlineStatus(state.isConnected ?? false);
}); 