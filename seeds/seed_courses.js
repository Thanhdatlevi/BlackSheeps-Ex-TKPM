/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('course').del()
  await knex('course').insert([
    { course_id: 'CS101', course_name: 'Các khái niệm CS cơ bản', credit: 4, faculty: 1, description: 'Các khái niệm DS nâng cao', prerequisite: null, status: 'Active', time_create: knex.fn.now() },
    { course_id: 'CS102', course_name: 'Cấu trúc dữ liệu', credit: 4, faculty: 2, description: 'Các khái niệm DS nâng cao', prerequisite: null, status: 'Active', time_create: knex.fn.now() },
    { course_id: 'CS103', course_name: 'Thuật toán', credit: 4, faculty: 3, description: 'Thiết kế và phân tích thuật toán', prerequisite: 'CS102', status: 'Active', time_create: knex.fn.now() }
  ]);
};
