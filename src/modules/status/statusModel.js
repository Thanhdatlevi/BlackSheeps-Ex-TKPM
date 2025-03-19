const {query} = require('express');
const db = require("../../config/db");

class statusModel {
    static async addStatus(status){
        try {
            const query = `
            INSERT INTO public.student_status (status_id, status_name)
            VALUES ($1,$2)
            RETURNING *;
            `;
            const result = await db.query(query, [status.status_id, status.status_name]);
            if (result.rows.length > 0) {
                return result.rows[0];
            }

            return null;
        }
        catch (error){
            console.error("Error add Status in statusModel:", error);
            throw new Error(error.message);
        }
    }
    static async searchStatusByName(status_name){
        try {
            const query = `
            SELECT * FROM public.student_status
            WHERE status_name = $1
            ;
            `;
            const result = await db.query(query, [status_name]);
            if ( result.rows.length > 0){
                return result.rows[0];
            }
            return null;
        }
        catch (error){
            console.error("Error search Status in statusModel:", error);
            throw new Error(error.message);
        }
    }
    static async updateStatus(status){
        try {
            const query = `
            UPDATE public.student_status
            SET status_name = $2
            WHERE status_id = $1
            RETURNING *;
            `;
            const result = await db.query(query, [status.status_id,status.status_name]);
            if (result.rows.length > 0){
                return result.rows[0];
            }

            return null;
        }
        catch (error){
            console.error("Error updating Status in statusModel:", error);
            throw new Error(error.mesage);
        }
    }
    static async getAllStatus(){
        try {
            const query = `
            SELECT * FROM public.student_status;
            `;
            const result = await db.query(query);
            return result.rows;
        }
        catch (error){
            console.error("Error getting all Status in statusModel:", error);
            throw new Error(error.message);
        }
    }
}
module.exports =statusModel;