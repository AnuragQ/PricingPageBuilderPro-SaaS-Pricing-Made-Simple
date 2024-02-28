const express = require('express');
const app = express();
const config = require('./src/config/config.js');
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(config.port, () => {
    console.log('Server is running on port 3000');
});