const gradeModel = require('./gradeModel');

class gradeService {
    static async getStudentGrades(student_id, lang) {
        return await gradeModel.getStudentGrades(student_id, lang);
    }
}

module.exports = gradeService;