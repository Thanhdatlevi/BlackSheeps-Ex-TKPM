const classModel = require('./classModel');
const studentModel = require('../student/studentModel');

class classService {
    static async addClass(classObject) {
        const year_result = await classModel.searchYear(classObject.year, classObject.semester);
        if (year_result.length === 0) throw new Error('Year Term not found');

        const class_result = await classModel.countClass(
            classObject.class_id,
            classObject.course_id,
            classObject.year,
            classObject.semester
        );
        if (parseInt(class_result.count) !== 0) throw new Error('Class already existed');

        const courseResult = await classModel.searchCourse(classObject.course_id);
        if (courseResult.length === 0) throw new Error('Course with id not existed');

        return await classModel.addClass(classObject);
    }

    static async updateClass(classObject) {
        // Có thể kiểm tra nghiệp vụ nếu cần
        return await classModel.updateClass(classObject);
    }

    static async addStudentToClass(studentList, classObject) {
        // Kiểm tra từng sinh viên có tồn tại không
        for (let student of studentList) {
            let student_result = await studentModel.searchStudent(student.student_id, '', '');
            if (student_result.length === 0) throw new Error('Non-existing Student');
        }
        // Kiểm tra lớp có tồn tại không
        const class_result = await classModel.countClass(
            classObject.class_id,
            classObject.course_id,
            classObject.year,
            classObject.semester
        );
        if (parseInt(class_result.count) === 0) throw new Error('Class not found');

        // Kiểm tra sinh viên đã đăng ký chưa
        for (let student of studentList) {
            const subject_result = await classModel.countRegister(
                student.student_id,
                classObject.class_id,
                classObject.course_id,
                classObject.year,
                classObject.semester
            );
            if (parseInt(subject_result.count) !== 0) throw new Error('Student already register this subject');
        }
        // Thêm từng sinh viên vào lớp
        let results = [];
        let result = await classModel.addStudentToClass(studentList, classObject);
            if (result) results.push(result);
        return results;
    }

    static async updateStudentInClass(studentList, classObject) {
        let results = [];
        for (let student of studentList) {
            let result = await classModel.updateStudentInClass(student, classObject);
            if (result) results.push(result);
        }
        return results;
    }

    static async getCourses(lang) {
        return await classModel.getCourses(lang);
    }

    static async getYear() {
        return await classModel.getYear();
    }

    static async getClasses() {
        return await classModel.getClasses();
    }
}

module.exports = classService;