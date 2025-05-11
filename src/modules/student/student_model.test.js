const studentModel = require('./studentModel');
const db = require('../../config/db')

jest.mock('../../config/db')

describe('studentModel', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('updateStudent', () => {
        it('should update student when conditions are met', async () => {
            const studentObj = {
                fullname: 'A',
                date_of_birth: '07/07/2024',
                gender: 'Nu',
                faculty: 'Hello',
                academic_year: '2022-2023',
                education_program: 'hello', 
                address: 'temp',
                email: 'temp@gmail.com',
                phone: '023985091',
                student_status: '1',
                student_id: '29294308'
            };
            db.query
                .mockResolvedValueOnce({
                    rows: [{
                        program_id: '1',
                        faculty_id: '1',
                        status_id: '1'
                    }]
                })
                .mockResolvedValueOnce({
                    rows: [studentObj]
                });
            const result = await studentModel.updateStudent(studentObj);
            expect(result).toEqual(studentObj);
        });
    });
});
