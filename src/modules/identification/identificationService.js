const identificationModel = require('./identificationModel');
const studentModel = require('../student/studentModel');

class identificationService {
    static async getIdentification(mssv) {
        return await identificationModel.getIdentification(mssv);
    }

    static async addIdentification(info) {
        // Có thể kiểm tra nghiệp vụ ở đây nếu cần
        return await identificationModel.addIdentification(info);
    }

    static async updateIdentification(id) {
        // Nghiệp vụ kiểm tra
        if (id.id_type != 'CCCD') id.has_chip = undefined;
        if (id.id_type == 'passport' && (!id.issue_country || id.issue_country == '')) {
            logger.warn("Not exists country parameters for passport when updating student");
            return {
                status: 400,
                body: { error: 'Hộ chiếu phải có thông tin quốc tịch' }
            };
        } else if (id.id_type != 'passport') {
            id.issue_country = '';
        }

        let listStudent = await studentModel.searchStudent(id.student_id);
        if (!listStudent || listStudent.length === 0) {
            logger.warn("Not corressponding student with specified ID");
            return {
                status: 404,
                body: { message: "No student with corressponding id" }
            };
        }

        let listStudentID = await studentModel.searchStudentIdentification(id.student_id);
        if (!listStudentID || listStudentID.length === 0) {
            logger.warn("Not corressponding student identification details with specified ID");
            return {
                status: 404,
                body: { message: "No student with corressponding id" }
            };
        }

        await identificationModel.updateIdentification(id);
        return {
            status: 200,
            body: { message: "Update success" }
        };
    }
}

module.exports = identificationService;