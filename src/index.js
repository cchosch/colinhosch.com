import App from "./../client/src/App.js"
import express from "express";
import react from "react";
import ReactDOMServer from 'react-dom/server';
import path from "path";
const app = express();
const port = 5427;
const buildPath = path.join(__dirname, "/../client/build");

app.use(express.static(path.join(__dirname, "/../client/build")));

app.get("/*", (req, res) => {
    var INDEX = ReactDOMServer.renderToString(App);
    res.send(INDEX);
});



app.listen(port, () => {
    console.log("listening on localhost:"+port +" ");
});