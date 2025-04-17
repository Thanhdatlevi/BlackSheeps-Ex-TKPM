// test for class modules 
const request = require('supertest');
const app = require('../../../app');  // Import the app
const db = require('../../config/db');
const logger = require('../../config/logging');
const { scheduler } = require('timers/promises');
const { exec } = require('child_process');
require('dotenv').config();

PORT = 3000;
const course = {
    course_id: 'cs101',
    course_name: 'test course',
    credit: '1',
    faculty: '1',
    description: 'test course description',
    status: '1',
    time_create: '2025-04-01 00:06:35.247564+00',
};
const faculty = {
    faculty_id: 1,
    faculty_name: 'test faculty',
};
const classroom = {
    class_id: '22CTT2',
    course_id: 'cs101',
    year: '2024-2025',
    semester: '1',
    lecturer: 'test',
    maximum: '10',
    schedule: 'test',
    room: 'test'
};
const year = {
    year: '2024-2025',
    semester: '1',
    registration_end: '2024-08-31',
}

const insert_query = `
        INSERT INTO faculties (faculty_id, faculty_name)
        VALUES ($1, $2)
        RETURNING *
        `;
const insert_query2 = `
    INSERT INTO course (course_id, course_name, credit, faculty, description, status, time_create)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
    `;
const insert_query3 = `
    INSERT INTO term (year, semester, registration_end)
    VALUES ($1, $2, $3)
    RETURNING *;
    `;
const select_query = `
    SELECT * FROM faculties WHERE faculty_id = $1;
    `;
const select_query2 = `
    SELECT * FROM course WHERE course_id = $1;
    `;
const query_find_class = `
    SELECT * FROM "class" WHERE class_id = $1;
    `;


beforeAll(async () => {
    // Set up the database before tests (create device table)
    check_db_query = `
    SELECT current_database();
    `;
    result = await db.query(check_db_query, []);
    if (result.rows[0].current_database != process.env.DB_NAME_TEST) {
        throw new Error('Not the testing database! abort immediately');
    }

    const clean_result = await db.query(`
    DO $$ DECLARE
    r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
    END $$;
    `).then(result => {
        return;
    });
    return;
});

afterEach(async () => {
    // Clean up the table between tests to ensure isolation
    const clean_result = await db.query(`
    DO $$ DECLARE
    r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
    END $$;
    `).then(result => {
        return;
    });
    return;
});

afterAll(async () => {
    logger.info('Test done!');
    return;
});


