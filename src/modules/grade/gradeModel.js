const {query} = require('express');
const db = require('../../config/db');
const logger = require('../../config/logging')

class registrationModel{
    static async getStudentGrades(student_id,lang) {
        if(lang==="en") lang+="_";
        else lang = "";

        try {
            const query = `
                SELECT DISTINCT ON (rs.student_id, rs.course_id) 
                    rs.student_id, 
                    rs.course_id, 
                    c.${lang}course_name, 
                    c.credit, 
                    rs.grade,
                    rs.year,
                    rs.semester
                FROM register_subject rs
                JOIN course c ON rs.course_id = c.course_id
                WHERE rs.student_id = $1 
                AND rs.grade IS NOT NULL 
                AND rs.grade > 5
                ORDER BY rs.student_id, rs.course_id, rs.year DESC, rs.semester DESC;
            `;
            const result = await db.query(query, [student_id]);
            if (result.rows.length > 0) {
                logger.info("Found grade for student:", student_id);
                return { message: "Danh sách điểm được tìm thấy.", grades: result.rows };
            }
    
            return { message: "Không tìm thấy điểm nào.", grades: [] };

        } catch (error) {
            logger.error("Error get grade student:", error);
            return { message: "Lỗi hệ thống khi lấy điểm của sinh viên.", data: [] };
        }
    }
}
module.exports = registrationModel;