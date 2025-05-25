const ENV = {
  development: {
    API_BASE_URL: 'http://localhost:8000/api/v1',
    PRIVY_APP_ID: 'cmaisgjg700a7l20m3bydnz79',
    SOLANA_CLUSTER: 'devnet',
    WS_URL: 'ws://localhost:8000/ws',
  },
  staging: {
    API_BASE_URL: 'https://api.stage.loyel.to/api/v1',
    PRIVY_APP_ID: 'cmaisgjg700a7l20m3bydnz79',
    SOLANA_CLUSTER: 'testnet',
    WS_URL: 'wss://api.stage.loyel.to/ws',
  },
  production: {
    API_BASE_URL: 'https://api.loyel.to/api/v1',
    PRIVY_APP_ID: 'cmaisgjg700a7l20m3bydnz79',
    SOLANA_CLUSTER: 'mainnet-beta',
    WS_URL: 'wss://api.loyel.to/ws',
  },
};

function getEnvironment() {
  if (__DEV__) return ENV.development;
  if (process.env.EXPO_PUBLIC_APP_ENV === 'staging') return ENV.staging;
  return ENV.production;
}

export const config = getEnvironment();
export const API_BASE_URL = config.API_BASE_URL;
export const PRIVY_APP_ID = config.PRIVY_APP_ID;
export const SOLANA_CLUSTER = config.SOLANA_CLUSTER;
export const WS_URL = config.WS_URL; 