const { query } = require("express");
const db = require("../../config/db");

class cartModel {

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
}

module.exports = cartModel;