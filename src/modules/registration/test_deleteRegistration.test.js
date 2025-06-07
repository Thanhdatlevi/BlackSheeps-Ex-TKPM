const request = require('supertest');
const app = require('../../../app');
const db = require('../../config/db');
const logger = require('../../config/logging');
require('dotenv').config();
jest.setTimeout(30000); 
beforeAll(async () => {
    const result = await db.query('SELECT current_database()');
    if (result.rows[0].current_database != process.env.DB_NAME_TEST) {
        throw new Error('Not the testing database! Abort immediately');
    }
});

beforeEach(async () => {
    // Thêm 2 môn học
    await db.query(`
        INSERT INTO public.course (course_id, course_name, credit, faculty, description, prerequisite, status, time_create)
        VALUES
        ('CS103', 'Introduction to CS', 4, null, 'Basic CS concepts', null, 'Active', CURRENT_TIMESTAMP);
    `);

    // Thêm học kỳ
    await db.query(`
        INSERT INTO public.term (year, semester, registration_end)
        VALUES
        ('2024-2025', 2, '2024-05-31');
    `);

    // Thêm lớp học phần
    await db.query(`
        INSERT INTO public.class (class_id, course_id, year, semester, lecturer, maximum, schedule, room)
        VALUES
        ('L01', 'CS103', '2024-2025', 2, 'Dr. A', 100, 'Mon-Wed', 'Room 101');
    `);

    // Thêm sinh viên
    await db.query(`
        INSERT INTO public.students 
        (student_id, full_name, date_of_birth, gender, academic_year, address, email, phone, faculty, education_program, student_status)
        VALUES
        ('22129936', 'Nguyen Van Test', '2003-08-15', 'Nam', '2022-2026', null, 'anvt@gmail.com', '0782921212', null, null, null);
    `);

    // Chỉ thêm 1 đăng ký cần test
    await db.query(`
        INSERT INTO public.register_subject (student_id, class_id, course_id, year, semester, grade)
        VALUES
        ('22129936', 'L01', 'CS103', '2024-2025', 2, 8.5);
    `);
});

afterEach(async () => {
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

describe('DELETE /registration/deleteRegistration', () => {
    it('should delete registration successfully', async () => {
        const response = await request(app)
            .delete('/registration/deleteRegistration')
            .send({
                student_id: '22129936',
                class_id: 'L01',
                course_id: 'CS103',
                year: '2024-2025',
                semester: 2
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('Xóa đăng ký thành công.');
    });
    it('should return 500 if registration does not exist', async () => {
        const response = await request(app)
            .delete('/registration/deleteRegistration')
            .send({
                student_id: '00000000', // Không tồn tại trong DB
                class_id: 'XXX',
                course_id: 'XXX',
                year: '2024-2025',
                semester: 1
            });
    
        // Kiểm tra mã lỗi và thông báo
        expect(response.statusCode).toBe(500);
        expect(response.body.message).toContain('Failed');
    });
    
    it('should return 500 if missing required fields', async () => {
        const response = await request(app)
            .delete('/registration/deleteRegistration')
            .send({}); // Thiếu thông tin
    
        // Kiểm tra mã lỗi và thông báo
        expect(response.statusCode).toBe(500);
        expect(response.body.message).toContain('Failed');
    });
});
