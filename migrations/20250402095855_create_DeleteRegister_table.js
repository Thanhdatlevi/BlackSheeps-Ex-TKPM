/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable('delete_register', function(table) {
        table.string('student_id',20);
        table.string('class_id', 100);
        table.string('course_id', 100);
        table.string('year',15);
        table.integer('semester');
        table.timestamp('delete_time');
    
        table.primary(['student_id', 'class_id', 'course_id', 'year', 'semester', 'delete_time']);

        table.foreign(['class_id', 'course_id', 'year', 'semester'])
             .references(['class_id', 'course_id', 'year', 'semester'])
             .inTable('class')
             .onDelete('CASCADE');

        table.foreign('student_id').references('student_id').inTable('students').onDelete('CASCADE');
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTable('delete_register');
};
