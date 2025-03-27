const { query } = require("express");
const db = require("../../config/db");
const logger = require("../../config/logging");
const { updateStudent } = require("./studentController");

class studentModel {

    static async searchStudent(mssv, name, khoa) {
        try {
            const query = `
            SELECT 
                s.student_id,
                s.full_name,
                to_char(s.date_of_birth, 'yyyy-mm-dd') as date_of_birth,
                s.gender, 
                s.academic_year,
                s.email,
                s.phone,
                s.nationality,
                f.faculty_name as faculty,
                ep.program_name as education_program,
                ss.status_name as student_status
            FROM public.students s 
            JOIN faculties f ON f.faculty_id = s.faculty
            JOIN education_programs ep ON ep.program_id = s.education_program
            JOIN student_status ss ON ss.status_id = s.student_status
            WHERE 
                ($1::TEXT IS NULL OR s.student_id::TEXT = $1::TEXT) 
                AND ($2::TEXT IS NULL OR s.full_name ILIKE '%' || $2::TEXT || '%')
                AND ($3::INT IS NULL OR s.faculty = $3::INT);
            `;
    
            // Chuyển `khoa` từ string sang số hoặc null
            const khoaParsed = khoa ? parseInt(khoa, 10) : null;
    
            const result = await db.query(query, [mssv || null, name || null, khoaParsed]);
            
            if (result.rows.length > 0) {
                logger.info("searchStudent executed successfully in studentModel");
                return result.rows;
            }
            return [];
        } catch (error) {
            logger.error("Error search Student in studentModel:", error.message);
            throw new Error("Error search Student in studentModel.");
        }
    }
    

    static async searchStudentIdentification(mssv) {
        try {
            const query = `
            SELECT 
                si.student_id,
                si.id_type,
                si.id_number,
                to_char(si.issue_date, 'yyyy-mm-dd') as issue_date,
                si.issue_place,
                si.expiry_date,
                to_char(si.expiry_date, 'yyyy-mm-dd') as expiry_date,
                si.has_chip,
                si.issue_country,
                si.note
            FROM identificationdocument si
            WHERE ($1::TEXT IS NULL OR si.student_id::TEXT = $1::TEXT) 
            ORDER BY si.student_id
            `
            const result = await db.query(query, [mssv || null]);

            if (result.rows.length > 0) {
                logger.info("searchStudentIdentification executed successfully in studentModel");
                logger.info(result.rows);
                return result.rows;
            }
            return [];
        }
        catch (error) {
            logger.error("Error search Student Identification in studentModel:", error);
            throw new Error("Error search Student Identification in studentModel.");

        }
    }

    static async deleteStudent(mssv) {
        try {
            const query = `
            DELETE FROM students
            WHERE student_id = $1;
            `;
            await db.query(query, [mssv]);
        }
        catch (error) {
            logger.error("Error search Student in studentModel:", error);
            throw new Error("Error search Student in studentModel.");
        }
        logger.info("deleteStudent executed successfully in studentModel");
    }

    static async addStudent(student) {
        try {
            const query = `
            INSERT INTO public.students (student_id, full_name, date_of_birth, 
            gender, academic_year, address, email, phone, faculty, education_program, student_status) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *;
            `;
            const result = await db.query(query, [student.mssv, student.name,student.dob,
                student.gender, student.course, student.address, student.email, student.phone, student.faculty,
                student.program, student.status]);
            if (result.rows.length > 0) {
                logger.info("addStudent executed successfully in studentModel");
                return result.rows[0];
            }

            return null;
        }
        catch(error) {
            logger.error("Error add Student in studentModel:", error);
            throw new Error(error.message);
        }
    }

    static async updateStudent(student) {
        try {
            const getIDQuery = `
            SELECT ep.program_id, f.faculty_id, ss.status_id
            FROM education_programs ep
            JOIN faculties f ON 1=1
            JOIN student_status ss ON 1=1
            WHERE ep.program_name = $1
            AND f.faculty_name = $2
            AND ss.status_name = $3
            `
            const IDResult = await db.query(getIDQuery, 
                [
                    student.education_program,
                    student.faculty,
                    student.student_status
                ]
            );


            student.education_program = IDResult.rows[0].program_id;
            student.faculty = IDResult.rows[0].faculty_id;
            student.student_status = IDResult.rows[0].status_id;

            // update
            const query = `update public.students 
            set full_name = $1,
            date_of_birth = $2, 
            gender = $3,
            faculty = $4,
            academic_year = $5, 
            education_program = $6, 
            address = $7, 
            email = $8,
            phone = $9, 
            student_status = $10
            where student_id = $11
            returning *
            `;

            const result = await db.query(query, 
                [
                    student.full_name,
                    student.date_of_birth,
                    student.gender,
                    student.faculty,
                    student.academic_year,
                    student.education_program,
                    student.address,
                    student.email,
                    student.phone,
                    student.student_status,
                    student.student_id 
                ]
            );
            if (result.rows.length > 0) {
                logger.info(result.rows);
                logger.info("update student info executed successfully in studentmodel");
                return result.rows[0];
            }

        }
        catch(error) {
            logger.error("error updating student in studentmodel:", error);
            throw new Error(error.message);
        }
    }

}
module.exports = studentModel;
