/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('class', function(table){
    table.string('class_id',100);
    table.string('course_id',100);
    table.string('year',15);
    table.integer('semester');
    table.string('lecturer',100);
    table.integer('maximum');
    table.string('schedule',100);
    table.string('room',100);

    table.primary(['class_id', 'course_id', 'year', 'semester']);
    table.foreign('course_id').references('course_id').inTable('course').onDelete('CASCADE');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable('class')
};