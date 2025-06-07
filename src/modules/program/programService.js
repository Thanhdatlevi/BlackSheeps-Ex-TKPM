const programModel = require('./programModel');

class programService {
    static async addProgram(program_name) {
        // Có thể kiểm tra nghiệp vụ ở đây nếu cần
        return await programModel.addProgram(program_name);
    }

    static async searchProgramByName(program_name) {
        return await programModel.searchProgramByName(program_name);
    }

    static async updateProgram(program) {
        return await programModel.updateProgram(program);
    }

    static async getAllPrograms() {
        return await programModel.getAllPrograms();
    }
}

module.exports = programService;