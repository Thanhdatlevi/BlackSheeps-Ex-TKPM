const addressService = require('./addressService');
const logger = require('../../config/logging');

class addressController {
    static async addAddress(req, res) {
        try {
            const newAddress = {
                student_id: req.body.student_id,
                address_type: req.body.addresstype,
                street_address: req.body.street,
                ward: req.body.ward,
                district: req.body.district,
                city: req.body.city,
                country: req.body.country
            };
            const addedAddress = await addressService.addAddress(newAddress);
            if (addedAddress) {
                return res.status(201).json({
                    success: true,
                    message: "Add address successfully",
                    address: addedAddress
                });
            } else {
                logger.warn("Failed to add address. Please try again later.");
                return res.status(500).json({
                    message: "Failed to add address. Please try again later."
                });
            }
        } catch (error) {
            logger.error("Error in addAddressController:", error.message);
            return res.status(500).json({
                message: "Failed to add address of user. Please try again later."
            });
        }
    }

    static async updateAddress(req, res) {
        const address = req.body;
        try {
            if (address.permanent_address !== undefined) {
                await addressService.updateAddress(address.permanent_address);
            }
            if (address.temporary_address !== undefined) {
                await addressService.updateAddress(address.temporary_address);
            }
            if (address.mailing_address !== undefined) {
                await addressService.updateAddress(address.mailing_address);
            }
            return res.status(200).json({
                message: "update address successfully"
            });
        } catch (error) {
            logger.error("Error in updateStudentController address:", error);
            return res.status(500).json({
                message: "Failed to update student of user 1. Please try again later."
            });
        }
    }
}

module.exports = addressController;