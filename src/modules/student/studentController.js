// const cartService = require("./cartService");
// const userService = require('../user/userService');
class studentController {
    
    static async addStudent(req, res) {
        try {
            res.render('add', {
                layout: 'main',
                title: 'Add Student Page',
            });

        } catch (error) {
            console.error("Error in addStudentController:", error.message);
            return res.status(500).json({
                message: 'Failed to add student. Please try again later.'
            });
        }

    }

    static async deleteStudent(req, res) {
        try {
            res.render('delete', {
                layout: 'main',
                title: 'Delete Student Page',
            });

        } catch (error) {
            console.error("Error in deleteStudentController:", error.message);
            return res.status(500).json({
                message: 'Failed to delete student of user. Please try again later.'
            });
        }

    }

    static async searchStudent(req, res) {
        try {
            res.render('search', {
                layout: 'main',
                title: 'Search Student Page',
            });

        } catch (error) {
            console.error("Error in searchStudentController:", error.message);
            return res.status(500).json({
                message: 'Failed to search student of user. Please try again later.'
            });
        }

    }
}

module.exports = studentController;