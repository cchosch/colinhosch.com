const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    entry: "./src/index.js",
    target: "node",
    externals: [nodeExternals()],
    output: {
        path: path.resolve("server-build"),
        filename: "index.js",
    },
    module:{
        rules:[
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                options: { presets: ["@babel/preset-env", "@babel/preset-react"]}
            },
            {
                test: /\.css$/i,
                use: [  "css-loader" ],
            }
        ]
    }
}
