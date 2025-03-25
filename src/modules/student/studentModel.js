const { query } = require("express");
const db = require("../../config/db");
const logger = require("../../config/logging");
const { updateStudent } = require("./studentController");

class studentModel {

    static async searchStudent(mssv, name, khoa) {
        try {
            const query = `
            SELECT 
                s.student_id,
                s.full_name,
                to_char(s.date_of_birth, 'yyyy-mm-dd') as date_of_birth,
                s.gender, 
                s.academic_year,
                s.email,
                s.phone,
                s.nationality,
                f.faculty_name as faculty,
                ep.program_name as education_program,
                ss.status_name as student_status
            FROM public.students s 
            JOIN faculties f ON f.faculty_id = s.faculty
            JOIN education_programs ep ON ep.program_id = s.education_program
            JOIN student_status ss ON ss.status_id = s.student_status
            WHERE 
                ($1::TEXT IS NULL OR s.student_id::TEXT = $1::TEXT) 
                AND ($2::TEXT IS NULL OR s.full_name ILIKE '%' || $2::TEXT || '%')
                AND ($3::INT IS NULL OR s.faculty = $3::INT);
            `;
    
            // Chuyển `khoa` từ string sang số hoặc null
            const khoaParsed = khoa ? parseInt(khoa, 10) : null;
    
            const result = await db.query(query, [mssv || null, name || null, khoaParsed]);
            
            if (result.rows.length > 0) {
                logger.info("searchStudent executed successfully in studentModel");
                return result.rows;
            }
            return [];
        } catch (error) {
            logger.error("Error search Student in studentModel:", error.message);
            throw new Error("Error search Student in studentModel.");
        }
    }
    

    static async searchStudentIdentification(mssv) {
        try {
            const query = `
            SELECT 
                si.student_id,
                si.id_type,
                si.id_number,
                to_char(si.issue_date, 'yyyy-mm-dd') as issue_date,
                si.issue_place,
                si.expiry_date,
                to_char(si.expiry_date, 'yyyy-mm-dd') as expiry_date,
                si.has_chip,
                si.issue_country,
                si.note
            FROM identificationdocument si
            WHERE ($1::TEXT IS NULL OR si.student_id::TEXT = $1::TEXT) 
            ORDER BY si.student_id
            `
            const result = await db.query(query, [mssv || null]);

            if (result.rows.length > 0) {
                logger.info("searchStudentIdentification executed successfully in studentModel");
                logger.info(result.rows);
                return result.rows;
            }
            return [];
        }
        catch (error) {
            logger.error("Error search Student Identification in studentModel:", error);
            throw new Error("Error search Student Identification in studentModel.");

        }
    }

    static async deleteStudent(mssv) {
        try {
            const query = `
            DELETE FROM students
            WHERE student_id = $1;
            `;
            await db.query(query, [mssv]);
        }
        catch (error) {
            logger.error("Error search Student in studentModel:", error);
            throw new Error("Error search Student in studentModel.");
        }
        logger.info("deleteStudent executed successfully in studentModel");
    }

    static async addStudent(student) {
        try {
            const query = `
            INSERT INTO public.students (student_id, full_name, date_of_birth, 
            gender, academic_year, address, email, phone, faculty, education_program, student_status) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *;
            `;
            const result = await db.query(query, [student.mssv, student.name,student.dob,
                student.gender, student.course, student.address, student.email, student.phone, student.faculty,
                student.program, student.status]);
            if (result.rows.length > 0) {
                logger.info("addStudent executed successfully in studentModel");
                return result.rows[0];
            }

            return null;
        }
        catch(error) {
            logger.error("Error add Student in studentModel:", error);
            throw new Error(error.message);
        }
    }

    static async updateStudent(student) {
        try {
            // get faculty_id, status id, education_program_id
            const getIDQuery = `
            SELECT ep.program_id, f.faculty_id, ss.status_id
            FROM education_programs ep
            JOIN faculties f ON 1=1
            JOIN student_status ss ON 1=1
            WHERE ep.program_name = $1
            AND f.faculty_name = $2
            AND ss.status_name = $3
            `
            const IDResult = await db.query(getIDQuery, 
                [
                    student.program,
                    student.faculty,
                    student.status
                ]
            );


            student.program = IDResult.rows[0].program_id;
            student.faculty = IDResult.rows[0].faculty_id;
            student.status = IDResult.rows[0].status_id;

            // update
            const query = `update public.students 
            set full_name = $1,
            date_of_birth = $2, 
            gender = $3,
            faculty = $4,
            academic_year = $5, 
            education_program = $6, 
            address = $7, 
            email = $8,
            phone = $9, 
            student_status = $10
            where student_id = $11
            returning *
            `;

            const result = await db.query(query, 
                [
                    student.name,
                    student.dob,
                    student.gender,
                    student.faculty,
                    student.course,
                    student.program,
                    student.address,
                    student.email,
                    student.phone,
                    student.status,
                    student.mssv 
                ]
            );
            if (result.rows.length > 0) {
                logger.info("update student info executed successfully in studentmodel");
                // return result.rows[0];
            }

            const idetifyQuery = 
                `update public.identificationdocument 
                set id_type = $1,
                id_number = $2, 
                issue_date = $3,
                issue_place = $4,
                expiry_date = $5, 
                has_chip = $6, 
                issue_country = $7, 
                note = $8
                where student_id = $9
                returning *
            `;

            const Identifyresult = await db.query(idetifyQuery, 
                [
                    student.id_type,
                    student.id_number,
                    student.issue_date,
                    student.issue_place,
                    student.expire_date,
                    student.card_chip,
                    student.issue_country,
                    student.note,
                    student.mssv 
                ]
            );
            if (result.rows.length > 0) {
                logger.info("update student \"identity\" executed successfully in studentmodel");
                logger.info(student);
                return Identifyresult.rows[0] + result.rows[0];
            }
        }
        catch(error) {
            logger.error("error updating student in studentmodel:", error);
            throw new Error(error.message);
        }
    }

