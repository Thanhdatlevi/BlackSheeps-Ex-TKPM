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
                return result.rows[0];
            }

            return null;
        }
        catch(error) {
            console.error("Error add Student in studentModel:", error);
            throw new Error(error.message);
        }
    }

    static async updateStudent(student) {
        try {
            console.log(student.course);
            const query = `UPDATE public.students 
            SET full_name = $1,
            date_of_birth = $2, 
            gender = $3,
            faculty = $4,
            academic_year = $5, 
            education_program = $6, 
            address = $7, 
            email = $8,
            phone = $9, 
            student_status = $10
            WHERE student_id = $11
            RETURNING *
            `;
            const result = await db.query(query, [student.name,student.dob,
                student.gender, student.faculty, student.course,
                student.program, student.address, student.email, student.phone, student.status, student.mssv ]);
            if (result.rows.length > 0) {
                return result.rows[0];
            }
            return null;
        }
        catch(error) {
            console.error("Error updating Student in studentModel:", error);
            throw new Error(error.message);
        }
    }
}
module.exports = studentModel;
