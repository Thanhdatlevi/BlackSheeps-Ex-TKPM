const gradeModel = require('../grade/gradeModel');
const studentModel = require('../student/studentModel');
const logger = require('../../config/logging');
const XLSX = require("xlsx");
class gradeController {
    static async gradePage(req,res){
        try {
            logger.info("gradePage method got called in programController");
            res.render ('grade',{
                lauout: 'main',
                title: 'Grade of student',
            });
        } catch (error) {
            logger.error("Error in gradeController:", error);
            return res.status(500).json({
                message: "Failed to gradePage of user. PLease try again later"
            });
        }
    }

    static async searchGrade(req,res){
        try {
            const student_id = req.query.student_id;
            const grades = await gradeModel.getStudentGrades(student_id);
            return res.status(200).json(grades);
        }
        catch (error){
            logger.error("Error in gradeController:", error);
            return res.status(500).json({
                message: "Lỗi khi tìm điểm của sinh viên. Vui lòng thử lại sau.",
                data: []
            });
        }
    }

    static async exportStudentGrades(req, res) {
        try {
            const student_id = req.query.student_id;
            if (!student_id) {
                return res.status(400).send("Thiếu mã số sinh viên.");
            }

            let studentData = await gradeModel.getStudentGrades(student_id);
            studentData = studentData.grades;

            let studentInformation = await studentModel.searchStudent(student_id);
            studentInformation =studentInformation[0];
            if (!studentData || studentData.length === 0) {
                logger.warn(`Không tìm thấy dữ liệu điểm của sinh viên ${student_id}`);
                return res.status(404).send("Không tìm thấy dữ liệu điểm của sinh viên.");
            }

            // Tính GPA
            let totalCredits = 0;
            let weightedSum = 0;
            studentData.forEach(({ credit, grade }) => {
                totalCredits += credit;
                weightedSum += grade * credit;
            });
            const gpa = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : "0.00";

            // Chuẩn bị dữ liệu cho file Excel
            const worksheetData = [
                ["BẢNG ĐIỂM SINH VIÊN"],
                [],
                ["Mã sinh viên:", student_id],
                ["Họ tên:", studentInformation.full_name],
                ["Khóa:", studentInformation.academic_year],
                ["Chuyên ngành:", studentInformation.faculty],
                ["GPA:", gpa],
                [],
                ["Mã môn", "Tên môn học", "Số tín chỉ", "Điểm số"],
                ...studentData.map(({ course_id, course_name, credit, grade }) => [course_id, course_name, credit, grade])
            ];

            // Tạo workbook và worksheet
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

            // Thêm sheet vào workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, "Bảng điểm");

            // Xuất file
            res.setHeader("Content-Disposition", `attachment; filename=bang_diem_${student_id}.xlsx`);
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

            const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
            res.end(buffer);
        } catch (error) {
            logger.error("Lỗi khi xuất bảng điểm:", error);
            res.status(500).send("Lỗi khi xuất bảng điểm.");
        }
    }
}

module.exports = gradeController;