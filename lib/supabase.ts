import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

let supabaseUrl: string | undefined;
let supabaseAnonKey: string | undefined;

if (Platform.OS === 'web') {
  // For web, use process.env directly
  supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
} else {
  // For native, use react-native-dotenv
  supabaseUrl = process.env.SUPABASE_URL;
  supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

import { AppState } from 'react-native';

if (Platform.OS !== 'web') {
  // Tells Supabase Auth to continuously refresh the session automatically
  // if the app is in the foreground. When this is added, you will continue
  // to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
  // `SIGNED_OUT` event if the user's session is terminated. This should
  // only be registered once.
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
