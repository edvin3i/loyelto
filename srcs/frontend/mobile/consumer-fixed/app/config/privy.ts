import { PRIVY_APP_ID } from './environment';

export const privyConfig = {
  appId: PRIVY_APP_ID,
  // Configure supported login methods
  loginMethods: ['email', 'sms', 'wallet', 'google', 'apple'],
  // Configure appearance
  appearance: {
    theme: 'light',
    accentColor: '#0082FF',
    logo: undefined, // You can add a logo URL here
  },
  // Configure embedded wallets
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    requireUserPasswordOnCreate: false,
  },
  // Configure legal links
  legal: {
    termsAndConditionsUrl: 'https://loyel.to/terms',
    privacyPolicyUrl: 'https://loyel.to/privacy',
  },
};

export default privyConfig; 