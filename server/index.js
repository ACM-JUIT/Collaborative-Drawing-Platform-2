// imports
const express = require('express');

const app = express();
const port = 3500;

app.use('/', require('./routes/main'));

app.listen(port, () => {
    console.log(`App listening on post ${port}`);
});
