import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // INFORMACIÓN BÁSICA (OBLIGATORIA)
  appId: 'com.victorsvlynch.calculadorasimple',
  appName: 'Calculadora Simple', // CORREGIDO: faltaba la 'l'
  webDir: 'www',
  version: '2.1.1', // NUEVA VERSIÓN

  // CONFIGURACIÓN ANDROID
  android: {
    buildOptions: {
      keystorePath: '../calculadorasimple.keystore',
      keystorePassword: 'calender17x', // Nota: Ten cuidado compartiendo contraseñas en código
      keystoreAlias: 'calculadorasimple',
      keystoreAliasPassword: 'calender17x'
    }
  },
};

export default config;