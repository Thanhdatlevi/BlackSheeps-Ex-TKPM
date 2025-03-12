const studentModel = require('../student/studentModel');
const db = require('../../public/js/database')
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
            // Kiểm tra định dạng email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newStudent.email)) {
                return res.status(400).json({ message: "Email không hợp lệ!" });
            }

            // Kiểm tra định dạng số điện thoại
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(newStudent.phone)) {
                return res.status(400).json({ message: "Số điện thoại không hợp lệ!" });
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
        let {mssv, hoten,ngaysinh, gioitinh, khoaCN, namkhoa, chuongtrinh, diachi, email, sdt, tinhtrang} = req.body;

        if (!mssv || !ngaysinh || !hoten || !gioitinh || !khoaCN || !namkhoa || !chuongtrinh ||
            !diachi || !email || !sdt || !tinhtrang) {
            return res.status(400).json({
                error: 'All information fields are required'
            });
        }

        const queryStr = "SELECT sv.mssv FROM sinhvien sv WHERE mssv = ?"
        db.all(queryStr, [mssv], (err, rows) => {
            if (err || rows.length === 0) {
                return res.status(404).json({
                    error: 'No student found with corressponding mssv'
                });
            }
        });

        const stmt = db.prepare(
            "UPDATE sinhvien  " +
            "SET hoten    = ?," +
            "gioitinh     = ?," +
            "khoaCN       = ?," +
            "namkhoa      = ?," +
            "chuongtrinh  = ?," +
            "diachi       = ?," +
            "email        = ?," +
            "sdt          = ?," +
            "tinhtrang    = ? " +
            "WHERE mssv   = ?"
        );

        stmt.run(hoten, gioitinh, khoaCN, namkhoa, chuongtrinh, diachi, email, sdt, tinhtrang, mssv, function(err) {
            if (err) {
                console.error('Error updating user:', err.message);
            } else {
                console.log(`A new student has been updated with ID: ${mssv}`);
            }
        });

        stmt.finalize();
        return res.status(200).json({
            message: "Update success"
        })

    }

    static async updateQueryStudent(req, res) {

        const { mssv } = req.params;
        const queryStr = "SELECT * FROM sinhvien sv WHERE mssv = ?"
        db.all(queryStr, [mssv], (err, rows) => {
            if (err || rows.length === 0) {
                return res.status(404).json({
                    error: 'No student found with corressponding mssv'
                });
            }
            else {
                // console.log(rows);
                return res.status(200).json(rows);
            }
        });
    }
}

module.exports = studentController;
