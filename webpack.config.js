const path = require('path'); 
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['ts-loader'],
                exclude: [path.resolve(__dirname, 'node_modules')]
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.css/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: "asset/resource",
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({template: './src/index.html'}),
        new CopyWebpackPlugin({
            patterns: [
              { from: "public", to: "public" }
            ]
          }),
        new webpack.BannerPlugin({
            banner: `SpellTimer v1.0.0\nAuthor: ARTEMII KHAFIZOV\nContact: spelltimer@gmail.com\nLicense: 2025 spelltimer.com. All rights reserved.`,
            raw: false,
            entryOnly: true,
        })
    ],
    devServer: {
        historyApiFallback: true,
        hot: true,
        port: 3000,
      }
};