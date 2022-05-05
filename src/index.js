const express = require("express");
const path = require("path");
const app = express();
const port = 5427;
const buildPath = path.join(__dirname, "/../client/build");

app.use(express.static(path.join(__dirname, "/../client/build")));

app.get("/*", (req, res) => {
    res.sendFile(buildPath +"/index.html");
});

app.listen(port, () => {
    console.log("listening on localhost:"+port +" ");
});