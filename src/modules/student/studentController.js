// const cartService = require("./cartService");
// const userService = require('../user/userService');
class studentController {
    
    static async addStudent(req, res) {
        try {
            res.render('add', {
                layout: 'main',
                title: 'Shopping Cart Page',
            });

        } catch (error) {
            console.error("Error in cartController:", error.message);
            return res.status(500).json({
                message: 'Failed to get cart items of user. Please try again later.'
            });
        }

    }
}

module.exports = studentController;