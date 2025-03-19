const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const PORT = 3000;

const Handlebars = require('handlebars');

// const uploadRoutes = require('./src/routes/uploadRoutes');
const studentRoutes = require('./src/routes/studentRoutes'); // Điều hướng view
const facultyRoutes = require('./src/routes/facultyRoutes');
const programRoutes = require('./src/routes/programRoutes');
const statusRoutes = require('./src/routes/statusRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.raw({ type: 'image/*', limit: '5mb' }));

//Handlebars
app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main' // Layout chính
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src', 'views'))

app.use(express.static(path.join(__dirname, 'src', 'public')));

app.use('/', studentRoutes);
app.use('/', facultyRoutes);
app.use('/', programRoutes);
app.use('/', statusRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});