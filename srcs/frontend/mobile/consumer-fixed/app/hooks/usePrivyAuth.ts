// Temporarily disable Privy imports to avoid crypto issues
// import { usePrivy, useLoginWithEmail, useLoginWithSMS } from '@privy-io/expo';
import { useAuthStore } from '../../utils/providers/stores/authStore';
import { useEffect } from 'react';

export function usePrivyAuth() {
  // Mock Privy hooks for now to avoid crypto issues
  const ready = true;
  const authenticated = false;
  const user = null;
  const login = async () => console.log('Privy login mock');
  const privyLogout = async () => console.log('Privy logout mock');
  const getAccessToken = async () => 'mock_token';
  const linkEmail = async () => console.log('Link email mock');
  const linkPhone = async () => console.log('Link phone mock');
  const unlinkEmail = async () => console.log('Unlink email mock');
  const unlinkPhone = async () => console.log('Unlink phone mock');
  
  const loginWithEmail = async () => console.log('Email login mock');
  const loginWithSMS = async () => console.log('SMS login mock');
  
  const { 
    privyHandshake, 
    logout: storeLogout, 
    updateUser,
    isLoading: storeLoading 
  } = useAuthStore();

  // Sync Privy authentication state with our store
  useEffect(() => {
    if (ready && authenticated && user) {
      handlePrivyAuthentication();
    }
  }, [ready, authenticated, user]);

  const handlePrivyAuthentication = async () => {
    try {
      // Get access token from Privy
      const accessToken = await getAccessToken();
      if (accessToken) {
        // Perform handshake with our backend
        await privyHandshake(accessToken);
        
        // Update user data in store
        if (user) {
          updateUser({
            privy_id: user.id,
            email: user.email?.address || '',
            phone: user.phone?.number || '',
          });
        }
      }
    } catch (error) {
      console.error('Privy authentication failed:', error);
    }
  };

  const loginWithEmailAndPassword = async (email: string) => {
    try {
      await loginWithEmail({ email });
    } catch (error) {
      console.error('Email login failed:', error);
      throw error;
    }
  };

  const loginWithPhoneNumber = async (phoneNumber: string) => {
    try {
      await loginWithSMS({ phoneNumber });
    } catch (error) {
      console.error('SMS login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await privyLogout();
      await storeLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const linkEmailAddress = async (email: string) => {
    try {
      await linkEmail({ email });
    } catch (error) {
      console.error('Email linking failed:', error);
      throw error;
    }
  };

  const linkPhoneNumber = async (phoneNumber: string) => {
    try {
      await linkPhone({ phoneNumber });
    } catch (error) {
      console.error('Phone linking failed:', error);
      throw error;
    }
  };

  const unlinkEmailAddress = async (email: string) => {
    try {
      await unlinkEmail(email);
    } catch (error) {
      console.error('Email unlinking failed:', error);
      throw error;
    }
  };

  const unlinkPhoneNumber = async (phoneNumber: string) => {
    try {
      await unlinkPhone(phoneNumber);
    } catch (error) {
      console.error('Phone unlinking failed:', error);
      throw error;
    }
  };

  return {
    // Privy state
    ready,
    authenticated,
    user,
    isLoading: storeLoading,
    
    // Authentication methods
    login,
    logout,
    loginWithEmailAndPassword,
    loginWithPhoneNumber,
    
    // Account linking
    linkEmailAddress,
    linkPhoneNumber,
    unlinkEmailAddress,
    unlinkPhoneNumber,
    
    // Utility
    getAccessToken,
    handlePrivyAuthentication,
  };
}

export default usePrivyAuth; 