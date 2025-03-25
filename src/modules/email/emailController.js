const emailModel = require('../email/emailModel');
const logger = require('../../config/logging')
class emailController {

    static async configEmailPage(req,res){
        try {
            logger.info("emailconfigPage method got called in emailController");
            res.render('configEmail', {
                layout: 'main',
                title: 'Email Configuration Page',
            });
        } catch (error) {
            logger.error("Error in emailController:", error.message);
            return res.status(500).json({
                message: 'Failed to add email of user. Please try again later.'
            });
       }
    }
    static async addEmail(req,res){
        try {
            logger.info("addEmail method got called in emailController");
            const email = req.body.domain;
            console.log(email);
            const addedEmail = await emailModel.addEmail(email);
            if (addedEmail){
                return res.status(201).json(
                    {
                        success: true,
                        message: 'Add email succcessfully',
                        email: addedEmail
                    }
                );
            } else {
                logger.warn("Failed to add email. Please try again later.");
                return res.status(500).json(
                    {
                        message: 'Failed to add email. Please try again later.'
                    }
                );
            }
        }
        catch (error){
            logger.error("Error in addEmailController:", error.message);
            return res.status(500).json({
                message: 'Failed to add email of user. Please try again later.'
            });
        }
    }
    static async searchEmail(req,res){
        try {
            logger.info("searchEmail method got called in emailController");
            const email = req.body.email;
            
            const searchedEmail = await emailModel.searchEmail(email);
            if (searchedEmail){
                return res.status(200).json(
                    {
                        success: true,
                        message: 'Search email succcessfully',
                        email: searchedEmail
                    }
                );
            } else {
                logger.warn("Failed to search email. Please try again later.");
                return res.status(500).json(
                    {
                        message: 'Failed to search email. Please try again later.'
                    }
                );
            }
        }
        catch (error){
            logger.error("Error in searchEmailController:", error.message);
            return res.status(500).json({
                message: 'Failed to search email of user. Please try again later.'
            });
        }
    }
    static async updateEmail(req,res){
        try {
            logger.info("updateEmail method got called in emailController");
            const email = {
                email_domain: req.body.email_domain,
                email_id: req.body.email_id
            };
            console.log(email);
            const updatedEmail = await emailModel.updateEmail(email);
            console.log(updatedEmail);
            if (updatedEmail){
                return res.status(200).json(
                    {
                        success: true,
                        message: 'Update email succcessfully',
                        email: updatedEmail
                    }
                );
            } else {
                logger.warn("Failed to update email. Please try again later.");
                return res.status(500).json(
                    {
                        message: 'Failed to update email. Please try again later.'
                    }
                );
            }
        }
        catch (error){
            logger.error("Error in updateEmailController:", error.message);
            return res.status(500).json({
                message: 'Failed to update email of user. Please try again later.'
            });
        }
    }
    static async getAllEmails(req,res){
        try {
            logger.info("getAllEmails method got called in emailController");
            const emails = await emailModel.getAllEmails();
            if (emails){
                return res.status(200).json(
                    {
                        success: true,
                        message: 'Get all emails succcessfully',
                        domains: emails
                    }
                );
            } else {
                logger.warn("Failed to get all emails. Please try again later.");
                return res.status(500).json(
                    {
                        message: 'Failed to get all emails. Please try again later.'
                    }
                );
            }
        }
        catch (error){
            logger.error("Error in getAllEmailsController:", error.message);
            return res.status(500).json({
                message: 'Failed to get all emails of user. Please try again later.'
            });
        }
    }
    static async deleteEmail(req,res){
        try {
            logger.info("deleteEmail method got called in emailController");
            const email_id = req.body.email_id;
            
            const deletedEmail = await emailModel.deleteEmail(email_id);
            if (deletedEmail){
                return res.status(200).json(
                    {
                        success: true,
                        message: 'Delete email succcessfully',
                        email: deletedEmail
                    }
                );
            } else {
                logger.warn("Failed to delete email. Please try again later.");
                return res.status(500).json(
                    {
                        message: 'Failed to delete email. Please try again later.'
                    }
                );
            }
        }
        catch (error){
            logger.error("Error in deleteEmailController:", error.message);
            return res.status(500).json({
                message: 'Failed to delete email of user. Please try again later.'
            });
        }
    }
}

module.exports = emailController;