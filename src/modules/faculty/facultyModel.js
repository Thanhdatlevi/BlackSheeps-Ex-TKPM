const {query} = require('express');
const db = require('../../config/db');
const logger = require('../../config/logging')

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
                logger.info("addFaculty executed successfully in facultyModel");
                logger.info(result.rows[0]);
                return result.rows[0];
            }

            return null;
        }
        catch(error){
            logger.error("Error add Faculty in facultyModel:", error.message);
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
                logger.info("searchFacultyByName executed successfully in facultyModel");
                logger.info(result.rows);
                console.log(result.rows)
                return result.rows;
            }
            return null;
        }
        catch(error){
            logger.error("Error search Faculty in facultyModel:", error.message);
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
                logger.info("updateFaculty executed successfully in facultyModel");
                logger.info(result.rows[0]);
                return result.rows[0];
            }
            return null;
        }
        catch(error){
            logger.error("Error updating Faculty in facultyModel:", error.message);
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
                logger.info("getAllFaculties executed successfully in facultyModel");
                logger.info(result.rows);
                return result.rows;
            }
            return null;
        }
        catch(error){
            logger.error("Error get all Faculties in facultyModel:", error.message);
            throw new Error(error.message);
        }
    }
}
module.exports = facultyModel;