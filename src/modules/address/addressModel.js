const {query} = require('express');
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
                return result.rows[0];
            }

            return null;
        }
        catch(error){
            console.error("Error add Address in addressModel:", error);
            throw new Error(error.message);
        }
    }
}

module.exports = addressModel;