/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('allowed_email_domains').del()
  await knex('allowed_email_domains').insert([
    { email_domain: 'gmail.com' },
    { email_domain: 'hcmus.edu' },
    { email_domain: 'student.hcmus.edu.vn' }
]);
};
