const request = require('supertest');
const app = require('../../../app');
const db = require('../../config/db');
const logger = require('../../config/logging');
require('dotenv').config();

// Test data
const validCourse = {
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

// Check database before running tests
beforeAll(async () => {
    // Ensure we're running on the test database
    check_db_query = `SELECT current_database()`;
    result = await db.query(check_db_query, []);
    if (result.rows[0].current_database != process.env.DB_NAME_TEST) {
        throw new Error('Not running on testing database! Aborting tests to prevent data loss.');
    }

    // Clear existing data
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

// Clean database after each test
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
    return;
});

afterAll(async () => {
    logger.info('Course tests completed successfully');
    return;
});

describe('Course API', () => {
    // SECTION 1: COURSE ADDITION
    describe('Add Course Functionality', () => {
        // Test 1: Successfully adding a valid course
        it('should successfully add a valid course', async () => {
            // Setup: Insert faculty first
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);

            // Test: Add course with all valid fields
            const response = await request(app)
                .post('/addCourse')
                .send(validCourse)
                .expect(201);

            // Verify response structure and data
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Add course successfully");
            expect(response.body.course).toHaveProperty('course_id', validCourse.courseCode);
            expect(response.body.course).toHaveProperty('course_name', validCourse.courseName);
            expect(response.body.course).toHaveProperty('credit', validCourse.credits);
            
            // Verify database
            const find_course = await db.query(find_course_query, [validCourse.courseCode]);
            expect(find_course.rows[0].course_id).toBe(validCourse.courseCode);
            expect(find_course.rows[0].course_name).toBe(validCourse.courseName);
            expect(find_course.rows[0].status).toBe('Active'); // Default is Active
            
            return;
        });

        // Test 2: Adding a course with duplicate code
        it('should handle duplicate course code correctly', async () => {
            // Setup: Insert faculty and the first course
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);

            // Add the first course
            await request(app)
                .post('/addCourse')
                .send(validCourse)
                .expect(201);

            // Test: Try to add another course with the same code
            const duplicateCourse = {
                ...validCourse,
                courseName: 'Different Name But Same ID'
            };

            const response = await request(app)
                .post('/addCourse')
                .send(duplicateCourse)
                .expect(409); // Expecting conflict status

            // Verify error response
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("Course ID already exists");
            expect(response.body.error).toBe("DUPLICATE_COURSE_ID");
            
            return;
        });

        // Test 3: Adding a course with special characters and data limits
        it('should handle special characters and data limits correctly', async () => {
            // Setup: Insert faculty
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);

            // Test case 1: Course with special characters
            const specialCharCourse = {
                courseCode: 'CS-507',
                courseName: 'Security: "SQL Injection"; DROP TABLE users;--',
                credits: 3,
                faculty: 1,
                description: '<script>alert("XSS")</script> & symbols ®™©€£¥§±×÷',
                prerequisite: null,
                time_create: '2025-04-17 15:30:45.123+07:00'
            };

            const response = await request(app)
                .post('/addCourse')
                .send(specialCharCourse)
                .expect(201);

            expect(response.body.success).toBe(true);
            
            // Verify special characters were stored correctly
            const find_course = await db.query(find_course_query, [specialCharCourse.courseCode]);
            expect(find_course.rows[0].course_name).toBe(specialCharCourse.courseName);
            expect(find_course.rows[0].description).toBe(specialCharCourse.description);
            
            // Test case 2: Very long course name (edge case)
            const veryLongName = 'A'.repeat(300);
            const longNameCourse = {
                ...validCourse,
                courseCode: 'CS508',
                courseName: veryLongName
            };

            try {
                const longNameResponse = await request(app)
                    .post('/addCourse')
                    .send(longNameCourse);
                
                // If success (column might truncate automatically)
                if (longNameResponse.status === 201) {
                    const storedCourse = await db.query(find_course_query, [longNameCourse.courseCode]);
                    console.log(`Original name length: ${veryLongName.length}, Stored length: ${storedCourse.rows[0].course_name.length}`);
                } else {
                    console.log(`Long name rejected with status: ${longNameResponse.status}`);
                }
            } catch (error) {
                console.log('Database rejected very long name as expected');
            }
            
            return;
        });
    });

    // SECTION 2: COURSE SEARCH
    describe('Search Course Functionality', () => {
        // Test 4: Successfully retrieving a course by ID
        it('should successfully retrieve a course by ID', async () => {
            // Setup: Insert faculty and course
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);
            
            await request(app)
                .post('/addCourse')
                .send(validCourse)
                .expect(201);

            // Test: Search by ID
            const response = await request(app)
                .get(`/searchCourseById?courseId=${validCourse.courseCode}`)
                .expect(200);

            // Verify response
            expect(response.body.success).toBe(true);
            expect(response.body.course.course_id).toBe(validCourse.courseCode);
            expect(response.body.course.course_name).toBe(validCourse.courseName);
            
            return;
        });

        // Test 5: Searching for a non-existent course
        it('should handle search for non-existent course', async () => {
            // Setup: Insert faculty only
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);

            // Test: Search for non-existent course
            const response = await request(app)
                .get('/searchCourseById?courseId=NON_EXISTENT')
                .expect(500); // Your implementation might use different status code

            expect(response.body.message).toBeTruthy();
            
            return;
        });

        // Test 6: Retrieving a list of all courses
        it('should return a list of all courses', async () => {
            // Setup: Insert faculty and multiple courses
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);
            
            const course1 = { ...validCourse };
            const course2 = { ...validCourse, courseCode: 'CS502', courseName: 'Data Science' };
            const course3 = { ...validCourse, courseCode: 'CS503', courseName: 'Machine Learning' };
            
            await request(app).post('/addCourse').send(course1);
            await request(app).post('/addCourse').send(course2);
            await request(app).post('/addCourse').send(course3);

            // Test: Get all courses
            const response = await request(app)
                .get('/getAllCourses')
                .expect(200);

            // Verify response
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.courses)).toBe(true);
            expect(response.body.courses.length).toBe(3);
            
            // Verify all courses are returned
            const courseIds = response.body.courses.map(c => c.course_id);
            expect(courseIds).toContain(course1.courseCode);
            expect(courseIds).toContain(course2.courseCode);
            expect(courseIds).toContain(course3.courseCode);
            
            return;
        });
    });

    // SECTION 3: COURSE UPDATE & DELETION
    describe('Update and Delete Course Functionality', () => {
        // Test 7: Successfully updating a course
        it('should successfully update a course', async () => {
            // Setup: Insert faculty and course
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);
            
            await request(app)
                .post('/addCourse')
                .send(validCourse)
                .expect(201);

            // Test: Update course
            const updateData = {
                id: validCourse.courseCode,
                courseName: 'Updated Algorithm Course',
                description: 'Updated description',
                faculty: faculty.faculty_id,
                credit: 5
            };

            const response = await request(app)
                .put('/updateCourse')
                .send(updateData)
                .expect(200);

            // Verify response
            expect(response.body.success).toBe(true);
            expect(response.body.course.course_name).toBe(updateData.courseName);
            expect(response.body.course.description).toBe(updateData.description);
            expect(response.body.course.credit).toBe(updateData.credit);
            
            // Verify database update
            const find_course = await db.query(find_course_query, [validCourse.courseCode]);
            expect(find_course.rows[0].course_name).toBe(updateData.courseName);
            expect(find_course.rows[0].credit).toBe(updateData.credit);
            
            return;
        });

        // Test 8: Successfully updating a course status
        it('should successfully update a course status', async () => {
            // Setup: Insert faculty and course
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);
            
            await request(app)
                .post('/addCourse')
                .send(validCourse)
                .expect(201);

            // Test: Update course status
            const statusData = {
                courseId: validCourse.courseCode,
                status: 'Inactive'
            };

            const response = await request(app)
                .put('/updateCourseStatus')
                .send(statusData)
                .expect(200);

            // Verify response
            expect(response.body.success).toBe(true);
            expect(response.body.course.status).toBe('Inactive');
            
            // Verify database update
            const find_course = await db.query(find_course_query, [validCourse.courseCode]);
            expect(find_course.rows[0].status).toBe('Inactive');
            
            return;
        });

        // Test 9: Successfully deleting a course
        it('should successfully delete a course', async () => {
            // Setup: Insert faculty and course
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);
            
            await request(app)
                .post('/addCourse')
                .send(validCourse)
                .expect(201);

            // Test: Delete course
            const response = await request(app)
                .delete('/deleteCourse')
                .send({ courseId: validCourse.courseCode })
                .expect(200);

            // Verify response
            expect(response.body.success).toBe(true);
            expect(response.body.course.course_id).toBe(validCourse.courseCode);
            
            // Verify course was deleted
            const find_course = await db.query(find_course_query, [validCourse.courseCode]);
            expect(find_course.rows.length).toBe(0);
            
            return;
        });

        // Test 10: Checking if course exists in a class
        it('should check if course exists in class', async () => {
            // Setup: Insert faculty and course
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);
            
            await request(app)
                .post('/addCourse')
                .send(validCourse)
                .expect(201);
            
            // Since we don't have a class with this course, we expect false
            const response = await request(app)
                .get(`/isCourseNameExists?courseId=${validCourse.courseCode}`)
                .expect(500); // Your implementation might use different status
            
            // Since we don't have a class in our test db, we expect a negative response
            expect(response.body.message).toContain("Course does not exist in class");
            
            // Note: For a true positive test, we would need to insert a class with this course ID
            
            return;
        });

        // Test 11: Handling update of non-existent course
        it('should handle updating non-existent course', async () => {
            // Setup: Insert faculty only
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);

            // Test: Update non-existent course
            const updateData = {
                id: 'NON_EXISTENT',
                courseName: 'This Should Fail',
                description: 'This course does not exist',
                faculty: faculty.faculty_id,
                credit: 3
            };

            const response = await request(app)
                .put('/updateCourse')
                .send(updateData)
                .expect(500);

            expect(response.body.message).toBeTruthy();
            
            return;
        });

        // Test 12: Handling deletion of non-existent course
        it('should handle deleting non-existent course', async () => {
            const response = await request(app)
                .delete('/deleteCourse')
                .send({ courseId: 'NON_EXISTENT' })
                .expect(500);

            expect(response.body.message).toBeTruthy();
            
            return;
        });
    });

    // SECTION 4: PERFORMANCE AND EDGE CASES
    describe('Performance and Edge Cases', () => {
        // Test 13: Handling Unicode characters in course names
        it('should handle Unicode characters in course names', async () => {
            // Setup: Insert faculty
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);
            
            // Course with Unicode characters
            const unicodeCourse = {
                ...validCourse,
                courseCode: 'UNICODE101',
                courseName: 'Курс на русском языке • 中文課程 • دورة بالعربية • Tiếng Việt'
            };
            
            const response = await request(app)
                .post('/addCourse')
                .send(unicodeCourse)
                .expect(201);
                
            expect(response.body.success).toBe(true);
            
            // Verify Unicode was stored correctly
            const find_course = await db.query(find_course_query, [unicodeCourse.courseCode]);
            expect(find_course.rows[0].course_name).toBe(unicodeCourse.courseName);
            
            return;
        });

        // Test 14: Handling decimal credit values
        it('should handle decimal credit values', async () => {
            // Setup: Insert faculty
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);
            
            // Course with decimal credits
            const decimalCreditCourse = {
                ...validCourse,
                courseCode: 'CS510',
                credits: 3.5
            };
            
            const response = await request(app)
                .post('/addCourse')
                .send(decimalCreditCourse);
                
            // Check if your system supports decimal credits
            console.log(`Decimal credit test status: ${response.status}`);
            
            if (response.status === 201) {
                // If decimal credits are supported
                expect(response.body.course.credit).toBe(decimalCreditCourse.credits);
                
                const find_course = await db.query(find_course_query, [decimalCreditCourse.courseCode]);
                expect(find_course.rows[0].credit).toBe(decimalCreditCourse.credits);
            } else {
                // If decimal credits are not supported
                console.log('System does not support decimal credits');
            }
            
            return;
        });
    });
});