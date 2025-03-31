// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/js/[name].[contenthash].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  devtool: isDevelopment ? 'eval-source-map' : false,
  module: {
    rules: [
      // TypeScript/JavaScript
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
      // CSS/SCSS
      {
        test: /\.(css|scss|sass)$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      // Imágenes
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: 'assets/images/[hash][ext][query]',
        },
      },
      // Fuentes
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[hash][ext][query]',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico',
      minify: !isDevelopment,
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash].css',
    }),
    new Dotenv({
      systemvars: true,
    }),
  ],
  optimization: {
    minimize: !isDevelopment,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: !isDevelopment,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    runtimeChunk: 'single',
  },
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    hot: true,
    port: 3000,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  performance: {
    hints: isDevelopment ? false : 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};