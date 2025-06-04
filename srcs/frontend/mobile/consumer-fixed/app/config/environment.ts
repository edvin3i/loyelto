const ENV = {
  development: {
    API_BASE_URL: 'https://api.stage.loyel.to/api/v1',
    PRIVY_APP_ID: 'cmaisgjg700a7l20m3bydnz79',
    PRIVY_CLIENT_ID: 'client-WY6LHQ3CKh6zMj6cHJiufNcN7PgG7dx9K1KdZZGyA3jgT',
    SOLANA_CLUSTER: 'testnet',
    WS_URL: 'wss://api.stage.loyel.to/ws',
  },
  staging: {
    API_BASE_URL: 'https://api.stage.loyel.to/api/v1',
    PRIVY_APP_ID: 'cmaisgjg700a7l20m3bydnz79',
    PRIVY_CLIENT_ID: 'client-WY6LHQ3CKh6zMj6cHJiufNcN7PgG7dx9K1KdZZGyA3jgT',
    SOLANA_CLUSTER: 'testnet',
    WS_URL: 'wss://api.stage.loyel.to/ws',
  },
  production: {
    API_BASE_URL: 'https://api.loyel.to/api/v1',
    PRIVY_APP_ID: 'cmaisgjg700a7l20m3bydnz79',
    PRIVY_CLIENT_ID: 'client-WY6LHQ3CKh6zMj6cHJiufNcN7PgG7dx9K1KdZZGyA3jgT',
    SOLANA_CLUSTER: 'mainnet-beta',
    WS_URL: 'wss://api.loyel.to/ws',
  },
};

function getEnvironment() {
  if (process.env.EXPO_PUBLIC_APP_ENV === 'production') return ENV.production;
  return ENV.staging;
}

const config = getEnvironment();

export const API_BASE_URL = config.API_BASE_URL;
export const PRIVY_APP_ID = config.PRIVY_APP_ID;
export const SOLANA_CLUSTER = config.SOLANA_CLUSTER;
export const WS_URL = config.WS_URL;

export default config; 