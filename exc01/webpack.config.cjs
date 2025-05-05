const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './___BUILD_LIB_FILE_TestExperiment/API_PROVIDER_FOR_WEBPACK_LIB_GENERATION.ts',
    // entry: './___BUILD_LIB_FILE_TestExperiment/API_PROVIDER_FOR_WEBPACK_LIB_GENERATION.ts',
    devtool: "inline-source-map",
    output: {
        // path:'./',
        path: path.resolve(__dirname, './'),
        filename: './nof1experimentation.js',
        // filename: './___BUILD_LIB_FILE_TestExperiment/experiment.js',
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
        fallback: { "crypto": false },
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
            },
        ],
    },

    // plugins: [
    //     new HtmlWebpackPlugin({
    //         title: 'TestExperiment',
    //         filename: 'Experiments.html',
    //         inject: true
    //     })
    // ]

};