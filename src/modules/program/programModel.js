const {query} = require('express');
const db = require("../../config/db");

class programModel{
    static async addProgram(program){
        try {
            const query = `
            INSERT INTO public.education_programs (program_id, program_name)
            VAlUES ($1, $2)
            RETURNING *;
            `
            const result = await db.query(query, [program.program_id, program.program_name]);
            if (result.rows.length > 0){
                return result.rows[0];
            }

            return null;
        }
        catch (error){
            console.error("Error add Program in programModel:", error);
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
                return result.rows[0];
            }

            return null;
        }
        catch (error){
            console.error("Error search Program in prograModel:", error);
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
                return result.rows[0];
            }
            return null;
        }
        catch (error){
            console.error("Error updating Program in programModel:", error);
            throw new Error(error.message);
        }
    }
    static async getAllPrograms(){
        try {
            const query = `
            SELECT * FROM public.education_programs;
            `;
            const result = await db.query(query);
            return result.rows;
        }
        catch (error){
            console.error("Error get all Programs in programModel:", error);
            throw new Error(error.message);
        }
    }
}
module.exports = programModel;