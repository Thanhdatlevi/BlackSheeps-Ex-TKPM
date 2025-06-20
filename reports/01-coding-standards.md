# 📘 Hướng Dẫn Viết Mã Cho Developer – `studentController`

---

## 1. **Cấu trúc file & module**

* **Tách biệt chức năng rõ ràng:** Mỗi controller đảm nhiệm một chức năng cụ thể. Ví dụ: `studentController` chỉ xử lý các thao tác liên quan đến sinh viên.
* **Import rõ ràng, nhóm theo loại:**

  * Dịch vụ nội bộ (e.g., `studentService`, `facultyService`)
  * Thư viện cấu hình & logging (`logger`)
  * Thư viện bên thứ ba (`fast-csv`, `XLSX`, `csv-parser`, `fs`)

---

## 2. **Quy tắc đặt tên**

* **Tên file và class:** Sử dụng `camelCase`, ví dụ `studentController`.
* **Tên hàm:** Sử dụng `camelCase`, bắt đầu bằng động từ rõ ràng, ví dụ `addStudent`, `deletePage`, `exportStudentListCSV`.
* **Tên biến:**

  * Ưu tiên đặt tên mô tả rõ ý nghĩa: `newStudent`, `studentData`, `checkStudent`.
  * Dùng `const` cho hằng số và các biến không thay đổi.
* **Biến boolean:** Đặt tên gợi nghĩa rõ ràng, ví dụ `has_chip`.

---

## 3. **Xử lý lỗi**

* Luôn dùng `try/catch` cho các hàm bất đồng bộ (`async`) để xử lý lỗi.
* Ghi log lỗi với `logger.error` cùng thông điệp chi tiết.
* Trả về thông điệp lỗi rõ ràng cho phía client:

  * Mã lỗi HTTP:

    * `400` – Yêu cầu không hợp lệ
    * `404` – Không tìm thấy
    * `500` – Lỗi phía server
* Ghi chú lỗi cụ thể như:

  * “Student ID already exists”
  * “Không có dữ liệu để xuất”
  * “Thiếu file cần thiết”

---

## 4. **Giao tiếp dữ liệu**

* **Giao diện người dùng (views):** Dùng `res.render()` với layout và tiêu đề trang rõ ràng.
* **API JSON:** Phản hồi consistent với định dạng:

```json
{
  "message": "Thông điệp phản hồi",
  "data": "Nội dung nếu có"
}
```

---

## 5. **Kiểm tra đầu vào**

* Kiểm tra đầy đủ dữ liệu nhập vào:

  * Trong hàm `updateStudent`, lặp qua tất cả trường dữ liệu và cảnh báo nếu thiếu.
* Tránh nhập dữ liệu không hợp lệ vào DB.

---

## 6. **Xử lý file & định dạng dữ liệu**

* Hỗ trợ import/export qua `CSV` và `Excel`.
* Tách riêng logic xử lý theo từng định dạng (`exportCSV`, `exportExcel`).
* Định dạng ngày tháng đúng chuẩn ISO:

```js
date.toISOString().split("T")[0]
```

* Xử lý dữ liệu rỗng thành `null`.

---

## 7. **Tái sử dụng & chia nhỏ chức năng**

* Viết các hàm phụ trợ tách biệt, ví dụ:

  * `getStudentSupplementaryData` – Lấy thông tin bổ sung
  * `formatAddress` – Chuẩn hóa địa chỉ
  * `importStudentData` – Tái sử dụng cho cả import CSV và Excel
  * `addAddressIfPresent` – Tách riêng xử lý địa chỉ

---

## 8. **Logging**

* Sử dụng `logger.info`, `logger.warn`, `logger.error` ở tất cả điểm quan trọng.
* Ghi log giúp debug và giám sát hệ thống.

---

## 9. **Tương thích với hệ thống**

* Kết nối với nhiều dịch vụ khác:

  * `facultyService`, `programService`, `statusService`, `identificationService`, `addressService`
* Chuẩn hóa dữ liệu để khớp với ID trong hệ thống:

```js
const faculty = await facultyService.searchFacultyByName(student.faculty);
```

