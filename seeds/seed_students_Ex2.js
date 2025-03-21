/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Định nghĩa dữ liệu cần cập nhật
  const updates = [
    {
      student_id: '19120005', faculty_id: 1, program_id: 1, status_id: 3, nationality: 'Vietnam'
    },
    {
      student_id: '20120004', faculty_id: 2, program_id: 2, status_id: 1, nationality: 'Vietnam'
    },
    {
      student_id: '22120001', faculty_id: 3, program_id: 3, status_id: 4, nationality: 'Vietnam'
    },
    {
      student_id: '22120002', faculty_id: 1, program_id: 2, status_id: 2, nationality: 'Vietnam'
    },
    {
      student_id: '22120003', faculty_id: 4, program_id: 1, status_id: 1, nationality: 'Vietnam'
    },
  ];

  // Duyệt từng phần tử để cập nhật theo `student_id`
  for (const student of updates) {
    await knex('students')
      .where({ student_id: student.student_id }) // Xác định bản ghi theo student_id
      .update({
        faculty: student.faculty_id,
        education_program: student.program_id,
        student_status: student.status_id,
        nationality: student.nationality
      });
  }
};
