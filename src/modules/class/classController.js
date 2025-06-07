const classService = require('./classService');
const logger = require('../../config/logging');

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
            const result = await classService.addClass(classObject);
            if (result) {
                return res.status(200).json({ message: "Class added successfully." });
            }
        } catch (error) {
            switch (error.message) {
                case 'Course with id not existed':
                    return res.status(409).json({ message: `Course with id doesn't appear in Database` });
                case 'Class already existed':
                    return res.status(409).json({ message: `Class with corresponding info already existed in Database` });
                case 'Year Term not found':
                    return res.status(409).json({ message: `Year Term not found` });
                default:
                    return res.status(500).json({ message: "Failed to add class. Please try again later." });
            }
        }
    }

    static async updateClass(req, res) {
        try {
            logger.info("updateClass method got called in classController");
            const classObject = req.body;
            const result = await classService.updateClass(classObject);
            if (result) {
                return res.status(200).json({ message: "Class updated successfully." });
            }
        } catch (error) {
            logger.error("Error in updateClass:", error.message);
            return res.status(500).json({ message: "Failed to update class. Please try again later." });
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
            logger.info("addStudentToClass method got called in ClassController");
            const studentList = req.body.studentList;
            const classObject = req.body.classObject;
            const result = await classService.addStudentToClass(studentList, classObject);
            if (result) {
                return res.status(200).json({ message: "Students added successfully." });
            }
        } catch (error) {
            switch (error.message) {
                case 'Non-existing Student':
                    return res.status(409).json({ message: `Students with ID doesn't appear in Database` });
                case 'Class not found':
                    return res.status(409).json({ message: `Class with corresponding info doesn't appear in Database` });
                case 'Student already register this subject':
                    return res.status(409).json({ message: `Students with ID already register the corresponding class` });
                default:
                    return res.status(500).json({ message: "Failed to add students to class. Please try again later." });
            }
        }
    }

    static async updateStudentInClass(req, res) {
        try {
            logger.info("updateStudentInClass method got called in ClassController");
            const studentList = req.body.studentList;
            const classObject = req.body.classObject;
            const result = await classService.updateStudentInClass(studentList, classObject);
            if (result) {
                return res.status(200).json({ message: "Students updated successfully." });
            }
        } catch (error) {
            logger.error("Error in updateStudentInClass:", error.message);
            return res.status(500).json({
                message: "Failed to update students in class. Please try again later."
            });
        }
    }

    static async getCourses(req, res) {
        try {
            const lang = req.query.lang || 'vi';
            logger.info("getCourses method got called in ClassController");
            const courses = await classService.getCourses(lang);
            if (courses) {
                return res.status(200).json({ courses: courses });
            }
        } catch (error) {
            logger.error("Error in getCourses:", error.message);
            return res.status(500).json({
                message: "Failed to get courses. Please try again later."
            });
        }
    }

    static async getYear(req, res) {
        try {
            logger.info("getYear method got called in ClassController");
            const yearTerm = await classService.getYear();
            if (yearTerm) {
                return res.status(200).json({ terms: yearTerm });
            }
        } catch (error) {
            logger.error("Error in getYear controller:", error);
            return res.status(500).json({
                message: "Failed to get year. Please try again later."
            });
        }
    }

    static async getAllClasses(req, res) {
        try {
            logger.info("getAllClasses method got called in ClassController");
            const classes = await classService.getClasses();
            if (classes) {
                return res.status(200).json({ classes: classes });
            }
        } catch (error) {
            logger.error("Error in getAllClasses controller:", error);
            return res.status(500).json({
                message: "Failed to get classes. Please try again later."
            });
        }
    }
}

module.exports = classController;