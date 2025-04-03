/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('course', function(table){
    table.string('course_id',100).primary();
    table.string('course_name', 100).notNullable();
    table.integer('credit');
    table.integer('faculty');
    table.string('description',100);
    table.string('prerequisite',100);
    table.string('status',50);
    table.timestamp('time_create')

    table.foreign('prerequisite').references('course_id').inTable('course').onDelete('CASCADE');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTable('course')
};
