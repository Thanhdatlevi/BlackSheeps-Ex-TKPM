const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const fileUpload = require("express-fileupload");

const app = express();
const PORT = 3000;

const Handlebars = require('handlebars');

// Cấu hình express-fileupload
app.use(fileUpload());

// const uploadRoutes = require('./src/routes/uploadRoutes');
const studentRoutes = require('./src/routes/studentRoutes'); // Điều hướng view
const facultyRoutes = require('./src/routes/facultyRoutes');
const programRoutes = require('./src/routes/programRoutes');
const statusRoutes = require('./src/routes/statusRoutes');
const emailRoutes = require('./src/routes/emailDomainRoutes');
const registrationRoutes = require('./src/routes/registerSubjectRoutes');
const gradeRoutes = require('./src/routes/gradeRoutes');
const classRoutes = require('./src/routes/classRoutes');
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
app.use('/', emailRoutes);
app.use('/', classRoutes);
app.use('/registration', registrationRoutes);
app.use('/', gradeRoutes);
app.use('/', classRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
