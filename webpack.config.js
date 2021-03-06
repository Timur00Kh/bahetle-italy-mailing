const path = require('path');
const HtmlWebpackInlineStylePlugin = require('html-webpack-inline-style-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const args = require('minimist')(process.argv.slice(2));
const DEV = args.dev;

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;

const fs = require('fs');
const content = JSON.parse(fs.readFileSync('./content.json', 'utf8'));


module.exports = ['index', 'mini-degustation', 'email'].map(s => ({
    entry: `./src/index.js`,
    output: {
        filename: 'empty.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new HtmlWebpackPlugin({
            filename: `${s}.html`,
            template: `./src/${s}.ejs`,
            inlineSource: '.(css)$',
            inject: DEV,
            params: {
                ...content
            }
        }),
        new HtmlWebpackInlineStylePlugin(),
        new HTMLInlineCSSWebpackPlugin(),
    ],
    devServer: {
        contentBase: './dist',
        port: 8087,
        host: '0.0.0.0',
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },{
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    // 'style-loader',
                    'css-loader',
                ],
            },
        ],

    }

}));
