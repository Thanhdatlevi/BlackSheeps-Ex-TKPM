/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable('address', function(table) {
        table.string('student_id', 20);
        table.string('address_type', 50);
        table.string('street_address', 225);
        table.string('ward', 100);
        table.string('district', 100);
        table.string('city', 100);
        table.string('country', 100);
    
        table.primary(['student_id', 'address_type']);
    
        table.foreign('student_id').references('student_id').inTable('students').onDelete('CASCADE');
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTable('address');
};
