const {query} = require('express');
const db = require("../../config/db");

class indentificationModel{
    static async addIdentification(info){
        try {
            const query = `
            INSERT INTO public.identificationdocument (student_id, id_type, id_number, issue_date, issue_place, expiry_date, has_chip, issue_country, note)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
            `;
            const result = await db.query(query, [info.student_id, info.id_type, info.id_number, info.issue_date, info.issue_place, info.expiry_date, info.has_chip, info.issue_country, info.note]);
            if (result.rows.length > 0){
                logger.info("addIdentification executed successfully in indentificationModel");
                logger.info(result.rows[0]);
                return result.rows[0];
            }

            return null;
        }
        catch(error){
            logger.error("Error add Identification in identificationModel:", error.message);
            throw new Error(error.message);
        }
    }
}

module.exports = indentificationModel;