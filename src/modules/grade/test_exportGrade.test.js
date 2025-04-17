const request = require('supertest');
const app = require('../../../app'); // Đường dẫn đến file app chính
const db = require('../../config/db');
const logger = require('../../config/logging');
const fs = require('fs');
const path = require('path');

beforeAll(async () => {
    const result = await db.query('SELECT current_database()');
    if (result.rows[0].current_database !== 'db_test') {
        throw new Error('Not the testing database! Abort immediately');
    }
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

beforeEach(async () => {
    // Thêm 2 môn học
    await db.query(`
        INSERT INTO public.course (course_id, course_name, credit, faculty, description, prerequisite, status, time_create)
        VALUES
        ('CS101', 'Introduction to CS', 4, null, 'Basic CS concepts', null, 'Active', CURRENT_TIMESTAMP),
        ('CS102', 'Data Structures', 4, null, 'Advanced DS concepts', null, 'Active', CURRENT_TIMESTAMP);
    `);

    // Thêm 2 lớp học phần tương ứng
    await db.query(`
        INSERT INTO public.term (year, semester, registration_end)
        VALUES
        ('2024-2025', 1, '"2024-08-31"');
    `);

    // Thêm 2 lớp học phần tương ứng
    await db.query(`
        INSERT INTO public.class (class_id, course_id, year, semester, lecturer, maximum, schedule, room)
        VALUES
        ('L01', 'CS101', '2024-2025', 1, 'Dr. A', 100, 'Mon-Wed', 'Room 101'),
        ('L02', 'CS102', '2024-2025', 1, 'Dr. B', 100, 'Tue-Thu', 'Room 102');
    `);

    // Thêm 2 sinh viên mẫu
    await db.query(`
        INSERT INTO public.students 
        (student_id, full_name, date_of_birth, gender, academic_year, address, email, phone, faculty, education_program, student_status)
        VALUES
        ('22129934', 'Nguyen Van Test', '2003-08-15', 'Nam', '2022-2026', null, 'anvt@gmail.com', '0782921212', null, null, null),
        ('22129935', 'Tran Thi A', '2003-09-20', 'Nữ', '2022-2026', null, 'tta@gmail.com', '0912345678', null, null, null);
    `);

    // Đăng ký học phần và có điểm
    await db.query(`
        INSERT INTO public.register_subject (student_id, class_id, course_id, year, semester, grade)
        VALUES
        ('22129934', 'L01', 'CS101', '2024-2025', 1, 8.5),
        ('22129934', 'L02', 'CS102', '2024-2025', 1, 9.0),
        ('22129935', 'L01', 'CS101', '2024-2025', 1, 7.0);
    `);
});

afterAll(async () => {
    logger.info('Test done!');
});

describe('Export student grades API', () => {

    it('should export grades as an Excel file for valid student_id', async () => {
        const response = await request(app)
            .get('/exportGrades?student_id=22129934')
            .buffer()
            .parse((res, callback) => {
                const data = [];
                res.on('data', chunk => data.push(chunk));
                res.on('end', () => callback(null, Buffer.concat(data)));
            })
            .expect('Content-Type', /application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet/)
            .expect('Content-Disposition', /attachment; filename=bang_diem_22129934.xlsx/)
            .expect(200);

        const filePath = path.join(__dirname, 'bang_diem_22129934.xlsx');
        fs.writeFileSync(filePath, response.body);
        expect(fs.existsSync(filePath)).toBe(true);
        fs.unlinkSync(filePath);
    });

    it('should return 400 if student_id is missing', async () => {
        const response = await request(app)
            .get('/exportGrades') // không truyền student_id
            .expect(400);

        expect(response.text).toContain('Thiếu mã số sinh viên');
    });

    it('should return 404 if student exists but has no grades', async () => {
        await db.query('DELETE FROM class');

        const response = await request(app)
            .get('/exportGrades?student_id=22129934')
            .expect(404);

        expect(response.text).toContain('Không tìm thấy dữ liệu điểm của sinh viên');
    });

    it('should return 404 if student does not exist', async () => {
        const response = await request(app)
            .get('/exportGrades?student_id=99999999') // không có sinh viên này
            .expect(404);

        expect(response.text).toContain('Không tìm thấy dữ liệu điểm của sinh viên');
    });

});
