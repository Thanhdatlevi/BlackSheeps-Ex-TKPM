const {query} = require('express');
const db = require("../../config/db");
const logger = require('../../config/logging')

class statusModel {
    static async addStatus(status_name){
        try {
            const query = `
            INSERT INTO public.student_status (status_name)
            VALUES ($1)
            RETURNING *;
            `;
            const result = await db.query(query, [status_name]);
            if (result.rows.length > 0) {
                logger.info("addStatus executed successfully in statusModel");
                logger.info(result.rows[0]);
                return result.rows[0];
            }

            return null;
        }
        catch (error){
            logger.error("Error add Status in statusModel:", error.message);
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
                logger.info("searchStatusByName executed successfully in statusModel");
                logger.info(result.rows[0]);
                return result.rows[0];
            }
            return null;
        }
        catch (error){
            logger.error("Error search Status in statusModel:", error.message);
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
                logger.info("updateStatus executed successfully in statusModel");
                logger.info(result.rows[0]);
                return result.rows[0];
            }

            return null;
        }
        catch (error){
            logger.error("Error updating Status in statusModel:", error.message);
            throw new Error(error.mesage);
        }
    }
    static async getAllStatus(){
        try {
            const query = `
            SELECT * FROM public.student_status;
            `;
            const result = await db.query(query);
            if (result.rows.length > 0){
                logger.info("getAllStatus executed successfully in statusModel");
                logger.info(result.rows);
                return result.rows;
            }
            return null;
        }
        catch (error){
            logger.error("Error getting all Status in statusModel:", error.message);
            throw new Error(error.message);
        }
    }
}
module.exports =statusModel;