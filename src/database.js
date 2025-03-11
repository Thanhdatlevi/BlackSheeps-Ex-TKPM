const sqlite3 = require('sqlite3').verbose();

// Create a new SQLite database or open an existing one
const db = new sqlite3.Database('./studentDB.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create a table if it doesn't exist
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS sinhvien (
        mssv INTEGER PRIMARY KEY,
        hoten CHAR(255) NOT NULL,
        ngaysinh DATETIME NOT NULL, 
        gioitinh CHAR(5) NOT NULL CHECK (gioitinh IN ('Nam', 'Nu')),
        khoaCN CHAR(255) NOT NULL CHECK (khoaCN IN ('Khoa Luật', 'Khoa Tiếng Anh thương mại', 'Khoa Tiếng Nhật', 'Khoa Tiếng Pháp')),
        namkhoa INT NOT NULL,
        chuongtrinh CHAR(255) NOT NULL,
        diachi CHAR(255) NOT NULL,
        email CHAR(255) NOT NULL UNIQUE,
        sdt CHAR(255) NOT NULL UNIQUE,
        tinhtrang char(255) NOT NULL CHECK (tinhtrang IN ('Đang học', 'Đã tốt nghiệp', 'Đã thôi học', 'Tạm dừng học'))
    )
  `);
});

module.exports = db;

