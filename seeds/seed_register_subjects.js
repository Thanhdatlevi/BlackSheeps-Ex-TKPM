/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('register_subject').del()
  await knex('register_subject').insert([
    { student_id: '22120001', class_id: '22CTT2', course_id: 'CS101', year: '2024-2025', semester: 1, grade: 8.5 },
    { student_id: '22120001', class_id: '22CTT4', course_id: 'CS102', year: '2024-2025', semester: 2, grade: null },
    { student_id: '22120002', class_id: '22CTT3', course_id: 'CS101', year: '2024-2025', semester: 1, grade: 7.5 },
    { student_id: '22120002', class_id: '22CTT4', course_id: 'CS103', year: '2024-2025', semester: 2, grade: null },
    { student_id: '22120003', class_id: '22CTT2', course_id: 'CS101', year: '2024-2025', semester: 1, grade: 9.5 },
    { student_id: '22120003', class_id: '22CTT4', course_id: 'CS102', year: '2024-2025', semester: 2, grade: null },
    { student_id: '22120020', class_id: '22CTT3', course_id: 'CS101', year: '2024-2025', semester: 1, grade: 10 },
    { student_id: '22120020', class_id: '22CTT4', course_id: 'CS102', year: '2024-2025', semester: 2, grade: null },
    { student_id: '22120066', class_id: '22CTT2', course_id: 'CS101', year: '2024-2025', semester: 1, grade: 8.5 },
    { student_id: '22120066', class_id: '22CTT5', course_id: 'CS102', year: '2024-2025', semester: 2, grade: null },
    { student_id: '22120099', class_id: '22CTT3', course_id: 'CS101', year: '2024-2025', semester: 1, grade: 9.5 },
    { student_id: '22120099', class_id: '22CTT5', course_id: 'CS102', year: '2024-2025', semester: 2, grade: null },
  ]);
};
