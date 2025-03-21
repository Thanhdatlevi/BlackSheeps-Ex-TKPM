/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('identificationdocument').del()
  await knex('identificationdocument').insert([
    {
      student_id: '19120005', id_type: 'CCCD', id_number: '012345678901', issue_date: '2022-06-15', issue_place: 'TP Hồ Chí Minh',
      expiry_date: '2030-06-15', has_chip: true, issue_country: null, note: null
    },
    {
      student_id: '19120005', id_type: 'CMND', id_number: '778899001122', issue_date: '2019-05-12', issue_place: 'TP Hồ Chí Minh',
      expiry_date: '2024-07-05', has_chip: null, issue_country: null, note: null
    },
    {
      student_id: '20120004', id_type: 'CCCD', id_number: '889900112233', issue_date: '2023-03-18', issue_place: 'Hà Nội',
      expiry_date: '2031-01-15', has_chip: true, issue_country: null, note: null
    },
    {
      student_id: '20120004', id_type: 'CMND', id_number: '098765432109', issue_date: '2020-01-15', issue_place: 'Hà Nội',
      expiry_date: '2025-01-15', has_chip: null, issue_country: null, note: null
    },
    {
      student_id: '22120001', id_type: 'CCCD', id_number: '889900117829', issue_date: '2024-11-05', issue_place: 'TP Hồ Chí Minh',
      expiry_date: '2032-09-25', has_chip: true, issue_country: null, note: null
    },
    {
      student_id: '22120002', id_type: 'CCCD', id_number: '812720117829', issue_date: '2024-06-23', issue_place: 'TP Hồ Chí Minh',
      expiry_date: '2032-03-12', has_chip: false, issue_country: null, note: null
    },
    {
      student_id: '22120003', id_type: 'passport', id_number: 'p987654321', issue_date: '2022-07-18', issue_place: 'Hà Nội',
      expiry_date: '2032-12-15', has_chip: null, issue_country: 'Vietnam', note: 'Hộ chiếu phổ thông'
    }
  ]);
};
