const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Ensure smooth asset loading for Android Preview Build
config.resolver.sourceExts.push("js", "json", "ts", "tsx", "jsx");

module.exports = config;
