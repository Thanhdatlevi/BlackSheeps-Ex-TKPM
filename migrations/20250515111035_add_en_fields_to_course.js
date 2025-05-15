/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function(knex) {
  await knex.schema.alterTable('course', function(table) {
    table.string('en_course_name', 100);
    table.string('en_description', 100);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down =async function(knex) {
  await knex.schema.alterTable('course', function(table) {
    table.dropColumn('en_course_name');
    table.dropColumn('en_description');
  });
};
