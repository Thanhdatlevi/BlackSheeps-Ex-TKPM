const request = require('supertest');
const app = require('../../../app');  // Đường dẫn đến file app chính
const db = require('../../config/db');
const logger = require('../../config/logging');

PORT = 3001;
let server;
require('dotenv').config();

beforeAll(async () => {
    // Kiểm tra DB đúng là db_test chưa
    const check_db_query = `SELECT current_database();`;
    const result = await db.query(check_db_query, []);
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

        // Thêm sinh viên mẫu trước
        const student_id='22129938';
        const full_name= 'Nguyen Van Test';
        const date_of_birth='2003-08-15'; 
        const gender= 'Nam';
        const academic_year='2022-2026';
        const address=null;
        const email='anvt@gmail.com';
        const phone='0782921212'; 
        const faculty=null;
        const education_program=null;
        const student_status=null;

        await db.query(`
            INSERT INTO public.students (student_id, full_name, date_of_birth, gender, academic_year, address, email, phone, faculty, education_program, student_status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [student_id, full_name, date_of_birth, gender, academic_year, address, email, phone, faculty, education_program, student_status]);
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

afterAll(async () => {
    logger.info('Test done!');
});

describe('delete student API', () => {
    it('should delete a student successfully', async () => {
        // Gửi request xóa
        const response = await request(app)
            .delete('/delete-student')
            .send({ mssv: '22129938' })
            .expect(200);

        // Kiểm tra phản hồi
        expect(response.body.message).toBe("Xóa thành công!");
        expect(response.body.deletedStudent.student_id).toBe('22129938');
    });

    it('should return 404 if student does not exist', async () => {
        const response = await request(app)
            .delete('/delete-student')
            .send({ mssv:'99999999' })
            .expect(404);

        expect(response.body.message).toBe("Mã số sinh viên không tồn tại!");
    });
});
