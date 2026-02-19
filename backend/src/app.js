const express = require('express');
const { connectDB } = require('./utils/db');
const routes = require('./routes');

connectDB();

const app = express();
app.use(express.json());
app.use('/api', routes);

module.exports = app;
