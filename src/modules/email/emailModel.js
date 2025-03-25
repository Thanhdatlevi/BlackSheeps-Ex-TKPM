const {query} = require ('express');
const db = require("../../config/db");
const logger = require('../../config/logging')
class emailModel {
    static async addEmail(email){
        try {
            const query = `
            INSERT INTO public.allowed_email_domains (email_domain)
            VALUES ($1)
            RETURNING *;
            `;
            const result = await db.query(query, [email]);
            if (result.rows.length > 0){
                logger.info("addEmail executed successfully in emailModel");
                logger.info(result.rows[0]);
                return result.rows[0];
            }
            return null;
        }
        catch(error){
            logger.error("Error add Email in emailModel:", error.message);
            throw new Error(error.message);
        }
    }
    static async searchEmail(email){
        try {
            const query = `
            SELECT * FROM public.allowed_email_domains
            WHERE email = $1
            ;
            `;
            const result = await db.query(query, [email]);
            if (result.rows.length > 0){
                logger.info("searchEmail executed successfully in emailModel");
                logger.info(result.rows);
                return result.rows;
            }
            return null;
        }
        catch(error){
            logger.error("Error search Email in emailModel:", error.message);
            throw new Error(error.message);
        }
    }
    static async updateEmail(email){
        try {
            const query = `
            UPDATE public.allowed_email_domains
            SET email_domain = $1
            WHERE email_id = $2
            RETURNING *;
            `;
            const result = await db.query(query, [email.email_domain, email.email_id]);
            if (result.rows.length > 0){
                logger.info("updateEmail executed successfully in emailModel");
                logger.info(result.rows[0]);
                return result.rows[0];
            }
            return null;
        }
        catch(error){
            logger.error("Error update Email in emailModel:", error.message);
            throw new Error(error.message);
        }
    }
    static async getAllEmails(){
        try {
            const query = `
            SELECT * FROM public.allowed_email_domains;
            `;
            const result = await db.query(query);
            if (result.rows.length > 0){
                logger.info("getAllEmails executed successfully in emailModel");
                logger.info(result.rows);
                return result.rows;
            }
            return null;
        }
        catch(error){
            logger.error("Error get All Emails in emailModel:", error.message);
            throw new Error(error.message);
        }
    }
    static async deleteEmail(email_id){
        try {
            const query = `
            DELETE FROM public.allowed_email_domains
            WHERE email_id = $1
            RETURNING *;
            `;
            const result = await db.query(query, [email_id]);
            if (result.rows.length > 0){
                logger.info("deleteEmail executed successfully in emailModel");
                logger.info(result.rows[0]);
                return result.rows[0];
            }
            return null;
        }
        catch(error){
            logger.error("Error delete Email in emailModel:", error.message);
            throw new Error(error.message);
        }
    }
}

module.exports = emailModel;