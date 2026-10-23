import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.qpms.app',
  appName: 'QPMS',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: 'DARK',
      backgroundColor: '#1f2937'
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
      style: 'DARK'
    }
  }
};

export default config;