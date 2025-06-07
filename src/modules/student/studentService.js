const studentModel = require('./studentModel');
const identificationService = require('../identification/identificationService');
const addressService = require('../address/addressService');

class studentService {
    static async addStudent(student) {
        // Có thể kiểm tra nghiệp vụ ở đây nếu cần
        return await studentModel.addStudent(student);
    }

    static async deleteStudent(mssv) {
        return await studentModel.deleteStudent(mssv);
    }

    static async searchStudent(mssv, name, khoa) {
        return await studentModel.searchStudent(mssv, name, khoa);
    }

    static async updateStudent(student) {
        return await studentModel.updateStudent(student);
    }

    static async searchStudentIdentification(mssv) {
        return await studentModel.searchStudentIdentification(mssv);
    }

    static formatAddress(address) {
        return address ? `${address.street_address || ''}, ${address.ward || ''}, ${address.district || ''}, ${address.city || ''}, ${address.country || ''}`.trim() : '';
    }
}

module.exports = studentService;