const courseModel = require('./courseModel');

class courseService {
    static async addCourse(course) {
        // Có thể kiểm tra nghiệp vụ ở đây nếu cần, ví dụ kiểm tra trùng mã, validate dữ liệu...
        return await courseModel.addCourse(course);
    }

    static async searchCourseById(courseId) {
        return await courseModel.searchCourseById(courseId);
    }

    static async getAllCourses(lang) {
        return await courseModel.getAllCourses(lang);
    }

    static async deleteCourse(courseId) {
        // Có thể kiểm tra nghiệp vụ trước khi xóa (ví dụ: kiểm tra có lớp nào đang dùng course này không)
        return await courseModel.deleteCourse(courseId);
    }

    static async updateCourse(course, lang) {
        return await courseModel.updateCourse(course, lang);
    }

    static async updateCourseStatus(courseId, status) {
        return await courseModel.updateCourseStatus(courseId, status);
    }

    static async isCourseExistInClass(courseId) {
        return await courseModel.isCourseExistInClass(courseId);
    }
}

module.exports = courseService;