const {query} = require('express');
const logger = require('../../config/logging')
const db = require("../../config/db");
class addressModel{
    static async addAddress(info){
        try {
            const query = `
            INSERT INTO public.address (student_id, address_type, street_address, ward, district, city, country)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *;
            `;
            const result = await db.query(query, [info.student_id, info.address_type, info.street_address, info.ward, info.district, info.city, info.country]);
            if (result.rows.length > 0){
                logger.info("addAddress executed successfully in studentModel");
                return result.rows[0];
            }

            return null;
        }
        catch(error){
            logger.error("Error add Address studentModel:", error.message);
            throw new Error(error.message);
        }
    }
}

module.exports = addressModel;