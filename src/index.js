import App from "../client/src/App.js"
const express = require("express");
const React = require("react");
const  ReactDOMServer = require('react-dom/server');
import path from "path";
const app = express();
const port = 5427;
const buildPath = path.join(__dirname, "/../client/build");

app.use(express.static(path.join(__dirname, "/../client/build")));

app.get("/*", (req, res) => {
    ReactDOMServer.renderToString(<App/>);
    res.send("cum");
});


app.listen(port, () => {
    console.log("listening on localhost:"+port +" ");
});