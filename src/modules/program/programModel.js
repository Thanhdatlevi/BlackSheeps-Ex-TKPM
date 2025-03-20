const {query} = require('express');
const db = require("../../config/db");
const logger = require('../../config/logging')

class programModel{
    static async addProgram(program_name){
        try {
            const query = `
            INSERT INTO public.education_programs (program_name)
            VAlUES ($1)
            RETURNING *;
            `
            const result = await db.query(query, [program_name]);
            if (result.rows.length > 0){
                logger.info("addProgram executed successfully in programModel");
                logger.info(result.rows[0]);
                return result.rows[0];
            }

            return null;
        }
        catch (error){
            logger.error("Error add Program in programModel:", error.message);
            throw new Error(error.message);
        }
    }
    static async searchProgramByName(program_name){
        try {
            const query = `
            SELECT * FROM public.education_programs
            WHERE program_name = $1;
            `;
            const result = await db.query(query, [program_name]);

            if (result.rows.length > 0){
                logger.info("searchProgramByName executed successfully in programModel");
                logger.info(result.rows[0]);
                return result.rows[0];
            }

            return null;
        }
        catch (error){
            logger.error("Error search Program in prograModel:", error.message);
            throw new Error(error.message);
        }
    }
    static async updateProgram(program){
        try {
            const query = `
            UPDATE public.education_programs
            SET program_name = $1
            WHERE program_id = $2
            RETURNING *;
            `;
            const result = await db.query( query, [program.program_name, program.program_id]);
            if ( result.rows.length > 0){
                logger.info("updateProgram executed successfully in programModel");
                logger.info(result.rows[0]);
                return result.rows[0];
            }
            return null;
        }
        catch (error){
            logger.error("Error updating Program in programModel:", error.message);
            throw new Error(error.message);
        }
    }
    static async getAllPrograms(){
        try {
            const query = `
            SELECT * FROM public.education_programs;
            `;
            const result = await db.query(query);
            logger.info("getAllPrograms executed successfully in programModel");
            logger.info(result.rows);
            return result.rows;
        }
        catch (error){
            logger.error("Error get all Programs in programModel:", error.message);
            throw new Error(error.message);
        }
    }
}
module.exports = programModel;