/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema
    .createTable('student_status', function (table) {
      table.increments('status_id').primary();
      table.string('status_name', 100).notNullable();
    })
    .createTable('faculties', function (table) {
      table.increments('faculty_id').primary();
      table.string('faculty_name', 100).notNullable();
    })
    .createTable('education_programs', function (table) {
      table.increments('program_id').primary();
      table.string('program_name', 100).notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema
    .dropTable('education_programs')
    .dropTable('faculties')
    .dropTable('student_status');
};
