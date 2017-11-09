let webpack = require('webpack');

module.exports = {
    devtool: 'inline-source-map',
    context: __dirname + '/src',
    entry: {
        index: './index',
        login: './login',
        register: './register',
        "new-event": './new-event',
        "event-details": './event-details',
        profile: './profile',
        "edit-profile": './edit-profile'
    },
    output: {
        filename: '[name].bundle.js',
        path: __dirname + '/dist'
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    devServer: {
        contentBase: __dirname, // Default (project's root directory)
        publicPath: '/dist/', // Path where bundles are
        compress: true, // Enable gzip compresion when serving content
        port: 8080 // Default
    },
    module: {
        rules: [
            { // Compiles TypeScript
                test: /\.tsx?$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'ts-loader'                
                }]
            },
            { // Compiles Handlebars templates
                test: /\.handlebars$/,
                loader: "handlebars-loader"
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            minChunks: 2, // If shared by at least 2 entries goes here
        })
    ]
};