module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],  // Adjust this path if your code is in a different directory
          alias: {
            '@components': './app/Components',
            '@assets': './assets'
          },
        },
      ],
    ],
  };
};
