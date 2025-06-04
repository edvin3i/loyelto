// Import required polyfills first
import 'fast-text-encoding';
import 'react-native-get-random-values';
import {Buffer} from 'buffer';
global.Buffer = Buffer;
import '@ethersproject/shims';

// CRITICAL: Enable React Native Screens before any navigation
import { enableScreens } from 'react-native-screens';
enableScreens();

// Then import the expo router
import 'expo-router/entry';
