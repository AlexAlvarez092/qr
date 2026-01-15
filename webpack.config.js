const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const rootPath = path.resolve(__dirname, "./");
const srcPath = path.resolve(rootPath, "src");
const distPath = path.resolve(rootPath, "dist");

const config = {
    entry: srcPath + "/index.js",
    output: {
        path: distPath,
        filename: "index.[contenthash].js",
        clean: true, // Webpack 5: reemplaza clean-webpack-plugin
        assetModuleFilename: "assets/[hash][ext]", // Webpack 5: configura nombres de assets
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: srcPath,
                loader: "babel-loader",
            },
            {
                // Webpack 5: Asset Modules reemplaza file-loader
                test: /\.(png|jpe?g|gif|svg)$/i,
                include: srcPath,
                type: "asset/resource",
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: srcPath + "/index.html",
        }),
        new MiniCssExtractPlugin({
            filename: "index.[contenthash].css",
        }),
    ],
};

module.exports = (env, argv) => {
    if (argv.mode === "development") {
        config.devtool = "inline-source-map";
        config.mode = argv.mode;
    }

    if (argv.mode === "production") {
        config.devtool = "source-map";
        config.mode = argv.mode;
    }

    return config;
};
