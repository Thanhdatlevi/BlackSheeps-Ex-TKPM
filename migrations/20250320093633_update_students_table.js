/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.alterTable('students', function(table) {
        // Xóa cột cũ
        table.dropColumn('faculty');
        table.dropColumn('education_program');
        table.dropColumn('student_status');
      });
    
      await knex.schema.alterTable('students', function(table) {
        table.string('nationality', 100);

        // Tạo lại các cột mới với kiểu INT
        table.integer('faculty').unsigned();
        table.integer('education_program').unsigned();
        table.integer('student_status').unsigned();
    
        // Thêm khóa ngoại
        table.foreign('faculty').references('faculty_id').inTable('faculties').onDelete('CASCADE');
        table.foreign('education_program').references('program_id').inTable('education_programs').onDelete('CASCADE');
        table.foreign('student_status').references('status_id').inTable('student_status').onDelete('CASCADE');
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.alterTable('students', function(table) {
        // Xóa khóa ngoại trước khi xóa cột
        table.dropForeign('faculty');
        table.dropForeign('education_program');
        table.dropForeign('student_status');

        table.dropColumn('faculty');
        table.dropColumn('education_program');
        table.dropColumn('student_status');
      });
    
      await knex.schema.alterTable('students', function(table) {
        // Tạo lại các cột với kiểu dữ liệu cũ
        table.string('faculty', 255);
        table.string('education_program', 255);
        table.string('student_status', 255);
      });
};
