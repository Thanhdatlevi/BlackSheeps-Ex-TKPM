const facultyModel = require('../faculty/facultyModel');
const logger = require('../../config/logging')
class facultyController {

    static async addPage(req,res){
        try {
            logger.info("addPage method got called in facultyController");
            res.render('addFaculty', {
                layout: 'main',
                title: 'Add Faculty Page',
            });
        } catch (error) {
            logger.error("Error in addFacultyController:", error.message);
            return res.status(500).json({
                message: "Failed to add faculty of user. Please try again later."
            });
        }
   }
   static async addFaculty(req,res){
        try {
            logger.info("addFaculty method got called in facultyController");
            const faculty_name = req.body.name;
            const addedFaculty = await facultyModel.addFaculty(faculty_name);
            
            if (addedFaculty){
                return res.status(201).json(
                    {
                        success: true,
                        message: "Add faculty succcessfully",
                        faculty: addedFaculty
                    }
                );
            } else {
                logger.warn("Failed to add faculty. Please try again later.");
                return res.status(500).json(
                    {
                        message: "Failed to add faculty. Please try again later."
                    }
                );
            }
        }
        catch (error){
            logger.error("Error in addFacultyController:", error.message);
            return res.status(500).json({
                message: "Failed to add faculty of user. Please try again later."
            });
        }
   }   
    static async updatePage(req,res){
        try {
            logger.info("updatePage method got called in FacultyController");
            res.render('updateFaculty', {
                layout: 'main',
                title: 'Update Faculty Page',
            });
        }
        catch (error){
            logger.error("Error in updateFacultyController:", error.message);
            return res.status(500).json({
                message: "Failed to update faculty of user. Please try again later."
            });
        }
   }
   static async searchFacultyByName(req,res){
        try {
            const faculty_name = req.query.searchName;
            const faculty = await facultyModel.searchFacultyByName(faculty_name);

            if (faculty){
                logger.info("searchFacultyByName executed successfully");
                return res.status(200).json(
                    {
                        faculty: faculty
                    }
                );
            } else {
                logger.warn("Failed to get faculty. Please try again later.");
                return res.status(500).json(
                    {
                        message: "Failed to get faculty. Please try again later."
                    }
                );
            }
        }
        catch (error){
            logger.error("Error in getFacultyController:", error.message);
            return res.status(500).json({
                message: "Failed to get faculty of user. Please try again later."
            });
        }  
   }
   static async updateFaculty(req, res) {
    try {
        const { searchName, facultyName } = req.body; // Lấy dữ liệu từ request body
        const faculty = await facultyModel.searchFacultyByName(searchName); // Tìm khoa theo tên cũ

        if (!faculty || faculty.length === 0) {
            logger.warn("No faculty found to update");
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy khoa để cập nhật"
            });
        }

        const updatedFaculty = await facultyModel.updateFaculty({
            faculty_id: faculty[0].faculty_id, // Lấy ID của khoa tìm được
            faculty_name: facultyName // Tên khoa mới
        });
        if (updatedFaculty) {
            logger.info("updateFaculty executed successfully");
            return res.status(200).json({
                success: true,
                message: "Cập nhật khoa thành công",
                faculty: updatedFaculty
            });
        } else {
            logger.warn("Failed to update faculty.");
            return res.status(500).json({
                success: false,
                message: "Cập nhật khoa thất bại"
            });
        }
    } catch (error) {
        logger.error("Error in updateFacultyController:", error.message);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi khi cập nhật khoa"
        });
    }
}
    static async getAllFaculties(req,res){
        try {
            const faculties = await facultyModel.getAllFaculties();
            logger.info("getAllFaculties executed successfully");

            return res.status(200).json(
                {
                    message: "Get all faculties successfully",
                    faculties: faculties
                }
            );
        }
        catch (error){
            logger.error("Error in getAllFacultiesController:", error.message);
            return res.status(500).json({
                message: "Failed to get all faculties of user. Please try again later."
            });
        }
    }
}
module.exports = facultyController;