    static async importStudent(studentList) {
        const client = await db.connect();
        try {
            await client.query("BEGIN"); // Bắt đầu transaction

            for (const student of studentList) {
                // Thêm sinh viên vào bảng students
                const studentQuery = `
                    INSERT INTO public.students (
                        student_id, 
                        full_name, 
                        date_of_birth, 
                        gender, 
                        faculty, 
                        academic_year, 
                        education_program, 
                        email, phone, 
                        student_status, nationality
                    ) VALUES ($1, $2, $3, $4, (select f.faculty_id
                                                from faculties f
                                                where f.faculty_name = $5), $6,
                                                (select ep.program_id
                                                from education_programs ep
                                                where ep.program_name = $7)
                                                , $8, $9, 
                                                (select ss.status_id
                                                from student_status ss
                                                where ss.status_name = $10), $11)
                    ON CONFLICT (student_id) DO NOTHING;
                `;
                await client.query(studentQuery, [
                    student.student_id, student.full_name, student.date_of_birth,
                    student.gender, student.faculty, student.academic_year,
                    student.education_program, student.email, student.phone, student.student_status,student.nationality
                ]);

                // Thêm địa chỉ vào bảng address
                const addressTypes = [
                    { type: "thuongtru", address: student.permanent_address },
                    { type: "tamtru", address: student.temporary_address },
                    { type: "nhanthu", address: student.mailing_address }
                ];

                for (const addr of addressTypes) {
                    if (addr.address) {
                        const addressParts = addr.address.split(", ").map(part => part.trim());
                        if (addressParts.length >= 5) {
                            const [street, ward, district, city, country] = addressParts;

                            const addressQuery = `
                                INSERT INTO public.address (
                                    student_id, street_address, ward, district, city, country, address_type
                                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                                ON CONFLICT (student_id, address_type) DO NOTHING;
                            `;
                            await client.query(addressQuery, [
                                student.student_id, street, ward, district, city, country, addr.type
                            ]);
                        }
                    }
                }
            }

            await client.query("COMMIT"); // Hoàn thành transaction
            logger.info("importStudent executed successfully in studentModel");
            return true;
        } catch (error) {
            await client.query("ROLLBACK"); // Hoàn tác nếu có lỗi
            logger.error("Error import Student in studentModel:", error);
            throw new Error(error.message);
        } finally {
            client.release();
        }
    }

    static async importIdentificationDocuments(idList) {
        const client = await db.connect();
        try {
            await client.query("BEGIN"); // Bắt đầu transaction

            for (const doc of idList) {
                const query = `
                    INSERT INTO identificationdocument (
                        student_id, id_type, id_number, issue_date, 
                        issue_place, expiry_date, has_chip, issue_country, note
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                    ON CONFLICT (student_id, id_type) DO NOTHING;
                `;

                // Chuyển đổi dữ liệu trước khi insert
                await client.query(query, [
                    doc.student_id, 
                    doc.id_type, 
                    doc.id_number, 
                    doc.issue_date || null,
                    doc.issue_place || null, 
                    doc.expiry_date || null, 
                    doc.has_chip?.toString().toLowerCase() === "true" ? true 
                    : doc.has_chip?.toString().toLowerCase() === "false" ? false 
                    : null,
                    doc.issue_country || null,
                    doc.note || null
                ]);
            }

            await client.query("COMMIT"); // Hoàn thành transaction
            logger.info("importIdentificationDocuments executed successfully in studentModel");
            return { success: true, message: `Đã nhập ${idList.length} giấy tờ thành công.` };
        } catch (error) {
            await client.query("ROLLBACK"); // Hoàn tác nếu có lỗi
            logger.error("Error import IdentificationDocuments in studentModel:", error);
            throw new Error(error.message);
        } finally {
            client.release();
        }
    }
}
module.exports = studentModel;
