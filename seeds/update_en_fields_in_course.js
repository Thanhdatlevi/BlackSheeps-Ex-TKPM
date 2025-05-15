/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('course')
    .where({ course_id: 'CS101' })
    .update({
      en_course_name: 'Introduction to CS',
      en_description: 'Basic CS concepts.'
    });
  await knex('course')
    .where({ course_id: 'CS102' })
    .update({
      en_course_name: 'Data Structures',
      en_description: 'Advanced DS concepts'
    });
  await knex('course')
    .where({ course_id: 'CS103' })
    .update({
      en_course_name: 'Algorithms',
      en_description: 'Algorithm design and analysis'
    });
  await knex('course')
    .where({ course_id: 'CS104' })
    .update({
      en_course_name: 'Programming Techniques',
      en_description: 'Learn more about techniques'
    });
};
