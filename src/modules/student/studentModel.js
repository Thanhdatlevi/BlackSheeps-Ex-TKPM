const { query } = require("express");
const db = require("../../config/db");

class studentModel {

    static async searchStudent(mssv, name) {
        try {
            const query = `
            SELECT * 
            FROM public.students s
            WHERE ($1::TEXT IS NULL OR s.student_id::TEXT = $1::TEXT) 
            AND ($2::TEXT IS NULL OR s.full_name ILIKE '%' || $2::TEXT || '%');
            `;
            const result = await db.query(query, [mssv || null, name || null]);
            if (result.rows.length > 0) {
                return result.rows;
            }

            return [];
        }
        catch (error) {
            console.error("Error search Student in studentModel:", error);
            throw new Error("Error search Student in studentModel.");
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
            console.error("Error search Student in studentModel:", error);
            throw new Error("Error search Student in studentModel.");
        }
    }
}

    static async addStudent(student) {
        try {
            const query = `
            INSERT INTO public.students (student_id, full_name,date_of_birth, 
            gender, faculty, academic_year, education_program, address, email, phone, student_status) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *;
            `;
            const result = await db.query(query, [student.mssv, student.name,student.dob,
                student.gender, student.faculty, student.course,
                student.program, student.address, student.email, student.phone, student.status]);
            if (result.rows.length > 0) {
                return result.rows[0];
            }

            return null;
        }
        catch(error) {
            console.error("Error add Student in studentModel:", error);
            throw new Error(error.message);
        }
    }
}
module.exports = studentModel;