describe('add Class API', () => {
    // Constants
    it('This should add a class to the database', async () => {
        let insert_faculty = await db.query(insert_query, [
            faculty.faculty_id,
            faculty.faculty_name,
        ]);
        expect(insert_faculty.rowCount).toBe(1);
        let select_faculty = await db.query(select_query, [
            faculty.faculty_id,
        ]);
        expect(select_faculty.rows[0].faculty_id).toBe(faculty.faculty_id);

        const insert_course = await db.query(insert_query2, [
            course.course_id,
            course.course_name,
            course.credit,
            course.faculty,
            course.description,
            course.status,
            course.time_create,
        ]);
        expect(insert_course.rowCount).toBe(1);
        let select_course = await db.query(select_query2, [
            course.course_id,
        ]);
        expect(select_course.rows[0].course_id).toBe(course.course_id);


        let insert_year = await db.query(insert_query3, [
            year.year,
            year.semester,
            year.registration_end,
        ]);
        expect(insert_year.rowCount).toBe(1);

        let response = await request(app)
            .post('/class')
            .send(classroom)
            .expect(200);

        const find_class = await db.query(query_find_class, [classroom.class_id]);
        expect(find_class.rows[0].class_id).toBe(classroom.class_id);
        return;
    });
    it('This should return 409 error when class already existed', async () => {
        insert_faculty = await db.query(insert_query, [
            faculty.faculty_id,
            faculty.faculty_name,
        ]);
        select_faculty = await db.query(select_query, [
            faculty.faculty_id,
        ]);
        expect(select_faculty.rows[0].faculty_id).toBe(faculty.faculty_id);

        insert_course = await db.query(insert_query2, [
            course.course_id,
            course.course_name,
            course.credit,
            course.faculty,
            course.description,
            course.status,
            course.time_create,
        ]);
        expect(insert_course.rows[0].course_id).toBe('cs101');

        insert_year = await db.query(insert_query3, [
            year.year,
            year.semester,
            year.registration_end,
        ]);
        expect(insert_year.rowCount).toBe(1);

        let response = await request(app)
            .post('/class')
            .send(classroom)
            .expect(200);

        response = await request(app)
            .post('/class')
            .send(classroom)
            .expect(409);

        expect(response.body.message).toBe('Class with corresponding info already existed in Database');

        return;
    });
    it('This should return 409 error when course doesn\'t exist', async () => {
        insert_faculty = await db.query(insert_query, [
            faculty.faculty_id,
            faculty.faculty_name,
        ]);
        select_faculty = await db.query(select_query, [
            faculty.faculty_id,
        ]);
        expect(select_faculty.rows[0].faculty_id).toBe(faculty.faculty_id);

        // insert_course = await db.query(insert_query2, [
        //     course.course_id,
        //     course.course_name,
        //     course.credit,
        //     course.faculty,
        //     course.description,
        //     course.status,
        //     course.time_create,
        // ]);
        // expect(insert_course.rows[0].course_id).toBe('cs101');

        insert_year = await db.query(insert_query3, [
            year.year,
            year.semester,
            year.registration_end,
        ]);
        expect(insert_year.rowCount).toBe(1);

        response = await request(app)
            .post('/class')
            .send(classroom)
            .expect(409);

        expect(response.body.message).toBe('Course with id doesn\'t appear in Database');

        return;
    });
    it('This should return 409 error when year doesn\'t exist', async () => {
        insert_faculty = await db.query(insert_query, [
            faculty.faculty_id,
            faculty.faculty_name,
        ]);
        select_faculty = await db.query(select_query, [
            faculty.faculty_id,
        ]);
        expect(select_faculty.rows[0].faculty_id).toBe(faculty.faculty_id);

        insert_course = await db.query(insert_query2, [
            course.course_id,
            course.course_name,
            course.credit,
            course.faculty,
            course.description,
            course.status,
            course.time_create,
        ]);
        expect(insert_course.rows[0].course_id).toBe('cs101');

        //Year Term not found insert_year = await db.query(insert_query3, [
        //     year.year,
        //     year.semester,
        //     year.registration_end,
        // ]);
        // expect(insert_year.rowCount).toBe(1);

        response = await request(app)
            .post('/class')
            .send(classroom)
            .expect(409);

        expect(response.body.message).toBe('Year Term not found');

        return;
    });
});

describe('add Student to Class API', () => {
    // Constants
    it('This should add a student to the class', async () => {
        let insert_faculty = await db.query(insert_query, [
            faculty.faculty_id,
            faculty.faculty_name,
        ]);
        expect(insert_faculty.rowCount).toBe(1);
        let select_faculty = await db.query(select_query, [
            faculty.faculty_id,
        ]);
        expect(select_faculty.rows[0].faculty_id).toBe(faculty.faculty_id);

        const insert_course = await db.query(insert_query2, [
            course.course_id,
            course.course_name,
            course.credit,
            course.faculty,
            course.description,
            course.status,
            course.time_create,
        ]);
        expect(insert_course.rowCount).toBe(1);
        let select_course = await db.query(select_query2, [
            course.course_id,
        ]);
        expect(select_course.rows[0].course_id).toBe(course.course_id);


        let insert_year = await db.query(insert_query3, [
            year.year,
            year.semester,
            year.registration_end,
        ]);
        expect(insert_year.rowCount).toBe(1);

        let response = await request(app)
            .post('/class')
            .send(classroom)
            .expect(200);
    });
});



