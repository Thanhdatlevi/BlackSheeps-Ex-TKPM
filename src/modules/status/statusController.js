const statusModel = require('../status/statusModel');
class statusController {
    static async addPage(req,res){
        try {
            res.render('addStatus',{
                layout: 'main',
                title: 'Add Status Page',
            });
        } catch (error) {
            console.error("Error in addStatusController:", error.message);
            return res.status(500).json({
                message: 'Failed to add status of user. Please try again later.'
            });
        }
    }
    static async addStatus(req,res){
        try {
            const status_name = req.body.name
            const addedStatus = await statusModel.addStatus(status_name);
            if (addedStatus){
                return res.status(201).json(
                    {
                        success: true,
                        message: 'Add status successfully',
                        status: addedStatus
                    }
                );
            } else {
                return res.status(500).json(
                    {
                        message: 'Failed to add status. Please try again later.'
                    }
                );
            }
        }
        catch (error){
            console.error("Error in addStatusController:", error.message);
            return res.status(500).json({
                message: 'Failed to add status of user. Please try again later.'
            });
        }
    }
    static async updatePage(req,res){
        try {
            res.render('updateStatus',{
                layout: 'main',
                title: 'Update Status Page',
            });
        }
        catch (error){
            console.error("Error in updateStatusController:", error.message);
            return res.status(500).json({
                message: 'Failed to update status of user. Please try again later.'
            });
        }
    }
    static async searchStatusByName(req,res){
        try {
            const status_name = req.query.searchName;
            console.log("status name in controller",status_name);
            const status = await statusModel.searchStatusByName(status_name);
            console.log("status in controller",status);
            if (status){
                return res.status(200).json(
                    {
                        message: 'Search status successfully',
                        status: status
                    }
                );
            } else {
                return res.status(500).json(
                    {
                        message: 'Failed to search status. Please try again later.'
                    }
                );
            }
        }
        catch (error){
            console.error("Error in searchStatusController:", error.message);
            return res.status(500).json({
                message: 'Failed to search status of user. Please try again later.'
            });
        }
    }
    static async updateStatus(req,res){
        try {
            const {searchName, statusName} = req.body;
            const status = await statusModel.searchStatusByName(searchName);
            if (!status || status.length === 0){
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy trạng thái để cập nhật.'
                });
            }
            const updatedStatus = await statusModel.updateStatus({
                status_id: status.status_id,
                status_name: statusName
            });
            if (updatedStatus){
                return res.status(200).json(
                    {
                        success: true,
                        message: 'Cập nhật trạng thái thành công',
                        status: updatedStatus
                    }
                );
            } else {
                return res.status(500).json(
                    {
                        message: 'Cập nhật trạng thái thất bại. Vui lòng thử lại sau.'
                    }
                );
            }

        }
        catch (error){
            console.error("Error in updateStatusController:", error.message);
            return res.status(500).json({
                message: 'Failed to update status of user. Please try again later.'
            });
        }
    }
    static async getAllStatus(req,res){
        try {
            const status = await statusModel.getAllStatus();
            return res.status(200).json(
                {
                    message: 'Get all status successfully',
                    status: status
                }
            );
        }
        catch (error){
            console.error("Error in getAllStatusController:", error.message);
            return res.status(500).json({
                message: 'Failed to get all status of user. Please try again later.'
            });
        }
    }
}
module.exports = statusController;