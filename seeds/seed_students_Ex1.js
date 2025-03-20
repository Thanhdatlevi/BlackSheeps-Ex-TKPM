/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('students').del()
  await knex('students').insert([
    {
      student_id: '19120005', full_name: 'Pham Minh Hoang', date_of_birth: '2001-07-08', gender: 'Nam',
      faculty: 'Khoa Luật', academic_year: '2019-2023', education_program: 'Đại trà', 
      address: '321 Đường Ghi, Cần Thơ', email: 'pmh@gmail.com', phone: '0912345282', student_status: 'Đã tốt nghiệp'
    },
    {
      student_id: '20120004', full_name: 'Phạm Minh Danh', date_of_birth: '2002-09-13', gender: 'Nam',
      faculty: 'Khoa Tiếng Anh Thương Mại', academic_year: '2020-2024', education_program: 'Đề Án', 
      address: '321 Đường Ghi, Cần Thơ', email: 'pmd@gmail.com', phone: '0912348721', student_status: 'Đã thôi học'
    },
    {
      student_id: '22120001', full_name: 'Bùi Duy An', date_of_birth: '2004-09-15', gender: 'Nam',
      faculty: 'Khoa Tiếng Nhật', academic_year: '2022-2026', education_program: 'Đại trà', 
      address: '123 Đường Hoàng Văn Thụ, TPHCM', email: 'bda@gmail.com', phone: '0912122920', student_status: 'Đang học'
    },
    {
      student_id: '22120002', full_name: 'Trần Thị Anh', date_of_birth: '2004-12-03', gender: 'Nữ',
      faculty: 'Khoa Tiếng Anh Thương Mại', academic_year: '2020-2024', education_program: 'Đề Án', 
      address: '456 Đường Quang Trung, TPHCM', email: 'tta@gmail.com', phone: '0911282721', student_status: 'Tạm dừng học'
    },
    {
      student_id: '22120003', full_name: 'Lê Gia Bảo', date_of_birth: '2004-04-21', gender: 'Nam',
      faculty: 'Khoa Tiếng Pháp', academic_year: '2022-2026', education_program: 'Đại trà', 
      address: '456 Đường Phan Bội Châu, TPHCM', email: 'lgb@gmail.com', phone: '0912890021', student_status: 'Đang học'
    }
  ]);
};
