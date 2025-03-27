const {query} = require('express');
const logger = require('../../config/logging')
const db = require('../../config/db');
class addressModel {
    static async getPermanentAddress(mssv) {
        try {
            const query = `
            SELECT 
                a.student_id,
                a.address_type,
                a.street_address,
                a.ward,
                a.district,
                a.city,
                a.country
            FROM public.address a
            WHERE a.student_id = $1 and a.address_type='thuongtru';
            `;
            const result = await db.query(query, [mssv]);
            if (result.rows.length > 0) {
                logger.info("getPermanentAddress executed successfully in addressModel");
                return result.rows[0];
            }

            return undefined;
        }
        catch (error) {
            logger.error("Error get PermanentAddress addressModel:", error.message);
            throw new Error(error.message);
        }
    }

    static async getTemporaryAddress(mssv) {
        try {
            const query = `
            SELECT 
                a.student_id,
                a.address_type,
                a.street_address,
                a.ward,
                a.district,
                a.city,
                a.country
            FROM public.address a
            WHERE a.student_id = $1 and a.address_type='tamtru';
            `;
            const result = await db.query(query, [mssv]);
            if (result.rows.length > 0) {
                logger.info("getTemporaryAddress executed successfully in addressModel");
                return result.rows[0];
            }
    
            return undefined;
        }
        catch (error) {
            logger.error("Error get TemporaryAddress addressModel:", error.message);
            throw new Error(error.message);
        }
    }
    
    static async getMailingAddress(mssv) {
        try {
            const query = `
            SELECT 
                a.student_id,
                a.address_type,
                a.street_address,
                a.ward,
                a.district,
                a.city,
                a.country
            FROM public.address a
            WHERE a.student_id = $1 and a.address_type='nhanthu';
            `;
            const result = await db.query(query, [mssv]);
            if (result.rows.length > 0) {
                logger.info("getMailingAddress executed successfully in addressModel");
                return result.rows[0];
            }
    
            return undefined;
        }
        catch (error) {
            logger.error("Error get MailingAddress addressModel:", error.message);
            throw new Error(error.message);
        }
    }

    static async addAddress(info) {
        try {
            const query = `
            INSERT INTO public.address (student_id, address_type, street_address, ward, district, city, country)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *;
            `;
            const result = await db.query(query, [info.student_id, info.address_type, 
                info.street_address, info.ward, info.district, info.city, info.country]);
            if (result.rows.length > 0) {
                logger.info("addAddress executed successfully in addressModel");
                return result.rows[0];
            }

            return null;
        }
        catch (error) {
            logger.error("Error add Address addressModel:", error.message);
            throw new Error(error.message);
        }
    }
    static async updateAddress(info) {
        try {
            const query = `
            UPDATE public.address
            SET
            street_address = $1,
            ward           = $2,
            district       = $3,
            city           = $4,
            country        = $5
            WHERE 
            student_id     = $6 AND
            address_type   = $7
            RETURNING *`;

            const result = await db.query(query, [
                info.street,
                info.ward,
                info.district,
                info.city,
                info.country,
                info.student_id,
                info.addresstype
            ]);

            if (result.rows.length > 0) {
                logger.info("updateAddress executed successfully in addressModel");
                return result.rows[0];
            }
        }
        catch (error) {
            logger.error("Error update Address addressModel:", error.message);
            throw new Error(error.message);
        }
    }
}

module.exports = addressModel;
