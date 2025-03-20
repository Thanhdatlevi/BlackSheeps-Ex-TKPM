/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('address').del()
  await knex('address').insert([
    {
      student_id: '19120005', address_type: 'thuongtru', street_address: '909 Điện Biên Phủ',
      ward: 'Phường 1', district: 'Quận 1', city: 'TP Hồ Chí Minh', country: 'Vietnam'
    },
    {
      student_id: '19120005', address_type: 'nhanthu', street_address: '123 Nguyễn Trãi',
      ward: 'Phường 2', district: 'Quận Phú Nhuận', city: 'TP Hồ Chí Minh', country: 'Vietnam'
    },
    {
      student_id: '20120004', address_type: 'thuongtru', street_address: '456 Lê Lợi',
      ward: 'Phường 10', district: 'Quận Gò vấp', city: 'TP Hồ Chí Minh', country: 'Vietnam'
    },
    {
      student_id: '20120004', address_type: 'nhanthu', street_address: '111 Hùng Vương',
      ward: 'Phường 3', district: 'Quận 9', city: 'TP Hồ Chí Minh', country: 'Vietnam'
    },
    {
      student_id: '22120001', address_type: 'tamtru', street_address: '222 Nguyễn Văn Cừ',
      ward: 'Phường 9', district: 'Quận 8', city: 'TP Hồ Chí Minh', country: 'Vietnam'
    },
    {
      student_id: '22120001', address_type: 'nhanthu', street_address: '789 Trần Hưng Đạo',
      ward: 'Phường 7', district: 'Quận 5', city: 'TP Hồ Chí Minh', country: 'Vietnam'
    },
    {
      student_id: '22120002', address_type: 'thuongtru', street_address: '101 Lê Duẩn',
      ward: 'Phường 8', district: 'Quận 7', city: 'TP Hồ Chí Minh', country: 'Vietnam'
    },
    {
      student_id: '22120002', address_type: 'nhanthu', street_address: '333 Lê Hồng Phong',
      ward: 'Phường 1', district: 'Quận 3', city: 'TP Hồ Chí Minh', country: 'Vietnam'
    },
    {
      student_id: '22120003', address_type: 'tamtru', street_address: '444 Phan CHân Trinh',
      ward: 'Phường 3', district: 'Quận 2', city: 'TP Hồ Chí Minh', country: 'Vietnam'
    },
    {
      student_id: '22120003', address_type: 'nhanthu', street_address: '78 Nguyễn Văn Cừ',
      ward: 'Phường 5', district: 'Quận Gò Vấp', city: 'TP Hồ Chí Minh', country: 'Vietnam'
    }
  ]);
};
