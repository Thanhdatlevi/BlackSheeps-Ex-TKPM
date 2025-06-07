const identificationService = require('./identificationService');
const studentService = require('../student/studentService');
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
            
            const addedIdentification = await identificationService.addIdentification(newIdentification);
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

    static async updateIdentification(req, res) {
        try {
            const result = await identificationService.updateIdentification(req.body);
            return res.status(result.status).json(result.body);
        } catch (error) {
            logger.error("Error in updateIdentificationController:", error.message);
            return res.status(500).json({
                message: "Failed to update identification. Please try again later."
            });
        }
    }

    static async searchStudentIdentification(req, res) {
        try {
            logger.info("searchStudentIdentification method got called in studentController");
            let { mssv } = req.query;

            let listStudent = await studentService.searchStudentIdentification(mssv);
            return res.json(listStudent);

        } catch (error) {
            logger.error("Error in searchStudentController:", error.message);
            return res.status(500).json({
                message: "Failed to search student of user. Please try again later."
            });
        }
    }
}

module.exports = identificationController;
