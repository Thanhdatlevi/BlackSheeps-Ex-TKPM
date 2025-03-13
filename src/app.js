const express = require('express');
const app = express();
const studentRoutes = require('./routes/studentRoutes');

// ...existing code...

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/students', studentRoutes);

// ...existing code...