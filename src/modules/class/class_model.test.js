const classModel = require('./classModel');
const db = require('../../config/db');

jest.mock('../../config/db');
jest.mock('../student/studentModel');

describe('classModel', () => {
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('searchCourse', () => {
        it('should return course when course_id exists', async () => {
            const mockRows = [{ course_id: 'CS101', name: 'Intro to CS' }];
            db.query.mockResolvedValue({ rows: mockRows });

            const result = await classModel.searchCourse('CS101');
            expect(result).toEqual(mockRows);
            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM course'), ['CS101']);
        });

        it('should return empty array on error', async () => {
            db.query.mockRejectedValue(new Error('DB Error'));

            const result = await classModel.searchCourse('CS101');
            expect(result).toEqual([]);
        });
    });

    describe('searchYear', () => {
        it('should return matching year and semester', async () => {
            const mockRows = [{ year: 2025, semester: 'Spring' }];
            db.query.mockResolvedValue({ rows: mockRows });

            const result = await classModel.searchYear(2025, 'Spring');
            expect(result).toEqual(mockRows);
            expect(db.query).toHaveBeenCalled();
        });

        it('should return empty array on error', async () => {
            db.query.mockRejectedValue(new Error('DB Error'));

            const result = await classModel.searchYear(2025, 'Spring');
            expect(result).toEqual([]);
        });
    });
});

