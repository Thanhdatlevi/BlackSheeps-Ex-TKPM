const registrationService = require('./registrationService');
const logger = require('../../config/logging')
class registrationController {
    static async deleteRegistrationPage(req,res){
        try {
            logger.info("deleteRegistrationPage method got called in programController");
            res.render ('deleteRegistration',{
                lauout: 'main',
                title: 'Delete Registration Subject',
            });
        } catch (error) {
            logger.error("Error in registrationController:", error.message);
            return res.status(500).json({
                message: "Failed to deleteRegistrationPage of user. PLease try again later"
            });
        }
    }

    static async searchdeleteRegistration(req,res){
        try {
            const student_id = req.query.student_id;
            const deleteRegistration = await registrationService.searchdeleteRegistration(student_id);
            return res.status(200).json(deleteRegistration);
        }
        catch (error){
            logger.error("Error in registrationController:", error);
            return res.status(500).json({
                message: "Lỗi khi tìm danh sách đăng ký. Vui lòng thử lại sau.",
                data: []
            });
        }
    }

    static async deleteRegistration(req, res) {
        try {
            logger.info("deleteRegistration method got called in registrationController");
            const registration = req.body;
    
            // Kiểm tra nếu thiếu thông tin
            if (!registration.student_id || !registration.class_id || !registration.course_id || !registration.year || !registration.semester) {
                logger.warn("Missing required fields in the request.");
                return res.status(500).json({
                    success: false,
                    message: "Failed: Thiếu thông tin đăng ký, vui lòng kiểm tra lại."
                });
            }
    
            // Gọi model để xóa đăng ký
            const deletedRegistration = await registrationService.deleteRegistration(registration);
    
            // Nếu không tìm thấy đăng ký
            if (!deletedRegistration.success) {
                return res.status(500).json({
                    success: false,
                    message: "Failed: Không tìm thấy đăng ký để xóa."
                });
            }
    
            // Xóa thành công
            return res.status(200).json({
                success: true,
                message: "Xóa đăng ký thành công.",
                registration: deletedRegistration.deletedRegistration
            });
    
        } catch (error) {
            logger.error("Error in Delete RegistrationController:", error);
            return res.status(500).json({
                message: "Failed: Lỗi khi xóa đăng ký. Vui lòng thử lại sau."
            });
        }
    }
    
    
}

module.exports = registrationController;