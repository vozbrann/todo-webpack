const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'js/main.js',
        path: path.resolve(__dirname, 'docs')
    },
    devServer: {
        contentBase: path.join(__dirname, 'docs'),
        compress: true,
        port: 9000
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            // ...additional rules...
        ],
    },
};
