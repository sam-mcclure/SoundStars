const path = require('path');

module.exports = {
    context: __dirname,
    entry: './javascript/starsounds.js',
    output: {
        path: path.resolve(__dirname),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '*']
    },
    devtool: 'source-map'
};