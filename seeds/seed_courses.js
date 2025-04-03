/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('course').del()
  await knex('course').insert([
    { course_id: 'CS101', course_name: 'Introduction to CS', credit: 4, faculty: 1, description: 'Basic CS concepts', prerequisite: null, status: 'Active', time_create: knex.fn.now() },
    { course_id: 'CS102', course_name: 'Data Structures', credit: 4, faculty: 2, description: 'Advanced DS concepts', prerequisite: null, status: 'Active', time_create: knex.fn.now() },
    { course_id: 'CS103', course_name: 'Algorithms', credit: 4, faculty: 3, description: 'Algorithm design and analysis', prerequisite: 'CS102', status: 'Active', time_create: knex.fn.now() }
  ]);
};
