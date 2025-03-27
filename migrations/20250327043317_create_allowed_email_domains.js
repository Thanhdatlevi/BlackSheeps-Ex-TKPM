/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Xóa bảng nếu đã tồn tại
  await knex.schema.dropTableIfExists('allowed_email_domains');

  // Tạo bảng mới
  await knex.schema.createTable('allowed_email_domains', (table) => {
      table.increments('email_id').primary();
      table.string('email_domain', 255).notNullable().unique();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('allowed_email_domains');
};
