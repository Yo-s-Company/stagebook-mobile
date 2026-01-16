const { getDefaultConfig } = require('expo/metro-config');

// Bypass: Eliminamos el wrapper de withNativeWind para saltar el error de Windows
module.exports = getDefaultConfig(__dirname);