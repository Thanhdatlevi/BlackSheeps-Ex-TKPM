// const {query} = require ('express');
const db = require('../../config/db');
const logger = require('../../config/logging');
const { search } = require('../../routes/classRoutes');
const studentModel = require('../student/studentModel')

class classModel {
    static async searchCourse(course_id) {
        try {
            const course_query = `
                SELECT * FROM course WHERE course_id = $1;
            `;
            let course_result = await db.query(course_query, [course_id]);
            // console.log(course_result.rows);
            return course_result.rows;
        } catch (error) {
            logger.info(error);
            return [];
        }
    }
    static async searchYear(year, semester) {
        try {
            const year_query = `
                SELECT * FROM term WHERE year = $1 AND semester = $2;
            `;
            let search_year_result = await db.query(year_query, [year, semester]);
            // console.log(search_year_result.rows);
            return search_year_result.rows;
        } catch (error) {
            logger.error(error);
            return [];
        }
    }
    static async addClass(classObject) {
        try {
            // TODO: check for year term 
            // Error: Year Term not found
            // const year_result = await this.searchYear(
            //     classObject.year,
            //     classObject.semester
            // )
            // if (year_result.length == 0) {
            //     throw new Error('Year Term not found');
            // }
            // const class_result = await this.countClass(
            //     classObject.class_id,
            //     classObject.course_id,
            //     classObject.year,
            //     classObject.semester
            // )
            // console.log(class_result)

            // if (parseInt(class_result.count) != 0) {
            //     throw new Error('Class already existed');
            // }

            // const courseResult = await this.searchCourse(
            //     classObject.course_id,
            // )
            // if (parseInt(courseResult.length) == 0) {
            //     throw new Error('Course with id not existed');
            // }

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
            logger.error("Error add Class in classModel:", error);
            throw new Error(error);
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
            logger.error("Error update Class in classModel:", error);
            throw new Error(error);
        }
    }
    static async countClass(class_id, course_id, year, semester) {
        const class_query = `
        SELECT COUNT(DISTINCT (class_id, course_id, year, semester)) 
        FROM class
        WHERE 
            class_id = $1 AND
            course_id = $2 AND
            year = $3 AND
            semester = $4
        `;

        let class_result = await db.query(class_query, [
            class_id,
            course_id,
            year,
            semester
        ]);

        return class_result.rows[0];
    }
    static async countRegister(student_id, class_id, course_id, year, semester) {
        const existed_query = `
        select COUNT(DISTINCT (student_id, class_id, course_id, year, semester))
        from register_subject
        WHERE 
            student_id = $1 AND
            class_id = $2 AND
            course_id = $3 AND
            year = $4 AND
            semester = $5
        `;

        const subject_result = await db.query(existed_query, [
            student_id,
            class_id,
            course_id,
            year,
            semester
        ]);


        return subject_result.rows[0];
    }
    static async addStudentToClass(studentList, classObject) {
        try {
            // for (let i = 0; i < studentList.length; i++) {
            //     let student_result = await studentModel.searchStudent(
            //         studentList[i].student_id,
            //         '',
            //         ''
            //     )
            //     if (student_result.length == 0) {
            //         throw new Error('Non-existing Student');
            //     }
            // }

            // const class_result = await this.countClass(
            //     classObject.class_id,
            //     classObject.course_id,
            //     classObject.year,
            //     classObject.semester
            // )
            // console.log(class_result);
            // if (class_result.length == 0) {
            //     throw new Error('Class not found');
            // }


            // for (let i = 0; i < studentList.length; i++) {
            //     const subject_result = await this.countRegister(
            //         studentList[i].student_id,
            //         classObject.class_id,
            //         classObject.course_id,
            //         classObject.year,
            //         classObject.semester
            //     )
            //     console.log(subject_result);
            //     if (subject_result.count != 0) {
            //         throw new Error('Student already register this subject');
            //     }
            // }

            const query = `
            INSERT INTO register_subject (student_id, class_id, course_id, year, semester, grade)
            VALUES ($1, $2, $3, $4, $5, NULL)
            RETURNING *;`;
            for (let i = 0; i < studentList.length; i++) {
                let result = await db.query(query, [
                    studentList[i].student_id,
                    classObject.class_id,
                    classObject.course_id,
                    classObject.year,
                    classObject.semester
                ]);
                console.log(result.rows[0])
                if (result.rows.length > 0) {
                    return result.rows[0];
                }
            }
            return null;
        }
        catch (error) {
            throw new Error(error);
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
            logger.error("Error update Student in Class in classModel:", error);
            throw new Error(error);
        }
    }
    static async getCourses(lang) {
        try {
            let course_name_col = '';
            console.log(lang);
            if (lang === 'en') {
                course_name_col += 'en_course_name'
            }
            else {
                course_name_col += 'course_name'
            };

            const query = `
            SELECT course_id, ${course_name_col} as course_name
            FROM course
            ORDER BY course_id;
            `;

            const result = await db.query(query);
            if (result.rows.length > 0) {
                logger.info("getCourses executed successfully in classModel");
                logger.info(result.rows);
                return result.rows;
            }
            return null;
        }
        catch (error) {
            logger.error("Error get Courses in classModel:", error);
            throw new Error(error);
        }
    }
    static async getYear() {
        try {
            const query = `
            SELECT DISTINCT year
            FROM term
            ORDER BY year;
            `;
            const result = await db.query(query);
            if (result.rows.length > 0) {
                logger.info("getYear executed successfully in classModel");
                logger.info(result.rows);
                return result.rows;
            }
            return null;
        }
        catch (error) {
            logger.error("Error get Year in classModel:", error);
            throw new Error(error);
        }
    }
    static async getClasses() {
        try {
            const query = `
            SELECT DISTINCT class_id 
            FROM class
            `;
            const result = await db.query(query);
            if (result.rows.length > 0) {
                logger.info("getClasses executed successfully in classModel");
                logger.info(result.rows);
                return result.rows;
            }
            return [];
        }
        catch (error) {
            logger.error("Error get Classes in classModel:", error);
            throw new Error(error);
        }

    }
}

module.exports = classModel;
