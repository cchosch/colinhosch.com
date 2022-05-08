import res from "express/lib/response";
import App from "../client/src/App.js"
import react from "react";
import Home from "../client/src/components/home.jsx";
const express = require("express");
const  ReactDOMServer = require('react-dom/server');
const path = require("path");
const fs = require("fs");
const app = express();
const port = 5427;
const pubPath = path.join(__dirname, "/../client/public");
const index = fs.readFileSync(path.join(pubPath, "index.html"), "utf-8");

app.use(express.static(pubPath));

app.get("/*", (req, res) => {
    var home = ReactDOMServer.renderToString(<Home/>);
    res.send(index.replace("<div id=\"root\"></div>", `<div id="root">${home}</div>`));
});


app.listen(port, () => {
    console.log("listening on localhost:"+port +" ");
});