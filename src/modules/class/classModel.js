// const {query} = require ('express');
const db = require('../../config/db');
const logger = require('../../config/logging')

class emailModel {
    static async addClass(classObject) {
        try {
            const query = `
            INSERT INTO class (class_id, course_id, year, semester, lecturer, maximum, schedule, room)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
            `;
            const result = await db.query(query, [
                classObject.class_id,
                classObject.course_id,
                classObject.year,
                classObject.semester,
                classObject.lecturer,
                classObject.maximum,
                classObject.schedule,
                classObject.room
            ]);
            if (result.rows.length > 0) {
                logger.info("addClass executed successfully in classModel");
                logger.info(result.rows[0]);
                return result.rows[0];
            }
            return null;
        }
        catch (error) {
            logger.error("Error add Class in classModel:", error.message);
            throw new Error(error.message);
        }
    }

    static async updateClass(classObject) {
        try {
            const query = `
            UPDATE public.classes
            SET
                lecturer = $1,
                maximum = $2,
                schedule = $3,
                room = $4
            WHERE
                class_id = $5 AND
                course_id = $6 AND
                year = $7 AND
                semester = $8
            RETURNING *;
            `;
            const result = await db.query(query, [
                classObject.lecturer,
                classObject.maximum,
                classObject.schedule,
                classObject.room,
                classObject.class_id,
                classObject.course_id,
                classObject.year,
                classObject.semester
            ]);
            if (result.rows.length > 0) {
                logger.info("updateClass executed successfully in classModel");
                logger.info(result.rows[0]);
                return result.rows[0];
            }
            return null;
        }
        catch (error) {
            logger.error("Error update Class in classModel:", error.message);
            throw new Error(error.message);
        }
    }

    static async addStudentToClass(studentList, classObject) {
        try {
            const query = `
            INSERT INTO resister_subject (student_id, class_id, course_id, year, semester, grade)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
            `;
            for (let i = 0; i < studentList.length; i++) {
                const result = await db.query(query, [
                    studentList[i],
                    classObject.class_id,
                    classObject.course_id,
                    classObject.year,
                    classObject.semester,
                    studentList[i].grade
                ]);

                if (result.rows.length > 0) {
                    logger.info("addStudentToClass executed successfully in classModel");
                    logger.info(result.rows[0]);
                    return result.rows[0];
                }
            }
            return null;
        }
        catch (error) {
            logger.error("Error add Student to Class in classModel:", error.message);
            throw new Error(error.message);
        }
    }
    static async updateStudentInClass(studentList, classObject) {
        try {
            const query = `
            UPDATE resister_subject
            SET
                grade = $1
            WHERE
                student_id = $2 AND
                class_id = $3 AND
                course_id = $4 AND
                year = $5 AND
                semester = $6
            RETURNING *;
            `;

            for (let i = 0; i < studentList.length; i++) {
                const result = await db.query(query, [
                    studentList[i].grade,
                    studentList[i].student_id,
                    classObject.class_id,
                    classObject.course_id,
                    classObject.year,
                    classObject.semester
                ]);
                if (result.rows.length > 0) {
                    logger.info("updateStudentInClass executed successfully in classModel");
                    logger.info(result.rows[0]);
                    return result.rows[0];
                }
            }
            if (result.rows.length > 0) {
                logger.info("updateStudentInClass executed successfully in classModel");
                logger.info(result.rows[0]);
                return result.rows[0];
            }
            return null;
        }
        catch (error) {
            logger.error("Error update Student in Class in classModel:", error.message);
            throw new Error(error.message);
        }
    }
}

module.exports = emailModel;
