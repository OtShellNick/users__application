const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const { NODE_ENV } = process.env;
const IsDev = NODE_ENV === 'development';

const filename = (ext) => (IsDev ? `[name].${ext}` : `[name].[contenthash].${ext}`);

const cssLoaders = (extra) => {
  const loaders = [
    MiniCssExtractPlugin.loader,
    'css-loader',
  ];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};

const babelOptions = (preset) => {
  const opts = {
    presets: [
      '@babel/preset-env',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
    ],
  };

  if (preset) {
    opts.presets.push(preset);
  }

  return opts;
};

const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: babelOptions(),
  }];

  return loaders;
};

const plugins = () => [
  new HTMLWebpackPlugin({
    template: './app/index.html'
  }),
  new CleanWebpackPlugin(),
  new FaviconsWebpackPlugin({
    logo: path.resolve(__dirname, './app/assets/favicon.svg'),
    prefix: 'icons-[fullhash]/',
  }),
  new MiniCssExtractPlugin({
    filename: filename('css'),
  }),
];

module.exports = {
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.scss'],
    alias: {
      '@': path.resolve(__dirname, './app'),
      '@components': path.resolve(__dirname, './app/components'),
      '@assets': path.resolve(__dirname, './app/assets'),
      '@style': path.resolve(__dirname, './app/style'),
      '@containers': path.resolve(__dirname, './app/containers'),
      '@helpers': path.resolve(__dirname, './app/helpers'),
      '@actions': path.resolve(__dirname, './app/actions'),
    },
  },
  mode: NODE_ENV || 'production',
  entry: ['@babel/polyfill', path.resolve(__dirname, './app/index.jsx')],
  output: {
    path: path.resolve(__dirname, './build'),
    publicPath: '/',
    filename: '[name].bundle.js',
  },
  optimization: {
    runtimeChunk: 'single',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        oneOf: [
          {
            resourceQuery: /jsx/,
            use: ['@svgr/webpack'],
          },
          {
            use: 'url-loader',
          },
        ],
        issuer: /\.[jt]sx?$/,
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[contenthash][ext]',
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions('@babel/preset-react'),
          },
        ],
      },
    ],
  },
  devServer: {
    port: 8088,
    static: './build',
    historyApiFallback: true,
    compress: true,
  },
  plugins: plugins(),
};
