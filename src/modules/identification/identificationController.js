const identificationModel = require('../identification/identificationModel');
const studentModel = require('../student/studentModel');
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

    static async updateIdentification(req, res) {
        let id = req.body;
        // console.log(id);
        if (id.id_type != 'CCCD') {
            id.has_chip = undefined;
        }

        if (id.id_type == 'passport' &&
            (!id.issue_country || id.issue_country == '')
        ) {
            logger.warn("Not exists country parameters for passport when updating student");
            return res.status(400).json({
                error: 'Hộ chiếu phải có thông tin quốc tịch'
            });
        }
        else {
            id.issue_country = ''
        }

        try {
            let listStudent = await studentModel.searchStudent(id.student_id);
            if (!listStudent || listStudent.length === 0) {
                logger.warn("Not corressponding student with specified ID");
                return res.status(404).json({
                    message: "No student with corressponding id"
                })
            }

            let listStudentID = await studentModel.searchStudentIdentification(id.student_id);
            if (!listStudentID || listStudentID.length === 0) {
                logger.warn("Not corressponding student identification details with specified ID");
                return res.status(404).json({
                    message: "No student with corressponding id"
                })
            }

            identificationModel.updateIdentification(id)

            return res.status(200).json({
                message: "Update success"
            })

        } catch (error) {
            logger.error("Error in update identification in StudentController:", error);
            return res.status(500).json({
                message: "Failed to search while updating student of user. Please try again later."
            });
        }


    }

    static async searchStudentIdentification(req, res) {
        try {
            logger.info("searchStudentIdentification method got called in studentController");
            let { mssv } = req.query;

            let listStudent = await studentModel.searchStudentIdentification(mssv);
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
