const express = require('express');
const path = require('path');

const indexRoute = require('~routes/index');
const formRoute = require('~routes/form');
const { port } = require('~root/config');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './server/views'));

app.use('/static', express.static(path.join(__dirname, './assets')));

app.use('/', indexRoute);
app.use('/form', formRoute);


app.listen(port);
