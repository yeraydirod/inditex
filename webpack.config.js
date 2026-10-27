const path = require('node:path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

/**
 * - development: assets sin minimizar, CSS inyectado por style-loader, source maps y HMR.
 * - production: assets concatenados y minimizados (JS con Terser, CSS con cssnano), hash en nombres.
 */
module.exports = (_env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: path.resolve(__dirname, 'src/index.tsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
      publicPath: '/',
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: { '@': path.resolve(__dirname, 'src') },
    },
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: true,
                  namedExport: false,
                  exportLocalsConvention: 'as-is',
                  localIdentName: isProduction ? '[hash:base64:6]' : '[name]__[local]',
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        favicon: path.resolve(__dirname, 'public/favicon.svg'),
      }),
      new webpack.DefinePlugin({
        'process.env.CORS_PROXY_URL': JSON.stringify(process.env.CORS_PROXY_URL ?? ''),
      }),
      new ForkTsCheckerWebpackPlugin(),
      isProduction &&
        new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash:8].css' }),
    ].filter(Boolean),
    optimization: {
      minimize: isProduction,
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
      splitChunks: isProduction ? { chunks: 'all' } : false,
    },
    performance: { hints: isProduction ? 'warning' : false },
    devServer: {
      port: 3000,
      historyApiFallback: true,
      hot: true,
      open: false,
      client: { overlay: { warnings: false, errors: true } },
    },
  };
};
