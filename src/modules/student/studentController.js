const studentModel = require('../student/studentModel');
const emailModel = require('../email/emailModel');
// TODO: migrating these api controller to address controller
const addressModel = require('../address/addressModel');
const indentificationModel = require('../identification/identificationModel');

const facultyModel = require('../faculty/facultyModel');
const programModel = require('../program/programModel');
const statusModel = require('../status/statusModel');

const logger = require('../../config/logging')

const fastCsv = require('fast-csv');
const XLSX = require("xlsx");
const csv = require("csv-parser");
const fs = require("fs");
class studentController {

    static async addPage(req, res) {
        try {
            logger.info("addPage method got called in studentController");
            const emailDomains = await emailModel.getAllEmails();
            res.render('add', {
                layout: 'main',
                title: 'Add Student Page',
                allowedDomains: emailDomains.map(domain => domain.email_domain)
            });
        } catch (error) {
            logger.error("Error in addStudentController:", error.message);
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
            let { mssv, name, khoa } = req.query;
    
            // Lấy danh sách sinh viên
            let students = await studentModel.searchStudent(mssv, name, khoa);
            if (!students || students.length === 0) {
                logger.error("No students found");
                return res.status(404).json({ message: 'No students found' });
            }
    
            // Lấy thông tin giấy tờ và địa chỉ cho từng sinh viên
            let results = await Promise.all(students.map(async (student) => {
                let studentID = student.student_id; // Lấy MSSV của từng sinh viên
    
                let identification = await indentificationModel.getIdentification(studentID);
                let permanentAddress = await addressModel.getPermanentAddress(studentID);
                let temporaryAddress = await addressModel.getTemporaryAddress(studentID);
                let mailingAddress = await addressModel.getMailingAddress(studentID);
    
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
                message: 'Failed to search students. Please try again later.'
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
        logger.info("updateStudent method got called in studentController");

        const newStudent = {
            mssv: req.body.mssv,
            name: req.body.name,
            dob: req.body.dob,
            gender: req.body.gender,
            faculty: req.body.faculty,
            course: req.body.course,
            program: req.body.program,
            email: req.body.email,
            phone: req.body.phone,
            status: req.body.status,
            id_type: req.body.id_type,
            id_number: req.body.id_number,
            issue_date: req.body.issue_date,
            issue_place: req.body.issue_place,
            expire_date: req.body.expire_date,
            card_chip: req.body.card_chip,
            issue_country: req.body.issue_country,
            note: req.body.note,
            // TODO: move these to ID controller and address controller 
            permanent_address : req.body.permanent_address,
            temprary_address : req.body.temprary_address,
            
        }

        if (!newStudent.mssv ||
            !newStudent.name ||
            !newStudent.dob ||
            !newStudent.gender ||
            !newStudent.faculty ||
            !newStudent.course ||
            !newStudent.program ||
            !newStudent.email ||
            !newStudent.phone ||
            !newStudent.status ||
            !newStudent.id_type ||
            !newStudent.id_number ||
            !newStudent.issue_date ||
            !newStudent.issue_place ||
            !newStudent.expire_date
        ) {
            logger.warn("Not enough parameters when updating student");
            return res.status(400).json({
                error: 'All information fields are required'
            });
        }


        // console.log(newStudent)
        if (newStudent.id_type != 'CCCD') {
            newStudent.card_chip = 'NULL'
        }

        if (newStudent.id_type == 'passport' &&
            (!newStudent.issue_country || newStudent.issue_country == '')
        ) {
            logger.warn("Not exists country parameters for passport when updating student");
            return res.status(400).json({
                error: 'Hộ chiếu phải có thông tin quốc tịch'
            });
        }
        else {
            newStudent.issue_country = '' 
        }

        try {
            let listStudent = await studentModel.searchStudent(newStudent.mssv);
            if (!listStudent || listStudent.length === 0) {
                logger.warn("Not corressponding student with specified ID");
                return res.status(404).json({
                    message: 'No student with corressponding id'
                })
            }

            let listStudentID = await studentModel.searchStudentIdentification(newStudent.mssv);
            if (!listStudent || listStudent.length === 0) {
                logger.warn("Not corressponding student identification details with specified ID");
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

        // TODO: refactor this controller to a different controller
        try {
            if (newStudent.permanent_address !== undefined){
                let result = await addressModel.updateAddress(newStudent.permanent_address)
            }

            if (newStudent.temprary_address !== undefined){
                let result2 = await addressModel.updateAddress(newStudent.temprary_address)
            }
        }
        catch (error) {
            logger.error("Error in updateStudentController address:", error.message);
            return res.status(500).json({
                message: 'Failed to update student of user 1. Please try again later.'
            });
        }

        try {
            let result = await studentModel.updateStudent(newStudent);
        }
        catch (error) {
            logger.error("Error in updateStudentController:", error.message);
            return res.status(500).json({
                message: 'Failed to update student of user 2. Please try again later.'
            });
        }

        return res.status(200).json({
            message: "Update success"
        })
    }

    static async exportData(req, res, fetchData, fileName, format) {
        try {
            // Lấy danh sách sinh viên
            const students = await fetchData();
            if (!Array.isArray(students) || students.length === 0) {
                logger.warn(`Không có dữ liệu để xuất: ${fileName}`);
                return res.status(404).send(`Không có dữ liệu để xuất: ${fileName}`);
            }
    
            // Định dạng địa chỉ
            const formatAddress = (address) =>
                (address)
                    ? `${address.street_address|| ''}, ${address.ward || ''}, ${address.district || ''}, ${address.city || ''}, ${address.country || ''}`.trim()
                    : '';
    
            // Lấy thông tin bổ sung từng sinh viên
            const studentData = [];
            for (const student of students) {
                const identifications = await indentificationModel.getIdentification(student.student_id);
                const permanentAddress = await addressModel.getPermanentAddress(student.student_id);
                const temporaryAddress = await addressModel.getTemporaryAddress(student.student_id);
                const mailingAddress = await addressModel.getMailingAddress(student.student_id);

                studentData.push({
                    ...student,
                    permanentAddress: formatAddress(permanentAddress),
                    temporaryAddress: formatAddress(temporaryAddress),
                    mailingAddress: formatAddress(mailingAddress),
                    ...identifications
                });
            }
    
            // Xử lý xuất CSV
            if (format === "csv") {
                res.setHeader("Content-Disposition", `attachment; filename=${fileName}.csv`);
                res.setHeader("Content-Type", "text/csv");
                const csvStream = fastCsv.format({ headers: true });
                csvStream.pipe(res);
    
                studentData.forEach((row) => {
                    csvStream.write(row);
                });
    
                csvStream.end();
            }
            // Xử lý xuất Excel
            else if (format === "excel") {
                res.setHeader("Content-Disposition", `attachment; filename=${fileName}.xlsx`);
                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    
                const worksheetData = studentData.map(row => (row));
    
                const workbook = XLSX.utils.book_new();
                const worksheet = XLSX.utils.json_to_sheet(worksheetData);
                XLSX.utils.book_append_sheet(workbook, worksheet, "SinhVien");
    
                const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
                res.end(buffer);
            }
            // Định dạng không hợp lệ
            else {
                logger.warn("Định dạng không hợp lệ, chỉ hỗ trợ CSV và Excel.");
                return res.status(400).send("Định dạng không hợp lệ. Chỉ hỗ trợ CSV và Excel.");
            }
        } catch (error) {
            logger.error("Lỗi khi xuất dữ liệu:", error.message);
            res.status(500).send("Lỗi xuất dữ liệu");
        }
    }

    static async exportStudentListCSV(req, res) {
        logger.info("Xuất danh sách sinh viên CSV");
        return studentController.exportData(req, res, studentModel.searchStudent, "students", "csv");
    }
    
    static async exportStudentListExcel(req, res) {
        logger.info("Xuất danh sách sinh viên Excel");
        return studentController.exportData(req, res, studentModel.searchStudent, "students", "excel");
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
        
            if (typeof dateStr === "number") {
                const date = new Date((dateStr - 25569) * 86400000);
                return date.toISOString().split("T")[0];
            }
        
            if (typeof dateStr === "string") {
                const date = new Date(dateStr);
                if (!isNaN(date.getTime())) {
                    return date.toISOString().split("T")[0];
                }
            }
        
            return null;
        };

        for (const student of studentData) {
            if (typeof student.faculty === "string") {
                const faculty = await facultyModel.searchFacultyByName(student.faculty);
                student.faculty = faculty ? faculty.faculty_id : null;
            }
            if (typeof student.education_program === "string") {
                const program = await programModel.searchProgramByName(student.education_program);
                student.education_program = program ? program.program_id : null;
            }
            if (typeof student.student_status === "string") {
                const status = await statusModel.searchStatusByName(student.student_status);
                student.student_status = status ? status.status_id : null;
            }
            await studentModel.addStudent({
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
            student.has_chip = student.has_chip === "true" ? true : student.has_chip === "false" ? false : null;
            student.issue_country = student.issue_country || null;
            student.note = student.note || null;
            student.issue_date = formatDate(student.issue_date);
            student.expiry_date = formatDate(student.expiry_date);
        
            await indentificationModel.addIdentification(student);
            
            const addressTypes = [
                { type: "thuongtru", address: student.permanentAddress },
                { type: "tamtru", address: student.temporaryAddress },
                { type: "nhanthu", address: student.mailingAddress }
            ];
    
            for (const addr of addressTypes) {
                if (addr.address) {
                    const [street, ward, district, city, country] = addr.address.split(", ");
                    await addressModel.addAddress({
                        student_id: student.student_id,
                        address_type: addr.type,
                        street_address: street,
                        ward,
                        district,
                        city,
                        country
                    });
                }
            }
        }
    }
}

module.exports = studentController;
