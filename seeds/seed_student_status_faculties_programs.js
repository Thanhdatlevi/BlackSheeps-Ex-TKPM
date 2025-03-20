/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Xóa dữ liệu cũ trước khi chèn mới
  await knex('student_status').del();
  await knex('faculties').del();
  await knex('education_programs').del();

  // Thêm dữ liệu vào bảng student_status
  await knex('student_status').insert([
    { status_id: 1, status_name: 'Đang học' },
    { status_id: 2, status_name: 'Đã tốt nghiệp' },
    { status_id: 3, status_name: 'Đã thôi học' },
    { status_id: 4, status_name: 'Tạm dừng học' }
  ]);

  await knex('faculties').insert([
    { faculty_id: 1, faculty_name: 'Khoa Luật' },
    { faculty_id: 2, faculty_name: 'Khoa Tiếng Anh thương mại' },
    { faculty_id: 3, faculty_name: 'Khoa Tiếng Nhật' },
    { faculty_id: 4, faculty_name: 'Khoa Tiếng Pháp' }
  ]);

  // Thêm dữ liệu vào bảng education_programs
  await knex('education_programs').insert([
    { program_id: 1, program_name: 'Đại trà' },
    { program_id: 2, program_name: 'Đề án' },
    { program_id: 3, program_name: 'Đào tạo từ xa' }
  ]);
};
