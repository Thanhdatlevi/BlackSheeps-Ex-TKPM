const {query} = require('express');
const db = require('../../config/db');
const logger = require('../../config/logging');
class courseModel {
    static async addCourse(course){
        logger.info("addCourse method got called in courseModel");
        console.log("course: ", course);
        try {
            const query = `
            INSERT INTO public.course (course_id, course_name, credit, faculty, description, prerequisite, status, time_create, en_course_name, en_description)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
            `;
            const result = await db.query(query, [course.courseCode, course.courseName, course.credits, course.faculty, 
                course.description, course.prerequisite,'Active', course.time_create, course.courseNameEn, course.descriptionEn]);
            
            if (result.rows.length > 0){
                logger.info("addCourse executed successfully in courseModel");
                logger.info(result.rows[0]);
                return result.rows[0];
            }
            return null;
        }
        catch(error){
            logger.error("Error add Course in courseModel: ", error.message);
            throw new Error(error.message);
        }
    }
    static async searchCourseById(courseId){
        try {
            console.log("courseid in model: ", courseId.courseId);
            const query = `
            SELECT * FROM public.course
            WHERE course_id = $1;
            `;
            const result = await db.query(query, [courseId.courseId]);
            
            if (result.rows.length > 0){
                logger.info("searchCourseById executed successfully in courseModel");
                logger.info(result.rows[0]);
                return result.rows[0];
            }
            return null;
        }
        catch(error){
            logger.error("Error search Course By Id in courseModel:", error.message);
            throw new Error(error.message);
        }
    }
    static async getAllCourses(lang){
        if(lang==="en") lang+="_";
        else lang = "";
        console.log("lang in model: ", lang);
        try {
            const query =`
            SELECT
            c.course_id,
            c.${lang}course_name,
            c.credit,
            c.faculty,
            c.${lang}description,
            c.prerequisite,
            c.status,
            c.time_create,
            f.faculty_name
            FROM public.course c
            INNER JOIN public.faculties f ON c.faculty = f.faculty_id
            ORDER BY course_id;
            `;
            const result = await db.query(query);
            if (result.rows.length > 0){
                logger.info("getAllCourses executed successfully in courseModel");
                logger.info(result.rows);
                console.log("result: ", result.rows);
                return result.rows;
                
            }
            return null;
        }
        catch(error){
            logger.error("Error get All Course in courseModel: ", error.message);
            throw new Error(error.message);
        }
    }
    static async deleteCourse(courseId){
        try {
            console.log("courseId in model: ", courseId);
            const query = `
            DELETE FROM public.course
            WHERE course_id = $1
            RETURNING *;
            `;
            const result = await db.query(query, [courseId]);
            if (result.rows.length > 0){
                logger.info("deleteCourse executed successfully in courseModel");
                logger.info(result.rows[0]);
                return result.rows[0];
            }
            return null;
        }
        catch(error){
            logger.error("Error delete Course in courseModel:", error.message);
            throw new Error(error.message);
        }
    }
    static async updateCourse(course,lang){
        if(lang==="en") lang+="_";
        else lang = "";
        try {
            const query = `
            UPDATE public.course
            SET ${lang}course_name = $1, ${lang}description = $2, faculty = $3, credit = $4
            WHERE course_id = $5
            RETURNING *;
            `;
            const result = await db.query(query, [course.courseName, course.description, course.faculty, course.credit, course.id]);
            if ( result.rows.length > 0){
                logger.info("updateCourse exected in courseModel");
                logger.info(result.rows[0]);
                return result.rows[0];
            }
            return null;
        }
        catch(error){
            logger.error("Error update Course in courseModel:", error.message);
            throw new Error(error.message);
        }
    }
    static async updateCourseStatus(courseId, status){
        try {
            const query = `
            UPDATE public.course
            SET status = $1
            WHERE course_id = $2
            RETURNING *;`;
            const result = await db.query(query, [status, courseId]);
            if (result.rows.length > 0){
                logger.info("updateCourseStatus executed successfully in courseModel");
                logger.info(result.rows[0]);
                return result.rows[0];
            }
            return null;
        }
        catch(error){
            logger.error("Error update Course Status in courseModel: ", error.message);
            throw new Error(error.message);
        }
    }
    static async isCourseExistInClass(courseId){
        try {
            console.log("courseId in model: ", courseId.courseId);
            const query =`
            SELECT COUNT(*) AS count
            FROM public.class
            WHERE course_id =$1;
            `;
            const result = await db.query(query,[courseId.courseId]);
            if (result.rows[0].count > 0){
                logger.info("Course exists in class table");
                return true;
            }
            logger.info("Course does not exist in class table");
            return false;
        }
        catch(error){
            logger.error("Error in isCourseExistInClass in courseModel: ", error.message);
            throw new Error(error.message);
        }
    }
}
module.exports = courseModel;