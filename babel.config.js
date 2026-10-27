module.exports = (api) => {
  // El entorno lo fija babel-loader (envName) según el modo de webpack; Jest usa "test".
  const isDevelopment = api.env('development');

  return {
    presets: [
      ['@babel/preset-env', { targets: { chrome: '120' } }],
      ['@babel/preset-react', { runtime: 'automatic', development: isDevelopment }],
      '@babel/preset-typescript',
    ],
  };
};
