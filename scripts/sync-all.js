const fs = require('fs');
const path = require('path');

console.log('🔄 Ionic Sync Manager - Iniciando sincronización...\n');

// 1. LEER FUENTE PRINCIPAL
console.log('1. 📖 Leyendo capacitor.config.ts...');
const capacitorConfigPath = path.join(__dirname, '../capacitor.config.ts');

if (!fs.existsSync(capacitorConfigPath)) {
  console.error('   ❌ capacitor.config.ts no encontrado');
  console.error('   💡 Ejecuta: npx cap init');
  process.exit(1);
}

let capacitorContent = fs.readFileSync(capacitorConfigPath, 'utf8');

// Extraer configuración con regex mejorado
const config = {
  appId: extractValue(capacitorContent, 'appId'),
  appName: extractValue(capacitorContent, 'appName'),
  version: extractValue(capacitorContent, 'version') || '1.0.0'
};

if (!config.appId || !config.appName) {
  console.error('   ❌ appId o appName no encontrados en capacitor.config.ts');
  process.exit(1);
}

console.log('   ✅ Configuración detectada:');
console.log(`      - App ID: ${config.appId}`);
console.log(`      - App Name: ${config.appName}`);
console.log(`      - Version: ${config.version}`);

// 2. SINCRONIZAR PACKAGE.JSON
console.log('2. 📦 Sincronizando package.json...');
const packageJsonPath = path.join(__dirname, '../package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Mantener información existente o usar valores por defecto
  packageData.name = config.appName.toLowerCase().replace(/\s+/g, '-');
  packageData.version = config.version;
  packageData.author = packageData.author || 'Ionic Developer';
  packageData.homepage = packageData.homepage || 'https://ionicframework.com/';
  packageData.description = packageData.description || 
    `${config.appName} - Aplicación Ionic desarrollada con Capacitor`;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageData, null, 2));
  console.log('   ✅ package.json actualizado');
}

// 3. SINCRONIZAR ANDROID
console.log('3. 🤖 Sincronizando plataforma Android...');
syncAndroidPlatform(config);

// 4. SINCRONIZAR IOS
console.log('4. 🍎 Sincronizando plataforma iOS...');
syncIosPlatform(config);

// 5. SINCRONIZAR CONFIG.XML (Cordova)
console.log('5. 📱 Sincronizando config.xml...');
syncConfigXml(config);

console.log('\n🎉 ¡Sincronización completada!');
console.log('📋 Todos los archivos derivan de capacitor.config.ts');
console.log('💡 Modifica capacitor.config.ts y ejecuta: npm run sync:all');

// ===== FUNCIONES AUXILIARES =====
function extractValue(content, key) {
  const match = content.match(new RegExp(`${key}:\\s*['"]([^'"]+)['"]`));
  return match ? match[1] : null;
}

function syncAndroidPlatform(config) {
  const androidPaths = {
    buildGradle: '../android/app/build.gradle',
    androidManifest: '../android/app/src/main/AndroidManifest.xml',
    stringsXml: '../android/app/src/main/res/values/strings.xml'
  };

  Object.entries(androidPaths).forEach(([name, relativePath]) => {
    const fullPath = path.join(__dirname, relativePath);
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      switch (name) {
        case 'buildGradle':
          content = content.replace(/namespace ".*"/, `namespace "${config.appId}"`);
          content = content.replace(/applicationId ".*"/, `applicationId "${config.appId}"`);
          content = content.replace(/versionName "[^"]*"/, `versionName "${config.version}"`);
          break;
          
        case 'androidManifest':
          content = content.replace(/package="[^"]*"/, `package="${config.appId}"`);
          content = content.replace(/android:label="[^"]*"/, `android:label="${config.appName}"`);
          break;
          
        case 'stringsXml':
          content = content.replace(/<string name="app_name">[^<]*<\/string>/, 
            `<string name="app_name">${config.appName}</string>`);
          break;
      }
      
      fs.writeFileSync(fullPath, content);
      console.log(`   ✅ ${name} actualizado`);
    }
  });
}

function syncIosPlatform(config) {
  const pbxprojPath = path.join(__dirname, '../ios/App/App.xcodeproj/project.pbxproj');
  if (fs.existsSync(pbxprojPath)) {
    console.log('   ✅ iOS detectado (actualización manual requerida para Xcode)');
    console.log('   💡 Abre Xcode y actualiza:');
    console.log(`      - Bundle Identifier: ${config.appId}`);
    console.log(`      - Display Name: ${config.appName}`);
    console.log(`      - Version: ${config.version}`);
  }
}

function syncConfigXml(config) {
  const configXmlPath = path.join(__dirname, '../config.xml');
  if (fs.existsSync(configXmlPath)) {
    let content = fs.readFileSync(configXmlPath, 'utf8');
    
    content = content.replace(/id="[^"]*"/, `id="${config.appId}"`);
    content = content.replace(/version="[^"]*"/, `version="${config.version}"`);
    content = content.replace(/<name>[^<]*<\/name>/, `<name>${config.appName}</name>`);
    
    fs.writeFileSync(configXmlPath, content);
    console.log('   ✅ config.xml actualizado');
  }
}