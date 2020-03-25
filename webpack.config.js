const path = require("path")
const TerserPlugin = require("terser-webpack-plugin")
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

module.exports = {
    // entry: "./src/index.ts",
    entry: {
        "8draw": "./src/index.ts"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.html?$/,
                use: "raw-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            }
        ]
    },
    devtool: "source-map",
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
        // alias: {
        //     "@src": path.resolve(__dirname, "./src/"),
        //     "@app": path.resolve(__dirname, "./src/app/"),
        //     "@utils": path.resolve(__dirname, "./src/utils/"),
        //     "@settings": path.resolve(__dirname, "./src/APP_CONFIG.ts"),
        //     "@errors": path.resolve(__dirname, "./src/errors.ts")
        // }
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        library: "OTTOdraw",
        libraryTarget: "umd"
    },
    optimization: {
        minimizer: [new TerserPlugin({ terserOptions: { safari10: true } })]
    }
}
