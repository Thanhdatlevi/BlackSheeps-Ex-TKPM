const {query} = require('express');
const db = require("../../config/db");

class facultyModel {
    static async addFaculty(faculty_name){
        try {
            const query = `
            INSERT INTO public.faculties (faculty_name)
            VALUES ($1)
            RETURNING *;
            `;
            const result = await db.query(query, [faculty_name]);
            if (result.rows.length > 0){
                return result.rows[0];
            }

            return null;
        }
        catch(error){
            console.error("Error add Faculty in facultyModel:", error);
            throw new Error(error.message);
        }
    }
    static async searchFacultyByName(faculty_name){
        try {
            const query = `
            SELECT * FROM public.faculties
            WHERE faculty_name = $1
            ;
            `;
            const result = await db.query(query, [faculty_name]);
            if (result.rows.length > 0){
                return result.rows;
            }
            return null;
        }
        catch(error){
            console.error("Error search Faculty in facultyModel:", error);
            throw new Error(error.message);
        }
    }
    static async updateFaculty(faculty){
        try {
            const query = `
            UPDATE public.faculties
            SET faculty_name = $1
            WHERE faculty_id = $2
            RETURNING *;
            `;
            const result = await db.query(query, [faculty.faculty_name, faculty.faculty_id]);
            if (result.rows.length > 0){
                return result.rows[0];
            }
            return null;
        }
        catch(error){
            console.error("Error updating Faculty in facultyModel:", error);
            throw new Error(error.message);
        }
    }
    static async getAllFaculties(){
        try {
            const query = `
            SELECT * FROM public.faculties;
            `;
            const result = await db.query(query);
            if (result.rows.length > 0){
                return result.rows;
            }
            return null;
        }
        catch(error){
            console.error("Error get all Faculties in facultyModel:", error);
            throw new Error(error.message);
        }
    }
}
module.exports = facultyModel;