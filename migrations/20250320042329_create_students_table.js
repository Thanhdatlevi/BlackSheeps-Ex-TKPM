/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable('students', function(table) {
        table.string('student_id', 20).primary();
        table.string('full_name', 255);
        table.date('date_of_birth');
        table.string('gender', 10);
        table.string('faculty', 255);
        table.string('academic_year', 9);
        table.string('education_program', 255);
        table.text('address');
        table.string('email', 255);
        table.string('phone', 15);
        table.string('student_status', 255);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTable('students');
};
