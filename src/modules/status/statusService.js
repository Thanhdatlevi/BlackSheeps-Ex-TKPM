const statusModel = require('./statusModel');

class statusService {
    static async addStatus(status_name) {
        // Có thể kiểm tra nghiệp vụ ở đây nếu cần
        return await statusModel.addStatus(status_name);
    }

    static async searchStatusByName(status_name) {
        return await statusModel.searchStatusByName(status_name);
    }

    static async updateStatus(status) {
        return await statusModel.updateStatus(status);
    }

    static async getAllStatus() {
        return await statusModel.getAllStatus();
    }
}

module.exports = statusService;