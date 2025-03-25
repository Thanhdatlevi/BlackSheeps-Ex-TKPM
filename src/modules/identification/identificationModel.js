const {query} = require('express');
const db = require("../../config/db");
const logger = require('../../config/logging')

class indentificationModel{
    static async getIdentification(mssv){
        try {
            const query = `
            SELECT 
                si.student_id,
                si.id_type,
                si.id_number,
                to_char(si.issue_date, 'yyyy-mm-dd') AS issue_date,
                to_char(si.expiry_date, 'yyyy-mm-dd') AS expiry_date,
                si.issue_place,
                si.has_chip,
                si.issue_country,
                si.note
            FROM identificationdocument si
            WHERE si.student_id = $1;
            `;
            const result = await db.query(query, [mssv]);
            if (result.rows.length > 0){
                logger.info("getIdentification executed successfully in indentificationModel");
                logger.info(result.rows[0]);
                return result.rows[0];
            }

            return null;
        }
        catch(error){
            logger.error("Error get Identification in identificationModel:", error.message);
            throw new Error(error.message);
        }
    }

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