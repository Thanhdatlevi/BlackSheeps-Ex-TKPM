const studentService = require('./studentService');
const facultyService = require('../faculty/facultyService');
const programService = require('../program/programService');
const statusService = require('../status/statusService');
const identificationService = require('../identification/identificationService');
const addressService = require('../address/addressService');
const logger = require('../../config/logging');
const fastCsv = require('fast-csv');
const XLSX = require("xlsx");
const csv = require("csv-parser");
const fs = require("fs");
class studentController {
    static async addPage(req, res) {
        try {
            logger.info("addPage method got called in studentController");
            res.render('add', {
                layout: 'main',
                title: 'Add Student Page',
            });
        } catch (error) {
            logger.error("Error in addStudentController:", error.message);
            return res.status(500).json({
                message: "Failed to add student. Please try again later."
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
                status: req.body.status,
                email: req.body.email,
                phone: req.body.phone,
            }

            const addedStudent = await studentService.addStudent(newStudent);

            if (addedStudent) {
                return res.status(201).json({
                    message: "Student added successfully",
                    student: addedStudent
                });
            } else {
                return res.status(500).json({
                    message: "Failed to add student. Please try again later."
                });
            }
        } catch (error) {
            if (error.message.includes("duplicate key value violates unique constraint")) {
                if (error.message.includes('students_pkey')) {
                    logger.warn("Error: Student ID already exists");
                    return res.status(400).json({
                        message: "Student ID already exists. Please use a different ID."
                    });
                }
            }
            logger.error("Error in addStudentController:", error.message);
            return res.status(500).json({
                message: "Failed to add student. Please try again later."
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
                message: "Failed to delete student of user. Please try again later."
            });
        }

    }

    static async deleteStudent(req, res) {
        try {
            logger.info("deleteStudent method got called in studentController");
            const { mssv } = req.body;
            console.log(mssv);
            const checkStudent = await studentService.searchStudent(mssv);
            console.log(checkStudent);
            if (checkStudent.length === 0) {
                logger.warn("StudentID not exists when deleting");
                return res.status(404).json({ message: "Mã số sinh viên không tồn tại!" });
            }

            const deletedStudent = checkStudent[0];

            await studentService.deleteStudent(mssv);

            return res.status(200).json({ message: "Xóa thành công!", deletedStudent });
        } catch (error) {
            logger.error("Error in deleteStudentController:", error.message);
            return res.status(500).json({
                message: "Failed to delete student of user. Please try again later."
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
                message: "Failed to search student of user. Please try again later."
            });
        }

    }

    static async searchStudent(req, res) {
        try {
            logger.info("searchStudent method got called in studentController");
            let { mssv, name, khoa } = req.query;
            console.log(mssv, name, khoa );
            // Lấy danh sách sinh viên
            let students = await studentService.searchStudent(mssv, name, khoa);
            console.log(students);
            if (!students || students.length === 0) {
                logger.error("No students found");
                return res.status(404).json({ message: 'No students found' });
            }

            // Lấy thông tin giấy tờ và địa chỉ cho từng sinh viên
            let results = await Promise.all(students.map(async (student) => {
                let studentID = student.student_id; // Lấy MSSV của từng sinh viên

                let identification = await identificationService.getIdentification(studentID);
                let permanentAddress = await addressService.getPermanentAddress(studentID);
                let temporaryAddress = await addressService.getTemporaryAddress(studentID);
                let mailingAddress = await addressService.getMailingAddress(studentID);

                return {
                    information: student,
                    ID_info: identification || undefined,
                    permanent_address: permanentAddress || undefined,
                    temporary_address: temporaryAddress || undefined,
                    mailing_address: mailingAddress || undefined
                };
            }));

            return res.json(results);

        } catch (error) {
            logger.error("Error in searchStudentController:", error);
            return res.status(500).json({
                message: "Failed to search students. Please try again later."
            });
        }
    }

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
                message: "Student non existed."
            });
        }
    }

    static async updateStudent(req, res) {
        // TODO: provide properties list to make sure students have enough
        
        logger.info("updateStudent method got called in studentController");

        const newStudent = req.body;
        logger.info(newStudent);

        for (const property in newStudent) {
            if (!newStudent[property] ||newStudent[property] == undefined) {
                logger.warn("Not enough parameters when updating student");
                return res.status(400).json({
                    error: "All information fields are required"
                });
            }
        }

        try {
            let result = await studentService.updateStudent(newStudent);
        }
        catch (error) {
            logger.error("Error in updateStudentController:", error.message);
            return res.status(500).json({
                message: error.message
            });
        }

        return res.status(200).json({
            message: "Update success"
        })
    }

    // Tách riêng việc lấy thông tin bổ sung cho sinh viên
    static async getStudentSupplementaryData(students) {
        const studentData = [];
        for (const student of students) {
            const [identifications, permanentAddress, temporaryAddress, mailingAddress] = await Promise.all([
                identificationService.getIdentification(student.student_id),
                addressService.getPermanentAddress(student.student_id),
                addressService.getTemporaryAddress(student.student_id),
                addressService.getMailingAddress(student.student_id)
            ]);

            studentData.push({
                ...student,
                permanentAddress: studentController.formatAddress(permanentAddress),
                temporaryAddress: studentController.formatAddress(temporaryAddress),
                mailingAddress: studentController.formatAddress(mailingAddress),
                ...identifications
            });
        }
        return studentData;
    }

    // Định dạng địa chỉ chung cho sinh viên
    static formatAddress(address) {
        return address ? `${address.street_address || ''}, ${address.ward || ''}, ${address.district || ''}, ${address.city || ''}, ${address.country || ''}`.trim() : '';
    }

    // Hàm xử lý xuất dữ liệu theo định dạng CSV hoặc Excel
    static async exportData(req, res, fetchData, fileName, format) {
        try {
            // Lấy danh sách sinh viên
            const students = await fetchData();
            if (!Array.isArray(students) || students.length === 0) {
                logger.warn(`Không có dữ liệu để xuất: ${fileName}`);
                return res.status(404).send(`Không có dữ liệu để xuất: ${fileName}`);
            }

            // Lấy thông tin bổ sung cho sinh viên
            const studentData = await studentController.getStudentSupplementaryData(students);

            // Xử lý xuất dữ liệu theo định dạng
            if (format === "csv") {
                return studentController.exportCSV(res, studentData, fileName);
            } else if (format === "excel") {
                return studentController.exportExcel(res, studentData, fileName);
            } else {
                logger.warn("Định dạng không hợp lệ, chỉ hỗ trợ CSV và Excel.");
                return res.status(400).send("Định dạng không hợp lệ. Chỉ hỗ trợ CSV và Excel.");
            }
        } catch (error) {
            logger.error("Lỗi khi xuất dữ liệu:", error.message);
            res.status(500).send("Lỗi xuất dữ liệu");
        }
    }

    // Hàm xử lý xuất CSV
    static exportCSV(res, studentData, fileName) {
        res.setHeader("Content-Disposition", `attachment; filename=${fileName}.csv`);
        res.setHeader("Content-Type", "text/csv");
        const csvStream = fastCsv.format({ headers: true });
        csvStream.pipe(res);

        studentData.forEach((row) => {
            csvStream.write(row);
        });

        csvStream.end();
    }

    // Hàm xử lý xuất Excel
    static exportExcel(res, studentData, fileName) {
        res.setHeader("Content-Disposition", `attachment; filename=${fileName}.xlsx`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        const worksheetData = studentData.map(row => (row));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "SinhVien");

        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
        res.end(buffer);
    }

    // Hàm xuất danh sách sinh viên CSV
    static async exportStudentListCSV(req, res) {
        logger.info("Xuất danh sách sinh viên CSV");
        return studentController.exportData(req, res, studentService.searchStudent, "students", "csv");
    }

    // Hàm xuất danh sách sinh viên Excel
    static async exportStudentListExcel(req, res) {
        logger.info("Xuất danh sách sinh viên Excel");
        return studentController.exportData(req, res, studentService.searchStudent, "students", "excel");
    }

    static async importCSV(req, res) {
        try {
            logger.info("importCSV method called in studentController");

            if (!req.files || !req.files.studentFile) {
                return res.status(400).json({ message: "Thiếu file cần thiết." });
            }

            const studentFile = req.files.studentFile;
            const studentPath = `uploads/${studentFile.name}`;
            await studentFile.mv(studentPath);

            const studentData = [];

            fs.createReadStream(studentPath)
                .pipe(csv())
                .on("data", (row) => studentData.push(row))
                .on("end", async () => {
                    await studentController.importStudentData(studentData);
                    fs.unlinkSync(studentPath);
                    res.json({ message: "Import CSV thành công!" });
                });
        } catch (error) {
            logger.error("Error in importCSVStudentController:", error);
            res.status(500).json({ message: "Lỗi import CSV" });
        }
    }

    // Xử lý import Excel
    static async importExcel(req, res) {
        try {
            logger.info("importExcel method called in studentController");

            if (!req.files || !req.files.studentFile) {
                return res.status(400).json({ message: "Thiếu file cần thiết." });
            }

            const studentFile = req.files.studentFile;
            const studentPath = `uploads/${studentFile.name}`;
            await studentFile.mv(studentPath);

            const studentWorkbook = XLSX.readFile(studentPath);
            const studentSheet = studentWorkbook.Sheets[studentWorkbook.SheetNames[0]];
            const studentData = XLSX.utils.sheet_to_json(studentSheet);

            await studentController.importStudentData(studentData);
            fs.unlinkSync(studentPath);
            res.json({ message: "Import Excel thành công!" });
        } catch (error) {
            logger.error("Error in importExcelStudentController:", error);
            res.status(500).json({ message: "Lỗi import Excel" });
        }
    }

    // Hàm chung để xử lý dữ liệu sinh viên từ file
    static async importStudentData(studentData) {

        //Định dạng ngày để ghi vào db
        const formatDate = (dateStr) => {
            if (!dateStr) return null;

            if (typeof dateStr === 'number') {
                const date = new Date((dateStr - 25569) * 86400000);
                return date.toISOString().split("T")[0];
            }

            if (typeof dateStr === 'string') {
                const date = new Date(dateStr);
                if (!isNaN(date.getTime())) {
                    return date.toISOString().split("T")[0];
                }
            }

            return null;
        };

        for (const student of studentData) {
            console.log(student.faculty, 394)
            if (typeof student.faculty === 'string') {
                const faculty = await facultyService.searchFacultyByName(student.faculty);
                console.log(faculty[0], 398)
                student.faculty = faculty ? faculty[0].faculty_id : null;
            }
            if (typeof student.education_program === 'string') {
                const program = await programService.searchProgramByName(student.education_program);
                student.education_program = program ? program.program_id : null;
            }
            if (typeof student.student_status === 'string') {
                const status = await statusService.searchStatusByName(student.student_status);
                student.student_status = status ? status.status_id : null;
            }
            await studentService.addStudent({
                mssv: student.student_id,
                name: student.full_name,
                dob: formatDate(student.date_of_birth),
                gender: student.gender,
                course: student.academic_year,
                address: student.address,
                email: student.email,
                phone: student.phone,
                faculty: student.faculty,
                program: student.education_program,
                status: student.student_status
            });
            // Xử lý dữ liệu rỗng thành null
            student.has_chip = student.has_chip === 'true' ? true : student.has_chip === 'false' ? false : null;
            student.issue_country = student.issue_country || null;
            student.note = student.note || null;
            student.issue_date = formatDate(student.issue_date);
            student.expiry_date = formatDate(student.expiry_date);

            await identificationService.addIdentification(student);

            await this.addAddressIfPresent(student, 'thuongtru', student.permanentAddress);
            await this.addAddressIfPresent(student, 'tamtru', student.temporaryAddress);
            await this.addAddressIfPresent(student, 'nhanthu', student.mailingAddress);
        }
    }
    static async addAddressIfPresent(student, type, addressString) {
        if (!addressString) return;

        const [street, ward, district, city, country] = addressString.split(",").map(s => s.trim());
        await addressService.addAddress({
            student_id: student.student_id,
            address_type: type,
            street_address: street || null,
            ward: ward || null,
            district: district || null,
            city: city || null,
            country: country || null
        });
    }

}

module.exports = studentController;
