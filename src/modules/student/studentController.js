const studentModel = require('../student/studentModel');
const logger = require('../../config/logging')
class studentController {

    static async addPage(req, res) {
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
    static async addStudent(req, res) {
        try {
            logger.info("addStudent method got called in studentController");
            const newStudent = {
                mssv: req.body.mssv,
                name: req.body.name,
                dob: req.body.dob,
                gender: req.body.gender,
                faculty: req.body.faculty,
                course: req.body.course,
                program: req.body.program,
                address: req.body.address,
                email: req.body.email,
                phone: req.body.phone,
                status: req.body.status
            }
            
            const addedStudent = await studentModel.addStudent(newStudent);
            if (addedStudent) {
                return res.status(201).json({
                    message: 'Student added successfully',
                    student: addedStudent
                });
            } else {
                return res.status(500).json({
                    message: 'Failed to add student. Please try again later.'
                });
            }

        } catch (error) {
            if (error.message.includes('duplicate key value violates unique constraint')) {
                if (error.message.includes('students_pkey')) {
                    logger.warn("Error existing studentID when adding student");
                    return res.status(400).json({
                        message: 'Student ID already exists. Please use a different ID.'
                    });
                }
                else if (error.message.includes('students_email_key')) {
                    logger.warn("Error existing student email when adding student");
                    return res.status(400).json({
                        message: 'Email already exists. Please use a different email.'
                    });
                }
                else if (error.message.includes('students_phone_key')) {
                    logger.warn("Error existing student phone number when adding student");
                    return res.status(400).json({
                        message: 'Phone number already exists. Please use a different phone number.'
                    });
                }
            }
            logger.error("Error in addStudentController:", error.message);
            return res.status(500).json({
                message: 'Failed to add student. Please try again later.'
            });
        }

    }

    static async deletePage(req, res) {
        try {
            logger.info("deletePage method got called in studentController");
            res.render('delete', {
                layout: 'main',
                title: 'Delete Student Page',
            });
        } catch (error) {
            logger.error("Error in deleteStudentController:", error.message);
            return res.status(500).json({
                message: 'Failed to delete student of user. Please try again later.'
            });
        }

    }

    static async deleteStudent(req, res) {
        try {
            logger.info("deleteStudent method got called in studentController");
            const { mssv } = req.body;
            const checkStudent = await studentModel.searchStudent(mssv);
        
            if (checkStudent.length === 0) {
                logger.warn("StudentID not exists when deleting");
                return res.status(404).json({ message: "Mã số sinh viên không tồn tại!" });
            }

            const deletedStudent = checkStudent[0];

            await studentModel.deleteStudent(mssv);

            return res.json({ message: "Xóa thành công!", deletedStudent });
        } catch (error) {
            logger.error("Error in deleteStudentController:", error.message);
            return res.status(500).json({
                message: 'Failed to delete student of user. Please try again later.'
            });
        }

    }

    static async searchPage(req, res) {
        try {
            logger.info("searchPage method got called in studentController");
            res.render('search', {
                layout: 'main',
                title: 'Search Student Page',
            });

        } catch (error) {
            logger.error("Error in searchStudentController:", error.message);
            return res.status(500).json({
                message: 'Failed to search student of user. Please try again later.'
            });
        }

    }

    static async searchStudent(req, res) {
        try {
            logger.info("searchStudent method got called in studentController");
            let { mssv, name } = req.query;
            
            let listStudent = await studentModel.searchStudent(mssv, name);
            return res.json(listStudent);

        } catch (error) {
            logger.error("Error in searchStudentController:", error.message);
            return res.status(500).json({
                message: 'Failed to search student of user. Please try again later.'
            });
        }

    }

    //
    static async updateStudentPage(req, res) {
        try {
            logger.info("updateStudentPage method got called in studentController");
            res.render('update', {
                title: 'Update Student Page'
            })
        }
        catch (error) {
            logger.error("Error in updateStudent:", error.message);
            return res.status(500).json({
                message: 'Student non existed.'
            });
        }
    }

    static async updateStudent(req, res) {
        logger.info("updateStudentPage method got called in studentController");
        const newStudent = {
            mssv: req.body.mssv,
            name: req.body.name,
            dob: req.body.dob,
            gender: req.body.gender,
            faculty: req.body.faculty,
            course: req.body.course,
            program: req.body.program,
            address: req.body.address,
            email: req.body.email,
            phone: req.body.phone,
            status: req.body.status
        }

        if (!newStudent.mssv || 
            !newStudent.name || 
            !newStudent.dob || 
            !newStudent.gender || 
            !newStudent.faculty || 
            !newStudent.course || 
            !newStudent.program ||
            !newStudent.address || 
            !newStudent.email || 
            !newStudent.phone || 
            !newStudent.status) {
            logger.warn("Not enough parameters when updating student");
            return res.status(400).json({
                error: 'All information fields are required'
            });
        }

        try {
            let listStudent = await studentModel.searchStudent(newStudent.mssv);
            if (!listStudent || listStudent.length === 0){
                logger.warn("Not corressponding student with specified ID");
                return res.status(404).json({
                    message: 'No student with corressponding id'
                })
            }
        } catch (error) {
            logger.error("Error in update(searching)StudentController:", error.message);
            return res.status(500).json({
                message: 'Failed to search while updating student of user. Please try again later.'
            });
        }

        try {
            let result = await studentModel.updateStudent(newStudent);
        }
        catch(error){
            logger.error("Error in updateStudentController:", error.message);
            return res.status(500).json({
                message: 'Failed to update student of user. Please try again later.'
            });

        }

        return res.status(200).json({
            message: "Update success"
        })
    }
}

module.exports = studentController;
