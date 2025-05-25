import React from 'react';
// Temporarily disable Privy provider to avoid crypto issues
// import { PrivyProvider as PrivyProviderBase } from '@privy-io/expo';
// import { privyConfig } from '../config/privy';

interface PrivyProviderProps {
  children: React.ReactNode;
}

export function PrivyProvider({ children }: PrivyProviderProps) {
  // Return children directly without Privy wrapper for now
  return <>{children}</>;
}

export default PrivyProvider; 