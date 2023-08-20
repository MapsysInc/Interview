const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './frontend/src') // Adjust the path accordingly
      }
    }
  },
  publicPath: './' // Set the correct public path for your project
});
