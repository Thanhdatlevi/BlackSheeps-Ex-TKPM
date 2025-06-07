const request = require('supertest');
const app = require('../../../app'); // path to your Express app
const studentModel = require('./studentModel');
jest.setTimeout(30000); 
jest.mock('../student/studentModel'); // Mocking the model

describe('Student Controller', () => {
    describe('POST /add', () => {
        it('should add a student successfully', async () => {
            const mockStudent = {
                mssv: '123',
                name: 'John Doe',
                dob: '2000-01-01',
                gender: 'Male',
                faculty: 'Engineering',
                course: '2021',
                program: 'CS',
                status: 'Active',
                permanent_street: '123 St',
                permanent_ward: 'Ward 1',
                permanent_district: 'District A',
                permanent_city: 'City Z',
                email: 'john@example.com',
                phone: '1234567890',
            };

            const expectedStudent = { ...mockStudent, student_id: '123' };

            studentModel.addStudent.mockResolvedValue(expectedStudent);

            const response = await request(app)
                .post('/add')
                .send(mockStudent);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Student added successfully');
            expect(response.body).toHaveProperty('student');
        });

        it('should return 400 if email already exists', async () => {
            const mockStudent = {
                mssv: '123',
                name: 'John Doe',
                dob: '2000-01-01',
                gender: 'Male',
                faculty: 'Engineering',
                course: '2021',
                program: 'CS',
                status: 'Active',
                permanent_street: '123 St',
                permanent_ward: 'Ward 1',
                permanent_district: 'District A',
                permanent_city: 'City Z',
                email: 'john@example.com',
                phone: '1234567890',
            };

            const duplicateEmailError = new Error('duplicate key value violates unique constraint "students_email_key"');
            studentModel.addStudent.mockRejectedValue(duplicateEmailError);

            const response = await request(app)
                .post('/add')
                .send(mockStudent);

            expect(response.status).toBe(500);
            expect(response.body.message).toMatch("Failed to add student. Please try again later.");
        });
    });

    describe('DELETE /delete-student', () => {
        it('should delete a student successfully', async () => {
            const student = { student_id: '123', name: 'John Doe' };
            studentModel.searchStudent.mockResolvedValue([student]);
            studentModel.deleteStudent.mockResolvedValue(true);

            const response = await request(app)
                .delete('/delete-student')
                .send({ mssv: '123' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Xóa thành công!');
            expect(response.body).toHaveProperty('deletedStudent');
        });

        it('should return 404 if student not found', async () => {
            studentModel.searchStudent.mockResolvedValue([]);

            const response = await request(app)
                .delete('/delete-student')
                .send({ mssv: '999' });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Mã số sinh viên không tồn tại!");
        });
    });

    describe('GET /search', () => {
        it('should return student data with additional details', async () => {
            const student = { student_id: '123', name: 'John' };
            studentModel.searchStudent.mockResolvedValue([student]);
            const dummyData = { some: 'data' };
            jest.mocked(require('../identification/identificationModel')).getIdentification = jest.fn().mockResolvedValue(dummyData);
            jest.mocked(require('../address/addressModel')).getPermanentAddress = jest.fn().mockResolvedValue(dummyData);
            jest.mocked(require('../address/addressModel')).getTemporaryAddress = jest.fn().mockResolvedValue(dummyData);
            jest.mocked(require('../address/addressModel')).getMailingAddress = jest.fn().mockResolvedValue(dummyData);

            const response = await request(app)
                .get('/search-student')
                .query({ mssv: '123' });

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body[0]).toHaveProperty('information');
        });

        it('should return 404 when no students found', async () => {
            studentModel.searchStudent.mockResolvedValue([]);

            const response = await request(app)
                .get('/search-student')
                .query({ mssv: '999' });

            expect(response.status).toBe(404);
            expect(response.body.message).toMatch(/no students found/i);
        });
    });

    describe('PUT /update', () => {
        it('should update a student successfully', async () => {
            const updatedStudent = {
                mssv: '123',
                name: 'John Updated',
                dob: '2000-01-01',
                gender: 'Male',
                faculty: 'Engineering',
                course: '2021',
                program: 'CS',
                status: 'Active',
                email: 'john@example.com',
                phone: '1234567890',
                address: 'Full address'
            };

            studentModel.updateStudent.mockResolvedValue(true);

            const response = await request(app)
                .put('/update/student')
                .send(updatedStudent);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Update success');
        });

        it('should return 400 for missing fields', async () => {
            const incompleteStudent = {
                mssv: '123',
                name: ''
            };

            const response = await request(app)
                .put('/update/student')
                .send(incompleteStudent);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });
});

