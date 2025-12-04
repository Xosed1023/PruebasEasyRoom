#!/bin/bash

# Script para compilar la aplicación Android
echo "🚀 Compilando aplicación Android..."

# Configurar JAVA_HOME y ANDROID_HOME
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk
export ANDROID_HOME=~/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Verificar que Java esté disponible
if ! command -v javac &> /dev/null; then
    echo "❌ Error: javac no encontrado. Instala el JDK:"
    echo "sudo dnf install java-21-openjdk-devel"
    exit 1
fi

echo "✅ Java JDK encontrado: $(javac -version 2>&1)"

# Verificar que Android SDK esté disponible
if [ ! -d "$ANDROID_HOME" ]; then
    echo "❌ Error: Android SDK no encontrado en $ANDROID_HOME"
    echo "Instala Android SDK o configura ANDROID_HOME correctamente"
    exit 1
fi

echo "✅ Android SDK encontrado en: $ANDROID_HOME"

# Compilar el proyecto React (sin PWA para móvil)
echo "📦 Compilando proyecto React para móvil..."
npm run build:mobile

if [ $? -ne 0 ]; then
    echo "❌ Error compilando el proyecto React"
    exit 1
fi

# Sincronizar con Capacitor
echo "🔄 Sincronizando con Capacitor..."
npx cap sync

if [ $? -ne 0 ]; then
    echo "❌ Error sincronizando con Capacitor"
    exit 1
fi

# Compilar APK
echo "🔨 Compilando APK..."
cd android
./gradlew assembleDebug --no-daemon

if [ $? -eq 0 ]; then
    echo "✅ ¡APK compilado exitosamente!"
    
    # Buscar el APK generado
    APK_PATH=$(find . -name "*.apk" -type f | head -1)
    if [ -n "$APK_PATH" ]; then
        echo "📱 APK encontrado en: $APK_PATH"
        APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
        echo "📦 Tamaño del APK: $APK_SIZE"
    else
        echo "⚠️  APK compilado pero no encontrado en la ubicación esperada"
        echo "🔍 Buscando archivos APK..."
        find . -name "*.apk" -type f -exec ls -lh {} \;
    fi
else
    echo "❌ Error compilando APK"
    exit 1
fi
