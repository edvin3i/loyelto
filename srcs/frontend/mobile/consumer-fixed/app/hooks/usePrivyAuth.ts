import { usePrivy, useLoginWithEmail, useLoginWithSMS } from '@privy-io/expo';
import { useAuthStore } from '../stores/authStore';
import { useEffect } from 'react';

export function usePrivyAuth() {
  const { 
    ready, 
    authenticated, 
    user, 
    login, 
    logout: privyLogout,
    getAccessToken,
    linkEmail,
    linkPhone,
    unlinkEmail,
    unlinkPhone,
  } = usePrivy();
  
  const { loginWithEmail } = useLoginWithEmail();
  const { loginWithSMS } = useLoginWithSMS();
  
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