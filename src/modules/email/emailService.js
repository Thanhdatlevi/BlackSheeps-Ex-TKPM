const emailModel = require('./emailModel');

class emailService {
    static async addEmail(email) {
        // Có thể kiểm tra nghiệp vụ ở đây nếu cần
        return await emailModel.addEmail(email);
    }

    static async searchEmail(email) {
        return await emailModel.searchEmail(email);
    }

    static async updateEmail(email) {
        return await emailModel.updateEmail(email);
    }

    static async getAllEmails() {
        return await emailModel.getAllEmails();
    }

    static async deleteEmail(email_id) {
        return await emailModel.deleteEmail(email_id);
    }
}

module.exports = emailService;