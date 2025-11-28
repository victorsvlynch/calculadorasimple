import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // INFORMACIÓN BÁSICA (OBLIGATORIA)
  appId: 'com.victorsvlynch.calculadorasimple',
  appName: 'Caculadora Simple',
  webDir: 'www',
  version: '2.0.0',
  
  // CONFIGURACIÓN ANDROID
  android: {
    buildOptions: {
      keystorePath: '../calculadorasimple.keystore',
      keystorePassword: 'calender17x',
      keystoreAlias: 'calculadorasimple',
      keystoreAliasPassword: 'calender17x'
    }
  },
  
};

export default config;