const studentModel = require('../student/studentModel');
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
                    return res.status(400).json({
                        message: 'Student ID already exists. Please use a different ID.'
                    });
                }
                else if (error.message.includes('students_email_key')) {
                    return res.status(400).json({
                        message: 'Email already exists. Please use a different email.'
                    });
                }
                else if (error.message.includes('students_phone_key')) {
                    return res.status(400).json({
                        message: 'Phone number already exists. Please use a different phone number.'
                    });
                }
            }
            console.error("Error in addStudentController:", error.message);
            return res.status(500).json({
                message: 'Failed to add student. Please try again later.'
            });
        }

    }

    static async deletePage(req, res) {
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

    static async deleteStudent(req, res) {
        try {
            const { mssv } = req.body;
            const checkStudent = await studentModel.searchStudent(mssv);
        
            if (checkStudent.length === 0) {
                return res.status(404).json({ message: "Mã số sinh viên không tồn tại!" });
            }

            const deletedStudent = checkStudent[0];

            await studentModel.deleteStudent(mssv);

            return res.json({ message: "Xóa thành công!", deletedStudent });
        } catch (error) {
            console.error("Error in deleteStudentController:", error.message);
            return res.status(500).json({
                message: 'Failed to delete student of user. Please try again later.'
            });
        }

    }

    static async searchPage(req, res) {
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

    static async searchStudent(req, res) {
        try {
            let { mssv, name } = req.query;
            
            let listStudent = await studentModel.searchStudent(mssv, name);
            return res.json(listStudent);

        } catch (error) {
            console.error("Error in searchStudentController:", error.message);
            return res.status(500).json({
                message: 'Failed to search student of user. Please try again later.'
            });
        }

    }

    //
    static async updateStudentPage(req, res) {
        try {
            res.render('update', {
                title: 'Update Student Page'
            })
        }
        catch (error) {
            console.error("Error in updateStudent:", error.message);
            return res.status(500).json({
                message: 'Student non existed.'
            });
        }
    }

    static async updateStudent(req, res) {
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
            return res.status(400).json({
                error: 'All information fields are required'
            });
        }

        try {
            let listStudent = await studentModel.searchStudent(newStudent.mssv);
            if (!listStudent || listStudent.length === 0){
                return res.status(404).json({
                    message: 'No student with corressponding id'
                })
            }
        } catch (error) {
            console.error("Error in update(searching)StudentController:", error.message);
            return res.status(500).json({
                message: 'Failed to search while updating student of user. Please try again later.'
            });
        }

        try {
            let result = await studentModel.updateStudent(newStudent);
            console.log(result.status);
        }
        catch(error){
            console.error("Error in updateStudentController:", error.message);
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
