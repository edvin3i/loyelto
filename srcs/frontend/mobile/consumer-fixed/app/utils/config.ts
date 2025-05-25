// Environment configuration

const ENV = {
  dev: {
    apiUrl: 'http://localhost:8000/api/v1',
  },
  staging: {
    apiUrl: 'https://api.stage.loyel.to/api/v1',
  },
  prod: {
    apiUrl: 'https://api.loyel.to/api/v1',
  }
};

// Select the right environment
const getEnvVars = () => {
  if (__DEV__) return ENV.dev;
  if (process.env.EXPO_PUBLIC_APP_ENV === 'staging') return ENV.staging;
  return ENV.prod;
};

export default getEnvVars();