/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable('identificationdocument', function(table) {
        table.string('student_id', 20);
        table.string('id_type', 20);
        table.string('id_number', 50).notNullable();
        table.date('issue_date');
        table.string('issue_place', 100);
        table.date('expiry_date'); 
        table.boolean('has_chip');
        table.string('issue_country', 100);
        table.text('note');

        // Thiết lập khóa chính gồm student_id và id_type
        table.primary(['student_id', 'id_type']);

        // Khóa ngoại liên kết với bảng students
        table.foreign('student_id').references('student_id').inTable('students').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTable('identificationdocument');
};
