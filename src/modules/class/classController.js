const classModel = require('../class/classModel');
const logger = require('../../config/logging')
class classController {

    static async classPage(req, res) {
        try {
            logger.info("classPage method got called in classController");
            res.render('Classes/AddClass', {
                layout: 'main',
                title: 'Add Class Page',
            });
        } catch (error) {
            logger.error("Error in classPage:", error.message);
            return res.status(500).json({
                message: "Failed to render add class page. Please try again later."
            });
        }
    }

    static async addClass(req, res) {
        try {
            logger.info("addClass method got called in classController");
            const classObject = req.body;
            const result = await classModel.addClass(classObject);
            if (result) {
                return res.status(200).json({
                    message: "Class added successfully."
                });
            }
        } catch (error) {
            logger.error("Error in addClass:", error.message);
            return res.status(500).json({
                message: "Failed to add class. Please try again later."
            });
        }
    }
    static async updateClass(req, res) {
        try {
            logger.info("updateClass method got called in classController");
            const classObject = req.body;
            const result = await classModel.updateClass(classObject);
            if (result) {
                return res.status(200).json({
                    message: "Class updated successfully."
                });
            }
        } catch (error) {
            logger.error("Error in emailController:", error.message);
            return res.status(500).json({
                message: "Failed to add email of user. Please try again later."
            });
        }
    }
    static async addStudentClassPage(req, res) {
        try {
            logger.info("addStudentClassPage method got called in ClassController");
            res.render('Classes/AddStudentClass', {
                layout: 'main',
                title: 'Add Student Class Page',
            });
        } catch (error) {
            logger.error("Error in addStudentClassPage:", error.message);
            return res.status(500).json({
                message: "Failed to add student class page. Please try again later."
            });
        }
    }
    static async addStudentToClass(req, res) {
        try {
            logger.info("addstudentToClass method got called in ClassController");
            const studentList = req.body.studentList;
            const classObject = req.body.classObject;
            const result = await classModel.addStudentToClass(studentList, classObject);
            if (result) {
                return res.status(200).json({
                    message: "Students added successfully."
                });
            }
        } catch (error) {
            logger.error("Error in addStudentToClass:", error.message);
            return res.status(500).json({
                message: "Failed to add students to class. Please try again later."
            });
        }
    }
    static async updateStudentInClass(req, res) {
        try {
            logger.info("updateStudentInClass method got called in ClassController");
            const studentList = req.body.studentList;
            const classObject = req.body.classObject;
            const result = await classModel.updateStudentInClass(studentList, classObject);
            if (result) {
                return res.status(200).json({
                    message: "Students updated successfully."
                });
            }
        } catch (error) {
            logger.error("Error in updateStudentInClass:", error.message);
            return res.status(500).json({
                message: "Failed to update students in class. Please try again later."
            });
        }
    }
}

module.exports = classController;
