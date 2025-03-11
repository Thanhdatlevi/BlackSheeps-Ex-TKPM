// const cartService = require("./cartService");
// const userService = require('../user/userService');
const db = require('../../database')
class studentController {

    static async addStudent(req, res) {
        try {
            res.render('add', {
                layout: 'main',
                title: 'Shopping Cart Page',
            });

        } catch (error) {
            console.error("Error in cartController:", error.message);
            return res.status(500).json({
                message: 'Failed to get cart items of user. Please try again later.'
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
        let mssv, hoten, gioitinh, khoaCN, namkhoa, chuongtrinh, diachi, email, sdt, tinhtrang = req.body;


        if (!mssv || !hoten || !gioitinh || !khoaCN || !namkhoa || !chuongtrinh ||
            !diachi || !email || !sdt || !tinhtrang) {
            return res.status(400).json({
                error: 'All information fields are required'
            });
        }

        queryStr = "SELECT sv.mssv FROM sinhvien sv WHERE mssv = ?"
        db.all(queryStr, [mssv], (err, rows) => {
            if (err || rows.length === 0) {
                return res.status(404).json({
                    error: 'No student found with corressponding mssv'
                });
            }
        });

        const stmt = db.prepare(
            "UPDATE sinhvien" +
            "SET hoten    = ?," +
            "gioitinh     = ?," +
            "khoaCN       = ?," +
            "namkhoa      = ?," +
            "chuongtrinh  = ?," +
            "diachi       = ?," +
            "email        = ?," +
            "sdt          = ?," +
            "tinhtrang    = ?," +
            "WHERE mssv   = ?"
        );

        stmt.run(hoten, gioitinh, khoaCN, namkhoa, chuongtrinh, diachi, email, sdt, tinhtrang, mssv, function(err) {
            if (err) {
                console.error('Error updating user:', err.message);
            } else {
                console.log(`A new user has been updated with ID: ${this.lastID}`);
            }
        });

        stmt.finalize();

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
