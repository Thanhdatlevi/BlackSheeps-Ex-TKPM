const {query} = require('express');
const db = require('../../config/db');
const logger = require('../../config/logging')

class registrationModel{
    static async searchdeleteRegistration(student_id) {
        try {
            const currentDate = new Date().toISOString().split('T')[0]; 
            const termQuery = `
                SELECT year, semester
                FROM term
                WHERE registration_end > $1
                LIMIT 1;
            `;
            const termResult = await db.query(termQuery, [currentDate]);
            if (termResult.rows.length === 0) {
                logger.warn("No active terms found.");
                return { message: "Không có học kỳ nào đang mở đăng ký.", data: [] };
            }
    
            const { year, semester } = termResult.rows[0];

            const registerQuery = `
                SELECT rs.student_id, rs.class_id, rs.course_id, rs.year, rs.semester
                FROM register_subject rs
                WHERE ($1::text IS NULL OR rs.student_id = $1)
                AND rs.year = $2
                AND rs.semester = $3;
            `;
            const result = await db.query(registerQuery, [student_id || null, year, semester]);
            
            if (result.rows.length > 0) {
                logger.info("Found registrations for student:", student_id);
                return { message: "Danh sách đăng ký được tìm thấy.", data: result.rows };
            }
    
            return { message: "Không tìm thấy danh sách đăng ký nào.", data: [] };
        } catch (error) {
            logger.error("Error searching for deleted registration:", error);
            return { message: "Lỗi hệ thống khi tìm danh sách đăng ký.", data: [] };
        }
    }

    static async deleteRegistration(registration) {
        try {
            const { student_id, class_id, course_id, year, semester } = registration;
            console.log(student_id, class_id, course_id, year, semester)
            const checkQuery = `
                SELECT * FROM public.register_subject
                WHERE student_id = $1 AND class_id = $2 AND course_id = $3 AND year = $4 AND semester = $5;
            `;
            const checkResult = await db.query(checkQuery, [student_id, class_id, course_id, year, semester]);
    
            if (checkResult.rows.length === 0) {
                logger.warn("No registration found to delete.");
                return { success: false, message: "Không tìm thấy đăng ký để xóa." };
            }
    
            const insertQuery = `
                INSERT INTO public.delete_register (student_id, class_id, course_id, year, semester, delete_time)
                VALUES ($1, $2, $3, $4, $5, NOW())
                RETURNING *;
            `;
            const insertResult = await db.query(insertQuery, [student_id, class_id, course_id, year, semester]);
    
            if (insertResult.rows.length === 0) {
                logger.error("Failed to save deleted registration before deletion.");
                return { success: false, message: "Lỗi khi sao lưu dữ liệu trước khi xóa." };
            }
    
            const deleteQuery = `
                DELETE FROM public.register_subject
                WHERE student_id = $1 AND class_id = $2 AND course_id = $3 AND year = $4 AND semester = $5
                RETURNING *;
            `;
            const deleteResult = await db.query(deleteQuery, [student_id, class_id, course_id, year, semester]);
    
            if (deleteResult.rows.length > 0) {
                logger.info("deleteRegistration executed successfully.");
                return {
                    success: true,
                    message: "Xóa đăng ký thành công.",
                    deletedRegistration: deleteResult.rows[0]
                };
            } else {
                logger.warn("Deletion failed.");
                return { success: false, message: "Không thể xóa đăng ký." };
            }
        } catch (error) {
            logger.error("Error deleting registration:", error.message);
            throw new Error(error.message);
        }
    }
}
module.exports = registrationModel;