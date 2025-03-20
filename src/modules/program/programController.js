const programModel = require('../program/programModel');
class programController {
    static async addPage(req,res){
        try {
            res.render ('addProgram',{
                lauout: 'main',
                title: 'Add Program Page',
            });
        } catch (error) {
            console.error("Error in addProgramController:", error.message);
            return res.status(500).json({
                message: 'Failed to add program of user. PLease try again later'
            });
        }
    }
    static async addProgram(req, res){
        try {
            const program_name = req.body.name
            const addedProgram = await programModel.addProgram(program_name);
            if (addedProgram){
                return res.status(201).json(
                    {
                        success: true,
                        message: 'Add program successfully',
                        program: addedProgram
                    }
                );
            } else {
                return res.status(500).json(
                    {
                        mesage: 'Failed to add program. Please try again later.'
                    }
                );
            }
        }
        catch (error){
            console.error("Error in addProgramController:", error.message);
            return res.status(500).json({
                message: 'Failed to add program of user. Please try again later.'
            });
        }
    }
    static async updatePage(req,res){
        try {
            res.render('updateProgram',{
                layout: 'main',
                title: 'Update Program Page',
            });
        }
        catch (error){
            console.error("Error in updateProgramController:", error.message);
            return res.status(500).json({
                message: 'Failed to update program of user. Please try again later.'
            });
        }
    }
    static async searchProgramByName(req,res){
        try {
            const program_name = req.query.searchName;
            const program = await programModel.searchProgramByName(program_name);
            if (program){
                return res.status(200).json(
                    {
                        message: 'Search program successfully',
                        program: program
                    }
                );
            } else {
                return res.status(500).json(
                    {
                        message: 'Failed to search program. Please try again later.'
                    }
                );
            }
        }
        catch (error){
            console.error("Error in searchProgramController:", error.message);
            return res.status(500).json({
                message: 'Failed to search program of user. Please try again later.'
            });
        }
    }
    static async updateProgram(req,res){
        try {
            const {searchName, programName} = req.body;
            const program = await programModel.searchProgramByName(searchName);
            if (!program || program.length === 0){
                return res.status(404).json(
                    {
                        success: false,
                        message: 'Không tim thấy chương trình để cập nhật'  
                    }
                );
            } 
            const updatedProgram = await programModel.updateProgram({
                program_id: program.program_id,
                program_name: programName
            });
            console.log("Đã tìm thấy chương trình", updatedProgram);
            if (updatedProgram){
                return res.status(200).json(
                    {
                        success: true,
                        message: 'Cập nhật chương trình thành công',
                        program: updatedProgram
                    }
                );
            } else {
                return res.status(500).json(
                    {
                        message: 'Cập nhật chương trình thất bại'
                    }
                );
            }
        }
        catch (error){
            console.error("Error in updateProgramController:", error.message);
            return res.status(500).json({
                message: 'Failed to update program of user. Please try again later.'
            });
        }
    }
    static async getAllPrograms(req,res){
        try {
            const programs = await programModel.getAllPrograms();
            return res.status(200).json(
                {
                    message: 'Get all programs successfully',
                    programs: programs
                }
            );
        }
        catch (error){
            console.error("Error in getAllProgramsController:", error.message);
            return res.status(500).json({
                message: 'Failed to get all programs of user. Please try again later.'
            });
        }
    }
}

module.exports = programController;