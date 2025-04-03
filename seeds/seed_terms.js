/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('term').del()
  await knex('term').insert([
    { year: '2024-2025', semester: 1, registration_end: '2024-08-31' },
    { year: '2024-2025', semester: 2, registration_end: '2025-01-31' }
  ]);
};
