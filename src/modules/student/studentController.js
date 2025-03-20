const studentModel = require('../student/studentModel');

const fastCsv = require('fast-csv');
const XLSX = require("xlsx");
const csv = require("csv-parser");
const fs = require("fs");
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
                status: req.body.status,
                address: req.body.permanent_street + ', ' + req.body.permanent_ward + ', ' + req.body.permanent_district + ', ' + req.body.permanent_city,
                email: req.body.email,
                phone: req.body.phone,
                
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
            let { mssv, name, khoa } = req.query;
            
            let listStudent = await studentModel.searchStudent(mssv, name, khoa);
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

    static async exportData(req, res, fetchData, fileName, format) {
        try {
            const data = await fetchData(); // Gọi hàm lấy dữ liệu

            if (!Array.isArray(data) || data.length === 0) {
                return res.status(404).send(`Không có dữ liệu để xuất: ${fileName}`);
            }

            if (format === "csv") {
                res.setHeader("Content-Disposition", `attachment; filename=${fileName}.csv`);
                res.setHeader("Content-Type", "text/csv");
                const csvStream = fastCsv.format({ headers: true });
                csvStream.pipe(res);
                data.forEach((row) => csvStream.write(row));
                csvStream.end();
            } else if (format === "excel") {
                res.setHeader("Content-Disposition", `attachment; filename=${fileName}.xlsx`);
                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

                const workbook = XLSX.utils.book_new();
                const worksheet = XLSX.utils.json_to_sheet(data);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

                const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
                res.end(buffer);
            } else {
                return res.status(400).send("Định dạng không hợp lệ. Chỉ hỗ trợ CSV và Excel.");
            }
        } catch (error) {
            console.error(`Lỗi xuất dữ liệu (${fileName} - ${format}):`, error);
            res.status(500).send("Lỗi xuất dữ liệu");
        }
    }

    static async exportStudentListCSV(req, res) {
        return studentController.exportData(req, res, studentModel.searchStudent, "students", "csv");
    }

    static async exportStudentListExcel(req, res) {
        return studentController.exportData(req, res, studentModel.searchStudent, "students", "excel");
    }

    static async exportIdentificationDocumentsCSV(req, res) {
        return studentController.exportData(req, res, studentModel.searchStudentIdentification, "identification_documents", "csv");
    }

    static async exportIdentificationDocumentsExcel(req, res) {
        return studentController.exportData(req, res, studentModel.searchStudentIdentification, "identification_documents", "excel");
    }

    static async importCSV(req, res) {
        try {
            if (!req.files || !req.files.studentFile || !req.files.docFile) {
                return res.status(400).json({ message: "Thiếu file cần thiết." });
            }

            const studentFile = req.files.studentFile;
            const docFile = req.files.docFile;

            // Lưu file tạm thời
            const studentPath = `uploads/${studentFile.name}`;
            const docPath = `uploads/${docFile.name}`;
            await studentFile.mv(studentPath);
            await docFile.mv(docPath);

            const studentData = [];
            const docData = [];

            // Đọc file CSV student
            fs.createReadStream(studentPath)
                .pipe(csv())
                .on("data", (row) => studentData.push(row))
                .on("end", async () => {
                    // Đọc file CSV docFile
                    fs.createReadStream(docPath)
                        .pipe(csv())
                        .on("data", (row) => docData.push(row))
                        .on("end", async () => {
                            await studentModel.importStudent(studentData);
                            await studentModel.importIdentificationDocuments(docData);
                            res.json({ message: "Import CSV thành công!" });

                            // Xoá file sau khi xử lý xong
                            fs.unlinkSync(studentPath);
                            fs.unlinkSync(docPath);
                        });
                });
        } catch (error) {
            console.error("Lỗi import CSV:", error);
            res.status(500).json({ message: "Lỗi import CSV" });
        }
    }

    // Xử lý import Excel
    static async importExcel(req, res) {
        try {
            if (!req.files || !req.files.studentFile || !req.files.docFile) {
                return res.status(400).json({ message: "Thiếu file cần thiết." });
            }

            const studentFile = req.files.studentFile;
            const docFile = req.files.docFile;

            // Lưu file tạm thời
            const studentPath = `uploads/${studentFile.name}`;
            const docPath = `uploads/${docFile.name}`;
            await studentFile.mv(studentPath);
            await docFile.mv(docPath);

            // Đọc file Excel student
            const studentWorkbook = XLSX.readFile(studentPath);
            const studentSheet = studentWorkbook.Sheets[studentWorkbook.SheetNames[0]];
            const studentData = XLSX.utils.sheet_to_json(studentSheet);

            // Đọc file Excel docFile
            const docWorkbook = XLSX.readFile(docPath);
            const docSheet = docWorkbook.Sheets[docWorkbook.SheetNames[0]];
            const docData = XLSX.utils.sheet_to_json(docSheet);

            await studentModel.importStudent(studentData);
            await studentModel.importIdentificationDocuments(docData);
            res.json({ message: "Import Excel thành công!" });

            // Xoá file sau khi xử lý xong
            fs.unlinkSync(studentPath);
            fs.unlinkSync(docPath);
        } catch (error) {
            console.error("Lỗi import Excel:", error);
            res.status(500).json({ message: "Lỗi import Excel" });
        }
    }
}

module.exports = studentController;
