const express = require("express");
const path = require("path");
const app = express();
const port = 5427;

app.use(express.static(path.join(__dirname, "/../client/build")));

app.get("/", (req, res) => {
    res.sendFile("index.html");
});


app.get("/*", (req, res) => {
    res.send("fuck you");
});

app.listen(port, () => {
    console.log("listening on localhost:"+port +" ");
});