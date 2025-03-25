/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.raw(`
        CREATE OR REPLACE FUNCTION check_status_update_fault()
        RETURNS TRIGGER AS $$
        BEGIN
            IF OLD.student_status IS DISTINCT FROM NEW.student_status 
                AND OLD.student_status = (SELECT status_id FROM student_status WHERE status_name = 'Đã tốt nghiệp' LIMIT 1) 
            THEN
            RAISE EXCEPTION 'Không thể cập nhật trạng thái từ "Đã tốt nghiệp" thành trạng thái khác.';
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE OR REPLACE TRIGGER check_status_update_fault
        BEFORE UPDATE ON students
        FOR EACH ROW
        EXECUTE FUNCTION check_status_update_fault();
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    knex.schema.raw(`
        DROP TRIGGER IF EXISTS check_status_update_fault ON students;
        DROP FUNCTION IF EXISTS check_status_update_fault();
    `);
};
