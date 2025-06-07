const facultyModel = require('./facultyModel');

class facultyService {
    static async addFaculty(faculty_name) {
        // Có thể kiểm tra nghiệp vụ ở đây nếu cần
        return await facultyModel.addFaculty(faculty_name);
    }

    static async searchFacultyByName(faculty_name) {
        return await facultyModel.searchFacultyByName(faculty_name);
    }

    static async updateFaculty(faculty) {
        return await facultyModel.updateFaculty(faculty);
    }

    static async getAllFaculties() {
        return await facultyModel.getAllFaculties();
    }
}

module.exports = facultyService;