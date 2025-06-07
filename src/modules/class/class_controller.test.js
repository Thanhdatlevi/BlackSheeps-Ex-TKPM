const classController = require('./classController');
const classService = require('./classService');
const httpMocks = require('node-mocks-http');

jest.mock('./classService');
jest.setTimeout(30000); 
describe('classController', () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        res.render = jest.fn();
        res.status = jest.fn(() => res);
        res.json = jest.fn();
    });

    describe('classPage', () => {
        it('should render AddClass page with layout and title', async () => {
            await classController.classPage(req, res);
            expect(res.render).toHaveBeenCalledWith('Classes/AddClass', {
                layout: 'main',
                title: 'Add Class Page',
            });
        });
    });

    describe('addClass', () => {
        it('should return 200 if class is added successfully', async () => {
            req.body = { name: 'Math' };
            classService.addClass.mockResolvedValue(true);

            await classController.addClass(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Class added successfully.'
            });
        });

        it('should return 409 for Course ID error', async () => {
            req.body = { name: 'Science' };
            classService.addClass.mockRejectedValue(new Error('Course with id not existed'));

            await classController.addClass(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({
                message: "Course with id doesn't appear in Database"
            });
        });

        it('should return 500 on unknown error', async () => {
            req.body = { name: 'History' };
            classService.addClass.mockRejectedValue(new Error('Unexpected'));

            await classController.addClass(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Failed to add class. Please try again later.'
            });
        });
    });

    describe('addStudentClassPage', () => {
        it('should render AddStudentClass page', async () => {
            await classController.addStudentClassPage(req, res);
            expect(res.render).toHaveBeenCalledWith('Classes/AddStudentClass', {
                layout: 'main',
                title: 'Add Student Class Page',
            });
        });
    });

    describe('addStudentToClass', () => {
        it('should return 200 when students added successfully', async () => {
            req.body = {
                studentList: ['stu1', 'stu2'],
                classObject: { id: 1 }
            };
            classService.addStudentToClass.mockResolvedValue(true);

            await classController.addStudentToClass(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Students added successfully.'
            });
        });

        it('should return 409 if student already registered', async () => {
            req.body = {
                studentList: ['stu1', 'stu2'],
                classObject: { id: 1 }
            };
            classService.addStudentToClass.mockRejectedValue(
                new Error('Student already register this subject')
            );

            await classController.addStudentToClass(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Students with ID already register the corresponding class'
            });
        });
    });

    describe('updateClass', () => {
        it('should return 200 if class is updated successfully', async () => {
            req.body = { id: 1 };
            classService.updateClass.mockResolvedValue(true);

            await classController.updateClass(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Class updated successfully.'
            });
        });
    });

    describe('updateStudentInClass', () => {
        it('should return 200 if students updated', async () => {
            req.body = {
                studentList: ['a', 'b'],
                classObject: { id: 2 }
            };
            classService.updateStudentInClass.mockResolvedValue(true);

            await classController.updateStudentInClass(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Students updated successfully.'
            });
        });
    });

    describe('getCourses', () => {
        it('should return courses list', async () => {
            const courses = [{ id: 1, name: 'Physics' }];
            classService.getCourses.mockResolvedValue(courses);

            await classController.getCourses(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                courses
            });
        });
    });

    describe('getYear', () => {
        it('should return year term list', async () => {
            const terms = ['2023 Fall', '2024 Spring'];
            classService.getYear.mockResolvedValue(terms);

            await classController.getYear(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                terms
            });
        });
    });

    describe('getAllClasses', () => {
        it('should return all classes', async () => {
            const classes = [{ id: 1, name: 'Algebra' }];
            classService.getClasses.mockResolvedValue(classes);

            await classController.getAllClasses(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                classes
            });
        });
    });
});