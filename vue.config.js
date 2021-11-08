const path = require('path');

const CompressionWebpackPlugin = require('compression-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  productionSourceMap: isProduction,
  publicPath: '/',
  devServer: {
    port: 8200,
  },
  pluginOptions: {
    // 插件需要这个配置
    i18n: {},
  },
  transpileDependencies: [/\bvue-awesome\b/, 'vue-charts'],
  configureWebpack: (config) => {
    if (isProduction) {
      // 开启gzip压缩
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: /\.js$|\.html$|\.json$|\.css/,
          threshold: 10240,
          minRatio: 0.8,
        }),
      );

      // 解决vendor过大
      config.optimization = {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 20000000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                // get the name. E.g. node_modules/packageName/not/this/part.js
                // or node_modules/packageName
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                // npm package names are URL-safe, but some servers don't like @ symbols
                return `vendor.${packageName.replace('@', '')}`;
              },
              chunks: 'initial',
              priority: 2,
              minChunks: 2,
            },
          },
        },
      };
    }
  },

  /**
   * 覆盖webpack config
   */
  chainWebpack: (config) => {
    config.resolve.extensions
      .merge(['.js', '.vue', '.json', '.less'])
      .end()
      .alias.set('@', resolve('src'))
      .set('views', resolve('src/views'))
      .set('mixins', resolve('src/mixins'))
      .set('service', resolve('src/service'))
      .set('uses', resolve('src/uses'))
      .set('layout', resolve('src/layout'))
      .set('utils', resolve('src/utils'))
      .set('comp', resolve('src/components'))
      .set('assets', resolve('src/assets'))
      .set('config', resolve('src/config'))
      .set('plugins', resolve('src/plugins'));

    config.module.rule('eslint').delete('enforce');

    // 增加一个图片的配置
    config.module.rule('images').use('url-loader').options({
      limit: 1000,
      name: 'img/[name].[hash:8].[ext]',
    });

    config.module
      .rule('less')
      .oneOf('vue')
      .resourceQuery(/\?vue/)
      .use(['vue-style-loader', 'css-loader', 'less-loader'])
      .loader('style-resources-loader')
      .options({
        patterns: [path.resolve(__dirname, './src/assets/style/vars.less')],
      });
  },
};
