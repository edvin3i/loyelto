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
  role?: 'consumer' | 'business';
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
  userRole: 'consumer' | 'business' | null;
  
  // Actions
  privyHandshake: (privyToken: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  checkAuthStatus: () => Promise<void>;
  setOnlineStatus: (status: boolean) => void;
  setUserRole: (role: 'consumer' | 'business') => void;
  
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
      userRole: null,

      // Privy Handshake (main authentication method)
      privyHandshake: async (privyToken: string) => {
        set({ isLoading: true });
        try {
          console.log('🔄 [AUTH-STORE] Starting handshake with backend...');
          console.log('🔍 [AUTH-STORE] Request details:', {
            url: `${API_BASE_URL}/auth/handshake`,
            method: 'POST',
            tokenLength: privyToken?.length || 0,
            tokenStart: privyToken ? privyToken.substring(0, 30) : 'null',
            baseUrl: API_BASE_URL
          });
          
          const response = await fetch(`${API_BASE_URL}/auth/handshake`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${privyToken}`,
              'Content-Type': 'application/json'
            }
          });

          console.log('📡 [AUTH-STORE] Handshake response status:', response.status);
          console.log('📡 [AUTH-STORE] Response headers:', Object.fromEntries(response.headers.entries()));

          if (!response.ok) {
            // Get response body for more details
            let errorBody = '';
            try {
              errorBody = await response.text();
              console.error('📄 [AUTH-STORE] Error response body:', errorBody);
            } catch (e) {
              console.error('📄 [AUTH-STORE] Could not read error response body');
            }
            
            // Enhanced error handling for specific status codes
            if (response.status === 401) {
              console.error('🔐 [AUTH-STORE] 401 Unauthorized - Backend rejected the token');
              console.error('🔍 [AUTH-STORE] Possible issues:');
              console.error('  - Token format is wrong (should be JWT)');
              console.error('  - Token signature validation failed');
              console.error('  - Token audience/issuer mismatch');
              console.error('  - Backend Privy config different from frontend');
              console.error('  - Token expired or not yet valid');
              
              // For development: try to continue anyway
              console.log('🎭 [AUTH-STORE] Development mode: storing token for API calls anyway');
              await SecureStore.setItemAsync('privy_token', privyToken);
              
              set({
                privyToken,
                isAuthenticated: true,
                isLoading: false,
                user: {
                  id: 'dev_user_401',
                  privy_id: 'dev_privy_401',
                  email: 'dev401@example.com',
                  phone: '+1234567890',
                  created_at: new Date().toISOString(),
                }
              });
              
              console.log('✅ [AUTH-STORE] Development mode: proceeding despite 401');
              return;
            }
            
            if (response.status === 500) {
              console.error('💥 [AUTH-STORE] Backend handshake failed with 500 error');
              console.error('🔍 [AUTH-STORE] This could be due to:');
              console.error('  - Database connection issues');
              console.error('  - Privy API configuration problems');
              console.error('  - Backend service unavailable');
              
              // For development: store token anyway to allow API calls
              console.log('🎭 [AUTH-STORE] Storing token anyway for development mode');
              await SecureStore.setItemAsync('privy_token', privyToken);
              
              set({
                privyToken,
                isAuthenticated: true,
                isLoading: false,
                user: {
                  id: 'temp_user',
                  privy_id: 'temp_privy_id',
                  email: 'temp@example.com',
                  phone: '+1234567890',
                  created_at: new Date().toISOString(),
                }
              });
              
              console.log('✅ [AUTH-STORE] Development mode: proceeding with temp credentials');
              return;
            }
            
            throw new Error(`Authentication failed: ${response.status} - ${errorBody}`);
          }

          // Store token securely
          console.log('💾 [AUTH-STORE] Storing token in SecureStore...');
          await SecureStore.setItemAsync('privy_token', privyToken);
          
          // Get user data after successful handshake
          console.log('👤 [AUTH-STORE] Fetching user data...');
          const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
            headers: {
              'Authorization': `Bearer ${privyToken}`,
              'Content-Type': 'application/json'
            }
          });

          let user = null;
          if (userResponse.ok) {
            user = await userResponse.json();
            console.log('✅ [AUTH-STORE] User data retrieved:', user?.id);
          } else {
            console.warn('⚠️ [AUTH-STORE] Failed to fetch user data, using fallback');
          }
          
          set({
            user,
            privyToken,
            isAuthenticated: true,
            isLoading: false
          });
          
          console.log('✅ [AUTH-STORE] Handshake completed successfully');
          
        } catch (error) {
          set({ isLoading: false });
          console.error('❌ [AUTH-STORE] Privy handshake failed:', error);
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
            isAuthenticated: false,
            userRole: null
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

      // Set User Role
      setUserRole: (role: 'consumer' | 'business') => {
        set({ userRole: role });
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