const { query } = require("express");
const db = require("../../config/db");

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
                COALESCE(addr.DIA_CHI_THUONG_TRU, '') AS permanent_address,
                COALESCE(addr.DIA_CHI_TAM_TRU, '') AS temporary_address,
                COALESCE(addr.DIA_CHI_NHAN_THU, '') AS mailing_address,
                s.email,
                s.phone,
                s.nationality,
                f.faculty_name as faculty,
                ep.program_name as education_program,
                ss.status_name as student_status,
                COALESCE(
                JSON_AGG(
                    JSONB_BUILD_OBJECT(
                        'id_type', si.id_type,
                        'id_number', si.id_number,
                        'issue_date', to_char(si.issue_date, 'yyyy-mm-dd'),
                        'expiry_date', to_char(si.expiry_date, 'yyyy-mm-dd'),
                        'issue_place', si.issue_place,
                        'has_chip', si.has_chip,
                        'issue_country', si.issue_country,
                        'note', si.note
                    )
                ) FILTER (WHERE si.id_number IS NOT NULL), '[]'
            ) AS identifications
            FROM public.students s 
            JOIN faculties f ON f.faculty_id = s.faculty
            JOIN education_programs ep ON ep.program_id = s.education_program
            JOIN student_status ss ON ss.status_id = s.student_status
            LEFT JOIN (
                SELECT 
                    a.student_id,
                    MAX(CASE WHEN a.address_type = 'thuongtru' THEN 
                        a.street_address || ', ' || a.ward || ', ' || a.district || ', ' || a.city || ', ' || a.country 
                    END) AS DIA_CHI_THUONG_TRU,
                    MAX(CASE WHEN a.address_type = 'tamtru' THEN 
                        a.street_address || ', ' || a.ward || ', ' || a.district || ', ' || a.city || ', ' || a.country 
                    END) AS DIA_CHI_TAM_TRU,
                    MAX(CASE WHEN a.address_type = 'nhanthu' THEN 
                        a.street_address || ', ' || a.ward || ', ' || a.district || ', ' || a.city || ', ' || a.country 
                    END) AS DIA_CHI_NHAN_THU
                FROM public.address a
                GROUP BY a.student_id
            ) addr ON addr.student_id = s.student_id
            LEFT JOIN identificationdocument si ON si.student_id = s.student_id
            WHERE 
                ($1::TEXT IS NULL OR s.student_id::TEXT = $1::TEXT) 
                AND ($2::TEXT IS NULL OR s.full_name ILIKE '%' || $2::TEXT || '%')
                AND ($3::INT IS NULL OR s.faculty = $3::INT)
            GROUP BY s.student_id, f.faculty_name, ep.program_name, ss.status_name, addr.DIA_CHI_THUONG_TRU, addr.DIA_CHI_TAM_TRU, addr.DIA_CHI_NHAN_THU;
            `;
    
            // Chuyển `khoa` từ string sang số hoặc null
            const khoaParsed = khoa ? parseInt(khoa, 10) : null;
    
            const result = await db.query(query, [mssv || null, name || null, khoaParsed]);
    
            return result.rows.length > 0 ? result.rows : [];
        } catch (error) {
            console.error("Error in searchStudent:", error.message);
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
                return result.rows;
            }
            return [];
        }
        catch (error) {
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
            console.error("Error search Student in studentModel:", error);
            throw new Error("Error search Student in studentModel.");
        }
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
                return result.rows[0];
            }

            return null;
        }
        catch(error) {
            console.error("Error add Student in studentModel:", error);
            throw new Error(error.message);
        }
    }

    static async updateStudent(student) {
        try {
            console.log(student.course);
            const query = `UPDATE public.students 
            SET full_name = $1,
            date_of_birth = $2, 
            gender = $3,
            faculty = $4,
            academic_year = $5, 
            education_program = $6, 
            address = $7, 
            email = $8,
            phone = $9, 
            student_status = $10
            WHERE student_id = $11
            RETURNING *
            `;
            const result = await db.query(query, [student.name,student.dob,
                student.gender, student.faculty, student.course,
                student.program, student.address, student.email, student.phone, student.status, student.mssv ]);
            if (result.rows.length > 0) {
                return result.rows[0];
            }
            return null;
        }
        catch(error) {
            console.error("Error updating Student in studentModel:", error);
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
            return true;
        } catch (error) {
            await client.query("ROLLBACK"); // Hoàn tác nếu có lỗi
            console.error("Error in addStudents:", error);
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
            return { success: true, message: `Đã nhập ${idList.length} giấy tờ thành công.` };
        } catch (error) {
            await client.query("ROLLBACK"); // Hoàn tác nếu có lỗi
            console.error("Lỗi khi nhập giấy tờ tùy thân:", error);
            throw new Error(error.message);
        } finally {
            client.release();
        }
    }
}
module.exports = studentModel;
