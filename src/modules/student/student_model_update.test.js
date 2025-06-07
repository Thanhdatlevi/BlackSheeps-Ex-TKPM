const studentModel = require('./studentModel');
const db = require('../../config/db')

jest.mock('../../config/db')
jest.setTimeout(30000); 
describe('studentModel', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('updateStudent', () => {
        const studentObj = {
            full_name: 'A',
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

        it('should update student when conditions are met', async () => {
            db.query
                .mockResolvedValueOnce({
                    rows: [{
                        program_id: '1',
                        faculty_id: '1',
                        status_id: '1'
                    }]
                })
                .mockResolvedValueOnce({ // updateStudent
                    rows: [studentObj]
                })
                .mockResolvedValueOnce({
                    rows: [studentObj]
                });
            const result = await studentModel.updateStudent(studentObj);
            expect(result).toEqual(studentObj);
        });

        it ('Should throw an error if student_id does not exists', async () => {
            db.query
                .mockResolvedValueOnce({ // find external info
                    rows: [{
                        program_id: '1',
                        faculty_id: '1',
                        status_id: '1'
                    }]
                })
                .mockResolvedValueOnce({ // searchStudent
                    rows: []
                })
                .mockResolvedValueOnce({ // updateStudent
                    rows: []
                });
            await expect(studentModel.updateStudent(studentObj))
                .rejects.toThrow('Student does not exist');
        });

        it('Should throw an error if faculty, program or status does not exist', async () => {
            db.query
                .mockResolvedValueOnce({ // find facult, program and status
                    rows: []
                })
                .mockResolvedValueOnce({ // insert (if exists at all)
                    rows: []
                })
                .mockResolvedValueOnce({ // insert (if exists at all)
                    rows: []
                });
            await expect(studentModel.updateStudent(studentObj))
                .rejects.toThrow('There\'s no program or faculty or status');               
        });
    });
});
