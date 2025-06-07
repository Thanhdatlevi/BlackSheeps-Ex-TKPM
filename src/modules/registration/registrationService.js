const registrationModel = require('./registrationModel');

class registrationService {
    static async searchdeleteRegistration(student_id) {
        // Có thể kiểm tra nghiệp vụ ở đây nếu cần
        return await registrationModel.searchdeleteRegistration(student_id);
    }

    static async deleteRegistration(registration) {
        // Có thể kiểm tra nghiệp vụ ở đây nếu cần
        return await registrationModel.deleteRegistration(registration);
    }
}

module.exports = registrationService;