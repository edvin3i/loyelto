import React from 'react';
import { PrivyProvider as PrivyProviderBase } from '@privy-io/expo';
import { privyConfig } from '../config/privy';

interface PrivyProviderProps {
  children: React.ReactNode;
}

export function PrivyProvider({ children }: PrivyProviderProps) {
  return (
    <PrivyProviderBase
      appId={privyConfig.appId}
      config={{
        loginMethods: privyConfig.loginMethods,
        appearance: privyConfig.appearance,
        embeddedWallets: privyConfig.embeddedWallets,
        legal: privyConfig.legal,
      }}
    >
      {children}
    </PrivyProviderBase>
  );
}

export default PrivyProvider; 