const registrationModel = require('../registration/registrationModel');
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
            const deleteRegistration = await registrationModel.searchdeleteRegistration(student_id);
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

    static async deleteRegistration(req,res){
        try {
            logger.info("deleteRegistration method got called in registrationController");
            const registration = req.body;
            const deletedRegistration = await registrationModel.deleteRegistration(registration);
            if (deletedRegistration){
                return res.status(200).json(
                    {
                        success: true,
                        message: "Delete Registration succcessfully",
                        registration: deletedRegistration.deletedRegistration
                    }
                );
            } else {
                logger.warn("Failed to Delete Registration. Please try again later.");
                return res.status(500).json(
                    {
                        message: "Failed to Delete Registration. Please try again later."
                    }
                );
            }
        }
        catch (error){
            logger.error("Error in Delete RegistrationController:", error);
            return res.status(500).json({
                message: "Failed to delete registration of user. Please try again later."
            });
        }
    }
}

module.exports = registrationController;