const courseModel = require('../course/courseModel');
const logger = require('../../config/logging');
class courseController {
    static async addCoursePage(req,res){
        try {
            logger.info("addCoursePage method got called in courseController");
            res.render('addCourse',{
                layout: 'main',
                title: "Add Course Page",
            });
        } catch(error) {
            logger.error("Error in courseController:", error.message);
            return res.status(500).json({
                message: "Failed to add course. Please try again later."
            });
        }
    }
    static async addCourse(req, res){
        try {
            logger.info("addCouse method got called in courseController");

            const course = req.body;

            const addedCourse = await courseModel.addCourse(course);

            if (addedCourse){
                return res.status(201).json(
                    {
                        success: true,
                        message: "Add course successfully",
                        course: addedCourse
                    }
                );
            }
            else {
                logger.warn("failed to add course. Please try again later.");
                return res.status(500).json(
                    {
                        messafe:"Failed to add course. Please try again later."
                    }
                );
            }
        }
        catch (error) {
            logger.error("Error in addCourseController:", error.message);
            
            if (error.message.includes("duplicate key value violates unique constraint")) {
                if (error.message.includes("course_pkey") || 
                    error.message.includes("course_id_key") || 
                    error.message.toLowerCase().includes("course_id")) {
                    
                    logger.warn(`Attempt to add duplicate course ID: ${req.body.courseCode}`);
                    return res.status(409).json({
                        success: false,
                        message: "Course ID already exists. Please use a different course code.",
                        error: "DUPLICATE_COURSE_ID"
                    });
                }
            }
            
            // Generic error response
            return res.status(500).json({
                success: false,
                message: "Failed to add course. Please try again later."
            });
        }
    }
    static async searchCourseById(req, res){
        try {
            logger.info("searchCourseById method got called in coursecontroller");
            let courseId = req.query;
            console.log("courseId: ", courseId.courseId);
            if(!courseId){
                logger.warn("courseId is missing in the request.");
                return res.status(400).json(
                    {
                        success: false,
                        message: "courseId is required."
                    }
                );
            }
            const course = await courseModel.searchCourseById(courseId);
            logger.info("course: ", course);
            if (course){
                return res.status(200).json(
                    {
                        success: true,
                        message: "Search course successfully",
                        course: course
                    }
                );
            }
            else {
                logger.warn("Failed to search course. Please try again later.");
                return res.status(500).json(
                    {
                        message:"Failed to search course. Please try again later."
                    }
                );
            }
        }
        catch(error){
            logger.error("Error in searchCourseById in courseController:", error.message);
            return res.status(500).json(
                {
                    message:"Failed to search course. Please try again later."
                }
            );
        }
    }
    static async editCoursePage(req, res){
        try {
            logger.info("editCoursePage method got called in courseController");
            res.render('editCourse', {
                layout: 'main',
                title: 'Edit Course Page'
            });
        }
        catch(error){
            logger.error("Error in editCoursePage in courseController:", error.message);
            return res.status(500).json({
                message: "Failed to add email  of user. Please try again later."
            });
        }
    }
    static async getAllCourses(req, res){
        try {
            logger.info("getAllCourses method got called in courseController");
            const courses = await courseModel.getAllCourses();
            if (courses){
                return res.status(200).json(
                    {
                        success: true,
                        message: "Get all courses successfully",
                        courses: courses
                    }
                )
            }
            else {
                logger.warn("Failed to get all courses. PLease try again later.");
                return res.status(500).json(
                    {
                        message: "Failed to get all course. Plase try again later."
                    }
                )
            }
        }
        catch(error){
            logger.error("Error in getAllCourses in courseController:", error.message);
            return res.status(500).json(
                {
                    message: "Failed to get all courses. Please try again later"
                }
            )
        }
    }
    static async deleteCourse(req,res){
        try {
            logger.info("deleteCourse method got called in courseController");
            let courseId = req.body.courseId;
            console.log("courseId in controller: ", courseId);
            console.log(courseId);
            const deletedCourse = await courseModel.deleteCourse(courseId);
            if (deletedCourse){
                return res.status(200).json(
                    {
                        success: true,
                        message: "Delete course successfully",
                        course: deletedCourse
                    }
                )
            }
            else {
                logger.warn("Failed to delete course. Please try again later.");
                return res.status(500).json(
                    {
                        message: "Failed to delete course. Please try again later."
                    }
                )
            }
        }
        catch(error){
            logger.error("Error in deleteCourse in courseController:", error.message);
            return res.status(500).json(
                {
                    message: "Failed to delete course. Please try again later."
                }
            )
        }
    }
    static async updateCourse(req, res){
        try {
            logger.info("updateCourse method got called in courseController");
            const course = req.body;
            const updatedCourse = await courseModel.updateCourse(course);
            if (updatedCourse){
                return res.status(200).json(
                    {
                        success: true,
                        message: "Update course successfully",
                        course: updatedCourse
                    }
                );
            }
            else {
                logger.warn("Failed to update course. Please try again later.");
                return res.status(500).json(
                    {
                        message: "Failed to update course. Please try again later"
                    }
                )
            }
                
        }
        catch(error){
            logger.error("Error in updateCourse in courseController: ", error.message);
            return res.status(500).json({
                message: "Failed to update course. Please try again later."
            });
        }
    }
    static async updateCourseStatus(req, res){
        try {
            const courseId = req.body.courseId;
            const status = req.body.status;
            logger.info("updateCourseStatus method got called in courseController");
            const updatedCourseStatus = await courseModel.updateCourseStatus(courseId,status);
            if (updatedCourseStatus){
                return res.status(200).json(
                    {
                        success: true,
                        message: "Update course status successfully",
                        course: updatedCourseStatus
                    }
                );
            }
            else {
                return res.status(500).json(
                    {
                        message: "Failed to update course status. Please try again later."
                    }
                );
            }
        }
        catch(error){
            logger.error("Error in updateCourseStatus in courseController: ", error.message);
            return res.status(500).json(
                {
                    message: "Failed to update course status. Please try again later."
                }
            );
        }
    }
    static async isCourseExistInClass(req, res){
        try {
            const courseId = req.query;
            console.log("courseId in controller: ", courseId);
            logger.info("isCourseExistInClass method got called in courseController");
            const isCourseExist = await courseModel.isCourseExistInClass(courseId);
            if (isCourseExist){
                return res.status(200).json(
                    {
                        exists: true,
                        message: "Course exist in class",
                        course: isCourseExist
                    }
                );
            }
            else {
                return res.status(500).json(
                    {
                        message: "Course does not exist in class."
                    }
                );
            }
        }
        catch(error){
            logger.error("Error in isCourseExistInClass in courseController: ", error.message);
            return res.status(500).json(
                {
                    message: "Failed to check course exist in class. Please try again later."
                }
            );
        }
    }
}
module.exports = courseController;