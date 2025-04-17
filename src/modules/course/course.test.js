const request = require('supertest');
const app = require('../../../app');  // Import the app
const db = require('../../config/db');
const logger = require('../../config/logging');
require('dotenv').config();

// Test data
const course = {
    courseCode: 'CS501',
    courseName: 'Advanced Algorithms',
    credits: 4,
    faculty: 1,
    description: 'Advanced algorithm design and analysis',
    prerequisite: null,
    time_create: '2025-04-17 15:30:45.123+07:00'
};

const faculty = {
    faculty_id: 1,
    faculty_name: 'Computer Science'
};

// Database queries
const insert_faculty_query = `
    INSERT INTO faculties (faculty_id, faculty_name)
    VALUES ($1, $2)
    RETURNING *
`;

const find_course_query = `
    SELECT * FROM course WHERE course_id = $1
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
    logger.info('Course tests done!');
    return;
});

describe('add Course API', () => {
    // Test 1: Successfully adding a course
    it('should successfully add a course to the database', async () => {
        // Setup: Insert faculty first
        const insert_faculty = await db.query(insert_faculty_query, [
            faculty.faculty_id,
            faculty.faculty_name
        ]);
        expect(insert_faculty.rowCount).toBe(1);

        // Test: Add course
        const response = await request(app)
            .post('/addCourse')
            .send(course)
            .expect(201);

        // Verify response
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Add course successfully");
        expect(response.body.course.course_id).toBe(course.courseCode);
        expect(response.body.course.course_name).toBe(course.courseName);
        
        // Verify database
        const find_course = await db.query(find_course_query, [course.courseCode]);
        expect(find_course.rows[0].course_id).toBe(course.courseCode);
        expect(find_course.rows[0].course_name).toBe(course.courseName);
        expect(find_course.rows[0].credit).toBe(course.credits);
        expect(find_course.rows[0].status).toBe('Active');
        
        return;
    });
    // Test 2: Attempting to add a course with a duplicate ID
    it('should return error when adding a course with duplicate ID', async () => {
        // Setup: Insert faculty and the first course
        await db.query(insert_faculty_query, [
            faculty.faculty_id,
            faculty.faculty_name
        ]);

        // Add the first course
        await request(app)
            .post('/addCourse')
            .send(course)
            .expect(201);

        // Test: Try to add another course with the same ID
        const duplicateCourse = {
            ...course,
            courseName: 'Different Name But Same ID'
        };

        const response = await request(app)
            .post('/addCourse')
            .send(duplicateCourse)
            .expect(500); // Expecting error status

        // The exact error message may depend on your implementation
        expect(response.body.message).toBeTruthy();
        
        return;
    });
    // Test 3: Attempting to add a course with missing required fields
    it('should return error when required fields are missing', async () => {
        // Setup: Insert faculty
        await db.query(insert_faculty_query, [
            faculty.faculty_id,
            faculty.faculty_name
        ]);

        // Test: Missing courseName
        const invalidCourse = {
            courseCode: 'CS502',
            credits: 3,
            faculty: 1,
            description: 'Missing course name test',
            prerequisite: null,
            time_create: '2025-04-17 15:30:45.123+07:00'
        };

        const response = await request(app)
            .post('/addCourse')
            .send(invalidCourse)
            .expect(500); // Expecting error status

        expect(response.body.message).toBeTruthy();
        
        return;
    });
    // Test 4: Adding a course with a very long name
    it('should handle courses with very long names correctly', async () => {
        // Setup: Insert faculty first
        await db.query(insert_faculty_query, [
            faculty.faculty_id,
            faculty.faculty_name
        ]);

        // Create a very long course name (300 characters)
        const veryLongName = 'A'.repeat(300);
        
        // Test: Add course with very long name
        const courseWithLongName = {
            ...course,
            courseCode: 'CS504',
            courseName: veryLongName
        };

        const response = await request(app)
            .post('/addCourse')
            .send(courseWithLongName)
            .expect(function(res) {
                // We're not sure if the system should accept or reject this,
                // so we check both cases
                if (res.status !== 201 && res.status !== 500) {
                    throw new Error('Expected either 201 (success) or 500 (error)');
                }
            });

        if (response.status === 201) {
            // If system accepted the long name, verify it was stored correctly
            expect(response.body.success).toBe(true);
            expect(response.body.course.course_id).toBe(courseWithLongName.courseCode);
            
            // Check in database
            const find_course = await db.query(find_course_query, [courseWithLongName.courseCode]);
            expect(find_course.rows[0].course_id).toBe(courseWithLongName.courseCode);
            
            // Check if the name was truncated or stored fully
            const storedName = find_course.rows[0].course_name;
            console.log(`Original length: ${veryLongName.length}, Stored length: ${storedName.length}`);
            
            if (storedName.length < veryLongName.length) {
                console.log('Note: Course name was truncated in the database');
            }
        } else {
            // If system rejected the long name, verify error handling
            expect(response.body.message).toBeTruthy();
            
            // Verify course wasn't added
            const find_course = await db.query(find_course_query, [courseWithLongName.courseCode]);
            expect(find_course.rows.length).toBe(0);
            
            console.log('System rejected the very long course name, as expected');
        }
        
        return;
    });

    
    
});
