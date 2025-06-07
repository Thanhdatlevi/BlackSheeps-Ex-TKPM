const request = require('supertest');
const app = require('../../../app');
const db = require('../../config/db');
const logger = require('../../config/logging');
const { add } = require('winston');
require('dotenv').config();
jest.setTimeout(30000); 
// Test data
const address = {
    street: '123 Đường Nguyễn Văn Cừ',
    ward: 'Phường 4',
    district: 'Quận 5',
    city: 'TP.HCM'
};
const student = {
    mssv: 'SV22001',
    name: 'Nguyễn Văn A',
    dob: '2004-01-15',
    gender: 'Nam',
    faculty: 1,
    course: '2022-2026',
    program: 1,
    status: 1,
    address: address,
    email: 'nguyenvana@example.com',
    phone: '0901234567'
};

const faculty = {
    faculty_id: 1,
    faculty_name: 'Công nghệ thông tin'
};

const program = {
    program_id: 1,
    program_name: 'Chương trình chuẩn'
};

const status = {
    status_id: 1,
    status_name: 'Đang học'
};

// Database queries
const insert_faculty_query = `
    INSERT INTO faculties (faculty_id, faculty_name)
    VALUES ($1, $2)
    RETURNING *
`;

const insert_program_query = `
    INSERT INTO education_programs (program_id, program_name)
    VALUES ($1, $2)
    RETURNING *
`;

const insert_status_query = `
    INSERT INTO student_status (status_id, status_name)
    VALUES ($1, $2)
    RETURNING *
`;

const find_student_query = `
    SELECT * FROM students WHERE student_id = $1
`;

beforeAll(async () => {
    // Set up the database before tests
    check_db_query = `
    SELECT current_database();
    `;
    result = await db.query(check_db_query, []);
    if (result.rows[0].current_database != process.env.DB_NAME_TEST) {
        throw new Error('Not the testing database! abort immediately');
    }

    await db.query(`
    DO $$ DECLARE
    r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
    END $$;
    `);
    return;
});

afterEach(async () => {
    // Clean up the table between tests to ensure isolation
    await db.query(`
    DO $$ DECLARE
    r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
    END $$;
    `);
    return;
});

afterAll(async () => {
    logger.info('Student tests done!');
    return;
});

describe('add API', () => {
    // Test 1: Successfully adding a student
    it('should successfully add a student to the database', async () => {
        // Setup: Insert prerequisite data first
        await db.query(insert_faculty_query, [
            faculty.faculty_id,
            faculty.faculty_name
        ]);
        
        await db.query(insert_program_query, [
            program.program_id,
            program.program_name
        ]);
        
        await db.query(insert_status_query, [
            status.status_id,
            status.status_name
        ]);

        // Test: Add student
        const response = await request(app)
            .post('/add')
            .send(student)
            .expect(201);

        // Verify response
        expect(response.body.message).toBe("Student added successfully");
        expect(response.body.student.student_id).toBe(student.mssv);
        
        // Verify database
        const find_student = await db.query(find_student_query, [student.mssv]);
        expect(find_student.rows[0].student_id).toBe(student.mssv);
        expect(find_student.rows[0].full_name).toBe(student.name);
        expect(find_student.rows[0].email).toBe(student.email);
        expect(find_student.rows[0].phone).toBe(student.phone);
        
        return;
    });

    // Test 2: Attempting to add a student with a duplicate ID
    it('should return error when adding a student with duplicate ID', async () => {
        // Setup: Insert prerequisite data
        await db.query(insert_faculty_query, [
            faculty.faculty_id,
            faculty.faculty_name
        ]);
        
        await db.query(insert_program_query, [
            program.program_id,
            program.program_name
        ]);
        
        await db.query(insert_status_query, [
            status.status_id,
            status.status_name
        ]);

        // Add the first student
        await request(app)
            .post('/add')
            .send(student)
            .expect(201);

        // Test: Try to add another student with the same ID
        const duplicateStudent = {
            ...student,
            name: 'Nguyễn Văn B',
            email: 'nguyenvanb@example.com',
            phone: '0912345678'
        };

        const response = await request(app)
            .post('/add')
            .send(duplicateStudent)
            .expect(400);

        // Verify error message
        expect(response.body.message).toBe("Student ID already exists. Please use a different ID.");
        
        return;
    });

    // Test 3: Handling special characters in student information
    it('should handle special characters in student information correctly', async () => {
        // Setup: Insert prerequisite data
        await db.query(insert_faculty_query, [
            faculty.faculty_id,
            faculty.faculty_name
        ]);
        
        await db.query(insert_program_query, [
            program.program_id,
            program.program_name
        ]);
        
        await db.query(insert_status_query, [
            status.status_id,
            status.status_name
        ]);

        // Test: Student with special characters
        const specialCharStudent = {
            mssv: 'SV22003',
            name: 'Nguyễn Văn "Quote" Cường',
            dob: '2004-03-21',
            gender: 'Nam',
            faculty: 1,
            course: '2022-2026',
            program: 1,
            status: 1,
            email: 'special.chars+test@example.com',
            phone: '0987654321'
        };

        const response = await request(app)
            .post('/add')
            .send(specialCharStudent)
            .expect(201);

        // Verify response
        expect(response.body.message).toBe("Student added successfully");
        
        // Verify database - special characters should be stored correctly
        const find_student = await db.query(find_student_query, [specialCharStudent.mssv]);
        expect(find_student.rows[0].full_name).toBe(specialCharStudent.name);
        
        // Verify that the special characters are stored correctly
        expect(find_student.rows[0].email).toBe(specialCharStudent.email);
        
        return;
    });

    // Test 4: Test with invalid faculty, program or status IDs
    it('should handle invalid reference IDs correctly', async () => {
        // Setup: Insert faculty only
        await db.query(insert_faculty_query, [
            faculty.faculty_id,
            faculty.faculty_name
        ]);
        
        // Test: Non-existent program and status IDs
        const invalidRefsStudent = {
            ...student,
            program: 999,  // Non-existent program ID
            status: 999    // Non-existent status ID
        };

        const response = await request(app)
            .post('/add')
            .send(invalidRefsStudent)
            .expect(500); // Assuming you return 500 for foreign key violations

        // Verify error message
        expect(response.body.message).toContain("Failed to add student");
        
        // Verify student wasn't added
        const find_student = await db.query(find_student_query, [invalidRefsStudent.mssv]);
        expect(find_student.rows.length).toBe(0);
        
        return;
    });
});