const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Version web : expo-sqlite (la sauvegarde) utilise un fichier .wasm, que Metro doit savoir lire
if (!config.resolver.assetExts.includes('wasm')) {
  config.resolver.assetExts.push('wasm');
}

// Version web : SQLite a besoin de « SharedArrayBuffer », que le navigateur n'autorise qu'avec ces 2 en-têtes.
// (Seulement pour le serveur de développement ; un hébergement web devra envoyer les mêmes en-têtes.)
const enhanceMiddleware = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (middleware, metroServer) => {
  const enhancedMiddleware = enhanceMiddleware ? enhanceMiddleware(middleware, metroServer) : middleware;
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    return enhancedMiddleware(req, res, next);
  };
};

module.exports = withNativeWind(config, { input: './src/global.css' });
