const express = require("express");
const app = express();

const port = 3030;

//Define route
app.get("/", (req, res) => {
    console.log('Client conected');

    res.setHeader('Content-Type', "text/event-stream");
    res.setHeader("Access-Control-Allow-Origin", "x");

    const intervalId = setInterval(() => {
        const date = new Date().toLocaleString();
        res.write('data: ${date}\n\n');
    }, 1000);

    res.on('close', () => {
        console.log('Client closed connection');
        clearInterval(intervalId);
        res.end();
    });
    // res.status(200).send("x");
});

app.listen(port, () => {
    console.log('Server is running');
});