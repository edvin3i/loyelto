// Polyfills required for Privy (order matters!)
import 'react-native-get-random-values';
import 'fast-text-encoding';

// Crypto polyfill using Expo's crypto
import * as Crypto from 'expo-crypto';

// Polyfill global crypto for libraries that expect it
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues: (array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    },
    randomUUID: () => Crypto.randomUUID(),
    subtle: {
      digest: async (algorithm, data) => {
        const hashAlgorithm = algorithm === 'SHA-256' ? Crypto.CryptoDigestAlgorithm.SHA256 : 
                             algorithm === 'SHA-1' ? Crypto.CryptoDigestAlgorithm.SHA1 :
                             Crypto.CryptoDigestAlgorithm.SHA256;
        return await Crypto.digestStringAsync(hashAlgorithm, data);
      }
    }
  };
}

import '@ethersproject/shims';

import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
