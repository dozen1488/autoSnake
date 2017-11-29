const _ = require("lodash");
const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")

module.exports = {
    context: __dirname + "/application",
    entry: "./index",
    output: {
        path: path.resolve(__dirname, "../server/server-static"),
        filename: "bundle.js"
    },

    resolve: {
        extensions: [".js", ".json", ".jsx", ".png"]
    },

    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: [
                        "react", "es2017"
                    ]
                }
            },
            {
                test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
                loader: "file-loader"
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            }
        ]
    },
};

if (process.env.NODE_ENV == "development") {
    module.exports = _.merge(
        module.exports,
        {
            watch: true,
            watchOptions: {
                aggregateTimeout: 100
            },
            devtool: "source-map"
        }
    )
}

if (process.env.NODE_ENV == "production") {
    module.exports.plugins = module.exports.plugins || [];
    module.exports.plugins.push(
        new UglifyJsPlugin()
    )
}