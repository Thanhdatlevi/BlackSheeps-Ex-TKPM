/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('class').del()
  await knex('class').insert([
    { class_id: '22CTT2', course_id: 'CS101', year: '2024-2025', semester: 1, lecturer: 'Trương Hoàng Anh', maximum: 80, schedule: 'Mon-Wed-Fri 9:00-10:30', room: 'E101' },
    { class_id: '22CTT3', course_id: 'CS101', year: '2024-2025', semester: 1, lecturer: 'Nguyễn Thị Diệu', maximum: 80, schedule: 'Tue-Thu 10:30-12:00', room: 'F102' },
    { class_id: '22CTT4', course_id: 'CS102', year: '2024-2025', semester: 2, lecturer: 'Vũ văn Lâm', maximum: 45, schedule: 'Mon-Wed 14:00-15:30', room: 'D203' },
    { class_id: '22CTT4', course_id: 'CS103', year: '2024-2025', semester: 2, lecturer: 'Huỳnh Ngọc Tiền', maximum: 85, schedule: 'Mon-Wed 14:00-15:30', room: 'C103' },
    { class_id: '22CTT5', course_id: 'CS102', year: '2024-2025', semester: 2, lecturer: 'Nguyễn Thị Diệu', maximum: 65, schedule: 'Mon-Wed 14:00-15:30', room: 'F303' }
  ]);
};
