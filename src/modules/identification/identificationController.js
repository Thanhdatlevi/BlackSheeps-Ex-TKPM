const identificationModel = require('../identification/identificationModel');
const logger = require('../../config/logging')
class identificationController{
    static async addIdentification(req, res){
        try {
            const newIdentification = {
                student_id: req.body.student_id,
                id_type: req.body.type,
                id_number: req.body.number,
                issue_date: req.body.issue_date,
                issue_place: req.body.issue_place,
                expiry_date: req.body.expiry_date,
                has_chip: req.body.has_chip,
                issue_country: req.body.issue_country,
                note: req.body.note
            };
            
            const addedIdentification = await identificationModel.addIdentification(newIdentification);
            if (addedIdentification) {
                logger.info("addIdentification executed successfully in identificationController");
                return res.status(201).json({
                    success: true,
                    message: "Add identification succcessfully",
                    identification: addedIdentification
                });
            } else {
                logger.warn("Failed to add identification. Please try again later.");
                return res.status(500).json({
                    message: "Failed to add identification. Please try again later."
                });
            }
        } catch (error) {
            logger.error("Error in addIdentificationController:", error.message);
            return res.status(500).json({
                message: "Failed to add identification of user. Please try again later."
            });
        }
    }
}
module.exports = identificationController;