const express = require('express');
const app = express();

app.listen(5001, function() { console.log("Listening to port 5001"); });

app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});
