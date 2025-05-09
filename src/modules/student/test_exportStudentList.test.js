const request = require('supertest');
const app = require('../../../app');  // Đường dẫn đến file app chính
const db = require('../../config/db');
const logger = require('../../config/logging');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

beforeAll(async () => {
    // Kiểm tra nếu cơ sở dữ liệu đã sẵn sàng
    const checkDbQuery = 'SELECT current_database();';
    const result = await db.query(checkDbQuery);
    if (result.rows[0].current_database != process.env.DB_NAME_TEST) {
        throw new Error('Not the testing database! Abort immediately');
    } else {
        // Tạo bảng students nếu chưa tồn tại
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS public.students (
                student_id VARCHAR(20) PRIMARY KEY,
                full_name VARCHAR(255),
                date_of_birth DATE,
                gender VARCHAR(10),
                faculty VARCHAR(255),
                academic_year VARCHAR(9),
                education_program VARCHAR(255),
                address TEXT,
                email VARCHAR(255),
                phone VARCHAR(15),
                student_status VARCHAR(255)
            );
        `;
        await db.query(createTableQuery);
    }
});

afterEach(async () => {
    // Truncate dữ liệu sau mỗi test
    await db.query(`
    DO $$ DECLARE
    r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
    END $$;
    `);
});

beforeEach(async () => {
    // Thêm sinh viên mẫu trước mỗi test
    const student_id = '22129937';
    const full_name = 'Nguyen Van Test';
    const date_of_birth = '2003-08-15';
    const gender = 'Nam';
    const academic_year = '2022-2026';
    const address = null;
    const email = 'anvt@gmail.com';
    const phone = '0782921212';
    const faculty = null;
    const education_program = null;
    const student_status = null;

    await db.query(`
        INSERT INTO public.students 
        (student_id, full_name, date_of_birth, gender, academic_year, address, email, phone, faculty, education_program, student_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [student_id, full_name, date_of_birth, gender, academic_year, address, email, phone, faculty, education_program, student_status]);
});

afterAll(async () => {
    // Đảm bảo rằng chúng ta đã dọn dẹp sau khi tất cả test đã chạy xong
    logger.info('Test done!');
});

describe('Export student data API', () => {

    it('should export the student list as an Excel file', async () => {
        const response = await request(app)
            .get('/export/excel')
            .buffer() // <- Bắt buộc để nhận binary
            .parse((res, callback) => {
                const data = [];
                res.on('data', chunk => data.push(chunk));
                res.on('end', () => callback(null, Buffer.concat(data)));
            })
            .expect('Content-Type', /application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet/)
            .expect('Content-Disposition', /attachment; filename=students.xlsx/)
            .expect(200);
    
        // Ghi file từ Buffer
        const filePath = path.join(__dirname, 'students.xlsx');
        fs.writeFileSync(filePath, response.body);
    
        expect(fs.existsSync(filePath)).toBe(true);
    
        // Cleanup
        fs.unlinkSync(filePath);
    });

    it('should export the student list as a CSV file', async () => {
        const response = await request(app)
            .get('/export/csv')
            .buffer()  // <- Bắt buộc để nhận binary
            .parse((res, callback) => {
                const data = [];
                res.on('data', chunk => data.push(chunk));
                res.on('end', () => callback(null, Buffer.concat(data)));
            })
            .expect('Content-Type', /text\/csv/)
            .expect('Content-Disposition', /attachment; filename=students.csv/)
            .expect(200); // Kiểm tra mã trạng thái 200 (OK)
    
        // Ghi file từ Buffer
        const filePath = path.join(__dirname, 'students.csv');
        fs.writeFileSync(filePath, response.body);
    
        // Kiểm tra file có tồn tại không
        expect(fs.existsSync(filePath)).toBe(true);
    
        // Cleanup sau khi kiểm tra
        fs.unlinkSync(filePath);
    });
    
    it('should return 404 if no students to export', async () => {
        await db.query('DELETE FROM students');

        const response = await request(app)
            .get('/export/csv')
            .expect(404);

        expect(response.text).toContain('Không có dữ liệu để xuất');
    });

    it('should return 404 if no students to export', async () => {
        await db.query('DELETE FROM students');

        const response = await request(app)
            .get('/export/excel')
            .expect(404);

        expect(response.text).toContain('Không có dữ liệu để xuất');
    });

});
