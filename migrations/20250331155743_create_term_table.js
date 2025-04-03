/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable('term', function(table) {
        table.string('year',15);
        table.integer('semester');
        table.date('registration_end');
    
        table.primary(['year', 'semester']); // Khóa chính tổng hợp
      });

    await  knex.schema.alterTable('class', function(table) {
    
        table.foreign(['year', 'semester']).references(['year', 'semester']).inTable('term').onDelete('CASCADE');
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.alterTable('class', function(table) {
      table.dropForeign(['year', 'semester']);
    });
    await knex.schema.dropTable('term');


};
