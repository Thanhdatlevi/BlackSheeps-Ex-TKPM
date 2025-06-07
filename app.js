const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const fileUpload = require("express-fileupload");
const i18n = require('i18n');
const app = express();

i18n.configure({
    locales: ['en', 'vi'],
    directory: path.join(__dirname, 'lang'),
    defaultLocale: 'vi',
    cookie: 'lang',
    queryParameter: 'lang',
    autoReload: true,
    updateFiles: false,
    objectNotation: true,
  });

const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(i18n.init);

app.use((req, res, next) => {
    if (req.query.lang) {
        // Lưu ngôn ngữ vào cookie
        res.cookie('lang', req.query.lang, { maxAge: 900000, httpOnly: true });
        req.setLocale(req.query.lang);  // Thay đổi ngôn ngữ ngay lập tức
    } else if (req.cookies.lang) {
        // Nếu không có query lang, nhưng đã có cookie thì sử dụng cookie đó
        req.setLocale(req.cookies.lang);
    } else {
        // Nếu không có cả query lang lẫn cookie, dùng ngôn ngữ mặc định
        req.setLocale(i18n.getLocale());
    }
    next();
});

const PORT = 3000;

const Handlebars = require('handlebars');

// Cấu hình express-fileupload
app.use(fileUpload());

//Handlebars
app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        __: function () { return i18n.__.apply(this, arguments); },
        __n: function () { return i18n.__n.apply(this, arguments); }
    }
}));

// const uploadRoutes = require('./src/routes/uploadRoutes');
const studentRoutes = require('./src/routes/studentRoutes'); // Điều hướng view
const facultyRoutes = require('./src/routes/facultyRoutes');
const programRoutes = require('./src/routes/programRoutes');
const statusRoutes = require('./src/routes/statusRoutes');
const emailRoutes = require('./src/routes/emailDomainRoutes');
const registrationRoutes = require('./src/routes/registerSubjectRoutes');
const gradeRoutes = require('./src/routes/gradeRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const classRoutes = require('./src/routes/classRoutes');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.raw({ type: 'image/*', limit: '5mb' }));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src', 'views'))

app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use('/lang', express.static(path.join(__dirname, 'lang')));

app.use('/', studentRoutes);
app.use('/faculty', facultyRoutes);
app.use('/program', programRoutes);
app.use('/status', statusRoutes);
app.use('/email', emailRoutes);
app.use('/registration', registrationRoutes);
app.use('/grade', gradeRoutes);
app.use('/course', courseRoutes);
app.use('/class', classRoutes);

function areWeTestingWithJest() {
    return process.env.JEST_WORKER_ID !== undefined;
}
if (!areWeTestingWithJest()) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
