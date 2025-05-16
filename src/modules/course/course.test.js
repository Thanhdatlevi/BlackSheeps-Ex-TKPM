const request = require('supertest');
const app = require('../../../app');
const db = require('../../config/db');
const logger = require('../../config/logging');
require('dotenv').config();

// Tăng timeout cho tất cả các test
jest.setTimeout(30000);

// Test data - Cập nhật để phù hợp với model mới
const validCourse = {
    courseCode: 'CS501',
    courseName: 'Advanced Algorithms',
    courseNameEn: 'Advanced Algorithms', // Thêm trường bắt buộc
    credits: 4,
    faculty: 1,
    description: 'Thuật toán nâng cao',
    descriptionEn: 'Advanced algorithm design and analysis', // Thêm trường bắt buộc
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

// Kiểm tra cấu trúc database
async function checkDatabaseStructure() {
    try {
        const tableInfo = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'course'
            ORDER BY column_name;
        `);
        console.log('=== COURSE TABLE STRUCTURE ===');
        tableInfo.rows.forEach(col => {
            console.log(`${col.column_name}: ${col.data_type}`);
        });
        console.log('==============================');
        return tableInfo.rows.map(col => col.column_name);
    } catch (error) {
        console.error('Error checking database structure:', error.message);
        return [];
    }
}

// Check database before running tests
beforeAll(async () => {
    // Ensure we're running on the test database
    console.log('=== CHECKING TEST DATABASE ===');
    check_db_query = `SELECT current_database()`;
    result = await db.query(check_db_query, []);
    console.log('Current database:', result.rows[0].current_database);
    
    if (result.rows[0].current_database != process.env.DB_NAME_TEST) {
        throw new Error('Not running on testing database! Aborting tests to prevent data loss.');
    }

    // Kiểm tra cấu trúc bảng course
    const columns = await checkDatabaseStructure();
    console.log('Checking required columns...');
    const requiredColumns = ['course_id', 'course_name', 'en_course_name', 'description', 'en_description'];
    const missingColumns = [];
    
    requiredColumns.forEach(col => {
        if (!columns.includes(col)) {
            missingColumns.push(col);
        }
    });
    
    if (missingColumns.length > 0) {
        console.error(`⚠️ WARNING: Missing columns in course table: ${missingColumns.join(', ')}`);
        console.error('These columns are required by the model but missing in the database.');
        console.error('Consider running migrations to update your test database schema.');
    }

    // Clear existing data
    console.log('Clearing existing test data...');
    await db.query(`
    DO $$ DECLARE
    r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
    END $$;
    `);
    
    // Reset sequences
    try {
        await db.query("SELECT setval('faculties_faculty_id_seq', 1, false);");
        console.log('Reset sequence: faculties_faculty_id_seq');
    } catch (error) {
        console.log("Notice: No sequence to reset or sequence doesn't exist");
    }
    
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
    
    // Reset sequences
    try {
        await db.query("SELECT setval('faculties_faculty_id_seq', 1, false);");
    } catch (error) {
        // Ignore error if sequence doesn't exist
    }
    
    return;
});

afterAll(async () => {
    logger.info('Course tests completed successfully');
    // Không gọi db.end() vì nó không tồn tại
    return;
});

describe('Course API', () => {
    // Kiểm tra cấu trúc DB trước khi chạy test
    describe('Database Structure', () => {
        it('should have the required columns for multilanguage support', async () => {
            const columns = await checkDatabaseStructure();
            expect(columns).toContain('course_id');
            expect(columns).toContain('course_name');
            expect(columns).toContain('description');
            // Columns for English language
            expect(columns).toContain('en_course_name');
            expect(columns).toContain('en_description');
        }, 10000);
    });
    
    // SECTION 1: COURSE ADDITION
    describe('Add Course Functionality', () => {
        // Test 1: Successfully adding a valid course
        it('should successfully add a valid course', async () => {
            console.log('\n=== TEST: Adding valid course ===');
            console.log('Test data:', JSON.stringify(validCourse, null, 2));
            
            // Setup: Insert faculty first
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);
            console.log('Faculty inserted with ID:', faculty.faculty_id);

            // Test: Add course with all valid fields
            try {
                const response = await request(app)
                    .post('/addCourse')
                    .send(validCourse);
                
                console.log('Response status:', response.status);
                console.log('Response body:', JSON.stringify(response.body, null, 2));
                
                expect(response.status).toBe(201);
                // Verify response structure and data
                expect(response.body.success).toBe(true);
                expect(response.body.message).toBe("Add course successfully");
                expect(response.body.course).toHaveProperty('course_id', validCourse.courseCode);
                expect(response.body.course).toHaveProperty('course_name', validCourse.courseName);
                expect(response.body.course).toHaveProperty('en_course_name', validCourse.courseNameEn);
                expect(response.body.course).toHaveProperty('credit', validCourse.credits);
                
                // Verify database
                const find_course = await db.query(find_course_query, [validCourse.courseCode]);
                console.log('Database record:', JSON.stringify(find_course.rows[0], null, 2));
                
                expect(find_course.rows[0].course_id).toBe(validCourse.courseCode);
                expect(find_course.rows[0].course_name).toBe(validCourse.courseName);
                expect(find_course.rows[0].en_course_name).toBe(validCourse.courseNameEn);
                expect(find_course.rows[0].status).toBe('Active');
            } catch (error) {
                console.error('Test failed with error:', error);
                throw error;
            }
            
            return;
        }, 10000);

        // Test 2: Adding a course with duplicate code
        it('should handle duplicate course code correctly', async () => {
            console.log('\n=== TEST: Adding duplicate course ===');
            
            // Setup: Insert faculty and the first course
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);

            // Add the first course
            try {
                const firstResponse = await request(app)
                    .post('/addCourse')
                    .send(validCourse);
                
                console.log('First course response:', firstResponse.status, firstResponse.body);
                
                // Test: Try to add another course with the same code
                const duplicateCourse = {
                    ...validCourse,
                    courseName: 'Different Name But Same ID',
                    courseNameEn: 'Different English Name But Same ID'
                };
                console.log('Attempting to add duplicate course:', JSON.stringify(duplicateCourse, null, 2));

                const response = await request(app)
                    .post('/addCourse')
                    .send(duplicateCourse);
                
                console.log('Duplicate course response:', response.status, response.body);
                
                // Verify error response
                expect(response.status).toBe(409);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toContain("Course ID already exists");
                expect(response.body.error).toBe("DUPLICATE_COURSE_ID");
            } catch (error) {
                console.error('Test failed with error:', error);
                throw error;
            }
            
            return;
        }, 10000);

        // Test 3: Adding a course with special characters and data limits
        it('should handle special characters and data limits correctly', async () => {
            console.log('\n=== TEST: Adding course with special characters ===');
            
            // Setup: Insert faculty
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);

            // Test case 1: Course with special characters
            const specialCharCourse = {
                courseCode: 'CS-507',
                courseName: 'Bảo mật: "SQL Injection"; DROP TABLE users;--',
                courseNameEn: 'Security: "SQL Injection"; DROP TABLE users;--',
                credits: 3,
                faculty: 1,
                description: '<script>alert("XSS")</script> & ký hiệu ®™©€£¥§±×÷',
                descriptionEn: '<script>alert("XSS")</script> & symbols ®™©€£¥§±×÷',
                prerequisite: null,
                time_create: '2025-04-17 15:30:45.123+07:00'
            };
            
            console.log('Special character course data:', JSON.stringify(specialCharCourse, null, 2));

            try {
                const response = await request(app)
                    .post('/addCourse')
                    .send(specialCharCourse);
                
                console.log('Special char course response:', response.status, response.body);
                
                expect(response.status).toBe(201);
                expect(response.body.success).toBe(true);
                
                // Verify special characters were stored correctly
                const find_course = await db.query(find_course_query, [specialCharCourse.courseCode]);
                console.log('Database record for special char course:', JSON.stringify(find_course.rows[0], null, 2));
                
                expect(find_course.rows[0].course_name).toBe(specialCharCourse.courseName);
                expect(find_course.rows[0].en_course_name).toBe(specialCharCourse.courseNameEn);
                expect(find_course.rows[0].description).toBe(specialCharCourse.description);
                expect(find_course.rows[0].en_description).toBe(specialCharCourse.descriptionEn);
            } catch (error) {
                console.error('Special char test failed with error:', error);
                throw error;
            }
            
            // Test case 2: Very long course name (edge case)
            console.log('\n=== TEST: Adding course with very long name ===');
            const veryLongName = 'A'.repeat(300);
            const longNameCourse = {
                ...validCourse,
                courseCode: 'CS508',
                courseName: veryLongName,
                courseNameEn: veryLongName
            };

            try {
                const longNameResponse = await request(app)
                    .post('/addCourse')
                    .send(longNameCourse);
                
                console.log('Long name course response:', longNameResponse.status);
                
                // If success (column might truncate automatically)
                if (longNameResponse.status === 201) {
                    const storedCourse = await db.query(find_course_query, [longNameCourse.courseCode]);
                    console.log(`Original name length: ${veryLongName.length}, Stored length: ${storedCourse.rows[0].course_name.length}`);
                } else {
                    console.log(`Long name rejected with status: ${longNameResponse.status}`);
                    console.log('Response body:', JSON.stringify(longNameResponse.body, null, 2));
                }
            } catch (error) {
                console.log('Database rejected very long name as expected:', error.message);
            }
            
            return;
        }, 15000);
    });

    // SECTION 2: COURSE SEARCH
    describe('Search Course Functionality', () => {
        // Test 4: Successfully retrieving a course by ID
        it('should successfully retrieve a course by ID', async () => {
            console.log('\n=== TEST: Retrieving course by ID ===');
            
            // Setup: Insert faculty and course
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);
            
            try {
                // First add a course
                const addResponse = await request(app)
                    .post('/addCourse')
                    .send(validCourse);
                
                console.log('Add course response:', addResponse.status, addResponse.body);
                
                // Test: Search by ID
                const response = await request(app)
                    .get(`/searchCourseById?courseId=${validCourse.courseCode}`);
                
                console.log('Search course response:', response.status, response.body);
                
                expect(response.status).toBe(200);
                // Verify response
                expect(response.body.success).toBe(true);
                expect(response.body.message).toBe("Search course successfully");
                expect(response.body.course.course_id).toBe(validCourse.courseCode);
                expect(response.body.course.course_name).toBe(validCourse.courseName);
            } catch (error) {
                console.error('Test failed with error:', error);
                throw error;
            }
            
            return;
        }, 10000);

        // Test 5: Searching for a non-existent course
        it('should handle search for non-existent course', async () => {
            console.log('\n=== TEST: Searching for non-existent course ===');
            
            // Setup: Insert faculty only
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);

            // Test: Search for non-existent course
            try {
                const response = await request(app)
                    .get('/searchCourseById?courseId=NON_EXISTENT');
                
                console.log('Search non-existent course response:', response.status, response.body);
                
                expect(response.status).toBe(500);
                expect(response.body.message).toBeTruthy();
            } catch (error) {
                console.error('Test failed with error:', error);
                throw error;
            }
            
            return;
        });

        // Test 6: Retrieving a list of all courses with language parameter
        it('should return a list of all courses with correct language', async () => {
            console.log('\n=== TEST: Getting all courses with language parameter ===');
            
            // Setup: Insert faculty and multiple courses
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);
            
            const course1 = { ...validCourse };
            const course2 = { 
                ...validCourse, 
                courseCode: 'CS502', 
                courseName: 'Khoa học dữ liệu',
                courseNameEn: 'Data Science',
                description: 'Mô tả về khoa học dữ liệu',
                descriptionEn: 'Description about data science'
            };
            const course3 = { 
                ...validCourse, 
                courseCode: 'CS503', 
                courseName: 'Học máy', 
                courseNameEn: 'Machine Learning',
                description: 'Mô tả về học máy',
                descriptionEn: 'Description about machine learning'
            };
            
            console.log('Adding multiple courses for testing getAllCourses API');
            
            try {
                // Add all courses
                await request(app).post('/addCourse').send(course1);
                await request(app).post('/addCourse').send(course2);
                await request(app).post('/addCourse').send(course3);
                
                // Test: Get all courses with Vietnamese language
                console.log('Testing getAllCourses with lang=vi');
                const responseVi = await request(app)
                    .get('/getAllCourses?lang=vi');
                
                console.log('getAllCourses (vi) response status:', responseVi.status);
                console.log('Number of courses returned:', responseVi.body.courses?.length);
                
                // Verify response for Vietnamese
                expect(responseVi.status).toBe(200);
                expect(responseVi.body.success).toBe(true);
                expect(Array.isArray(responseVi.body.courses)).toBe(true);
                expect(responseVi.body.courses.length).toBe(3);
                
                // Test: Get all courses with English language
                console.log('Testing getAllCourses with lang=en');
                const responseEn = await request(app)
                    .get('/getAllCourses?lang=en');
                
                console.log('getAllCourses (en) response status:', responseEn.status);
                console.log('Number of courses returned:', responseEn.body.courses?.length);
                
                // Verify response for English
                expect(responseEn.status).toBe(200);
                expect(responseEn.body.success).toBe(true);
                expect(Array.isArray(responseEn.body.courses)).toBe(true);
                expect(responseEn.body.courses.length).toBe(3);
                
                // Check course names in respective languages
                const viCourseNames = responseVi.body.courses.map(c => c.course_name).sort();
                const enCourseNames = responseEn.body.courses.map(c => c.course_name).sort();
                
                console.log('Vietnamese course names:', viCourseNames);
                console.log('English course names:', enCourseNames);
                
                // Check if correct language versions are returned
                expect(viCourseNames).toContain(course2.courseName); // Khoa học dữ liệu
                expect(enCourseNames).toContain(course2.en_course_name); // Data Science
            } catch (error) {
                console.error('Test failed with error:', error);
                throw error;
            }
            
            return;
        }, 20000); // Increase timeout for this complex test
    });

    // SECTION 3: COURSE UPDATE & DELETION
    describe('Update and Delete Course Functionality', () => {
        // Test 7: Successfully updating a course with language parameter
        it('should successfully update a course with language parameter', async () => {
            console.log('\n=== TEST: Updating course with language parameter ===');
            
            // Setup: Insert faculty and course
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);
            
            try {
                // First add a course
                const addResponse = await request(app)
                    .post('/addCourse')
                    .send(validCourse);
                
                console.log('Add course response:', addResponse.status);
                
                // Test: Update course in Vietnamese
                const updateDataVi = {
                    id: validCourse.courseCode,
                    courseName: 'Khóa học thuật toán cập nhật',
                    description: 'Mô tả đã cập nhật',
                    faculty: faculty.faculty_id,
                    credit: 5
                };
                
                console.log('Updating course in Vietnamese:', JSON.stringify(updateDataVi, null, 2));
                
                const responseVi = await request(app)
                    .put('/updateCourse?lang=vi')
                    .send(updateDataVi);
                
                console.log('Update course (vi) response:', responseVi.status, responseVi.body);
                
                expect(responseVi.status).toBe(200);
                expect(responseVi.body.success).toBe(true);
                expect(responseVi.body.course.course_name).toBe(updateDataVi.courseName);
                
                // Test: Update course in English
                const updateDataEn = {
                    id: validCourse.courseCode,
                    courseName: 'Updated Algorithm Course',
                    description: 'Updated description',
                    faculty: faculty.faculty_id,
                    credit: 5
                };
                
                console.log('Updating course in English:', JSON.stringify(updateDataEn, null, 2));
                
                const responseEn = await request(app)
                    .put('/updateCourse?lang=en')
                    .send(updateDataEn);
                
                console.log('Update course (en) response:', responseEn.status, responseEn.body);
                
                expect(responseEn.status).toBe(200);
                expect(responseEn.body.success).toBe(true);
                
                // Verify database has both language versions
                const find_course = await db.query(find_course_query, [validCourse.courseCode]);
                console.log('Updated course in DB:', JSON.stringify(find_course.rows[0], null, 2));
                
                expect(find_course.rows[0].course_name).toBe(updateDataVi.courseName);
                expect(find_course.rows[0].en_course_name).toBe(updateDataEn.courseName);
            } catch (error) {
                console.error('Test failed with error:', error);
                throw error;
            }
            
            return;
        }, 15000);

        // Test 8: Successfully updating a course status
        it('should successfully update a course status', async () => {
            console.log('\n=== TEST: Updating course status ===');
            
            // Setup: Insert faculty and course
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);
            
            try {
                // First add a course
                const addResponse = await request(app)
                    .post('/addCourse')
                    .send(validCourse);
                
                console.log('Add course response:', addResponse.status);
                
                // Test: Update course status
                const statusData = {
                    courseId: validCourse.courseCode,
                    status: 'Inactive'
                };
                
                console.log('Updating course status:', JSON.stringify(statusData, null, 2));
                
                const response = await request(app)
                    .put('/updateCourseStatus')
                    .send(statusData);
                
                console.log('Update status response:', response.status, response.body);
                
                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.message).toBe("Update course status successfully");
                expect(response.body.course.status).toBe('Inactive');
                
                // Verify database update
                const find_course = await db.query(find_course_query, [validCourse.courseCode]);
                expect(find_course.rows[0].status).toBe('Inactive');
            } catch (error) {
                console.error('Test failed with error:', error);
                throw error;
            }
            
            return;
        }, 10000);

        // Test 9: Successfully deleting a course
        it('should successfully delete a course', async () => {
            console.log('\n=== TEST: Deleting a course ===');
            
            // Setup: Insert faculty and course
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);
            
            try {
                // First add a course
                const addResponse = await request(app)
                    .post('/addCourse')
                    .send(validCourse);
                
                console.log('Add course response:', addResponse.status);
                
                // Test: Delete course
                const response = await request(app)
                    .delete('/deleteCourse')
                    .send({ courseId: validCourse.courseCode });
                
                console.log('Delete course response:', response.status, response.body);
                
                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.message).toBe("Delete course successfully");
                expect(response.body.course.course_id).toBe(validCourse.courseCode);
                
                // Verify course was deleted
                const find_course = await db.query(find_course_query, [validCourse.courseCode]);
                expect(find_course.rows.length).toBe(0);
            } catch (error) {
                console.error('Test failed with error:', error);
                throw error;
            }
            
            return;
        }, 10000);

        // Test 10: Checking if course exists in a class
        it('should check if course exists in class', async () => {
            console.log('\n=== TEST: Checking if course exists in class ===');
            
            // Setup: Insert faculty and course
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);
            
            try {
                // First add a course
                const addResponse = await request(app)
                    .post('/addCourse')
                    .send(validCourse);
                
                console.log('Add course response:', addResponse.status);
                
                // Test: Check if course exists in any class
                const response = await request(app)
                    .get(`/isCourseNameExists?courseId=${validCourse.courseCode}`);
                
                console.log('Course exists in class response:', response.status, response.body);
                
                // Since we don't have a class with this course in test DB, expect negative response
                expect(response.status).toBe(500);
                expect(response.body.message).toContain("Course does not exist in class");
            } catch (error) {
                console.error('Test failed with error:', error);
                throw error;
            }
            
            return;
        }, 10000);

        // Test 11: Handling update of non-existent course
        it('should handle updating non-existent course', async () => {
            console.log('\n=== TEST: Updating non-existent course ===');
            
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
            
            console.log('Attempting to update non-existent course:', JSON.stringify(updateData, null, 2));
            
            try {
                const response = await request(app)
                    .put('/updateCourse')
                    .send(updateData);
                
                console.log('Update non-existent course response:', response.status, response.body);
                
                expect(response.status).toBe(500);
                expect(response.body.message).toBeTruthy();
            } catch (error) {
                console.error('Test failed with error:', error);
                throw error;
            }
            
            return;
        });

        // Test 12: Handling deletion of non-existent course
        it('should handle deleting non-existent course', async () => {
            console.log('\n=== TEST: Deleting non-existent course ===');
            
            try {
                const response = await request(app)
                    .delete('/deleteCourse')
                    .send({ courseId: 'NON_EXISTENT' });
                
                console.log('Delete non-existent course response:', response.status, response.body);
                
                expect(response.status).toBe(500);
                expect(response.body.message).toBeTruthy();
            } catch (error) {
                console.error('Test failed with error:', error);
                throw error;
            }
            
            return;
        });
    });

    // SECTION 4: PERFORMANCE AND EDGE CASES
    describe('Performance and Edge Cases', () => {
        // Test 13: Handling Unicode characters in course names
        it('should handle Unicode characters in course names', async () => {
            console.log('\n=== TEST: Course with Unicode characters ===');
            
            // Setup: Insert faculty
            await db.query(insert_faculty_query, [
                faculty.faculty_id,
                faculty.faculty_name
            ]);
            
            // Course with Unicode characters
            const unicodeCourse = {
                ...validCourse,
                courseCode: 'UNICODE101',
                courseName: 'Khóa học Tiếng Việt với Unicode',
                courseNameEn: 'Курс на русском языке • 中文課程 • دورة بالعربية • Vietnamese',
                description: 'Mô tả bằng nhiều ký tự Unicode đặc biệt ★☆♨♫♪☀☁☂☃',
                descriptionEn: 'Description with many special Unicode characters ★☆♨♫♪☀☁☂☃'
            };
            
            console.log('Unicode course data:', JSON.stringify(unicodeCourse, null, 2));
            
            try {
                const response = await request(app)
                    .post('/addCourse')
                    .send(unicodeCourse);
                
                console.log('Add Unicode course response:', response.status, response.body);
                
                expect(response.status).toBe(201);
                expect(response.body.success).toBe(true);
                
                // Verify Unicode was stored correctly
                const find_course = await db.query(find_course_query, [unicodeCourse.courseCode]);
                console.log('Unicode stored in DB:', JSON.stringify(find_course.rows[0], null, 2));
                
                expect(find_course.rows[0].course_name).toBe(unicodeCourse.courseName);
                expect(find_course.rows[0].en_course_name).toBe(unicodeCourse.courseNameEn);
                expect(find_course.rows[0].description).toBe(unicodeCourse.description);
                expect(find_course.rows[0].en_description).toBe(unicodeCourse.descriptionEn);
            } catch (error) {
                console.error('Test failed with error:', error);
                throw error;
            }
            
            return;
        }, 10000);

        // Test 14: Handling decimal credit values
        it('should handle decimal credit values', async () => {
            console.log('\n=== TEST: Course with decimal credits ===');
            
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
            
            console.log('Decimal credit course data:', JSON.stringify(decimalCreditCourse, null, 2));
            
            try {
                const response = await request(app)
                    .post('/addCourse')
                    .send(decimalCreditCourse);
                
                console.log('Decimal credit course response:', response.status, response.body);
                
                // Check if your system supports decimal credits
                if (response.status === 201) {
                    // If decimal credits are supported
                    expect(response.body.course.credit).toBe(decimalCreditCourse.credits);
                    
                    const find_course = await db.query(find_course_query, [decimalCreditCourse.courseCode]);
                    console.log('Decimal credit stored in DB:', find_course.rows[0].credit);
                    
                    expect(find_course.rows[0].credit).toBe(decimalCreditCourse.credits);
                } else {
                    // If decimal credits are not supported
                    console.log('System does not support decimal credits');
                    console.log('Error message:', response.body.message);
                }
            } catch (error) {
                console.error('Test failed with error:', error);
                throw error;
            }
            
            return;
        }, 10000);
    });
});