const addressModel = require('./addressModel');

class addressService {
    static async addAddress(addressInfo) {
        // Có thể kiểm tra nghiệp vụ ở đây nếu cần
        // Ví dụ: kiểm tra address_type hợp lệ, kiểm tra trùng địa chỉ, v.v.
        return await addressModel.addAddress(addressInfo);
    }

    static async updateAddress(addressInfo) {
        // Có thể kiểm tra nghiệp vụ ở đây nếu cần
        return await addressModel.updateAddress(addressInfo);
    }

    static async getPermanentAddress(mssv) {
        return await addressModel.getPermanentAddress(mssv);
    }

    static async getTemporaryAddress(mssv) {
        return await addressModel.getTemporaryAddress(mssv);
    }

    static async getMailingAddress(mssv) {
        return await addressModel.getMailingAddress(mssv);
    }
}

module.exports = addressService;