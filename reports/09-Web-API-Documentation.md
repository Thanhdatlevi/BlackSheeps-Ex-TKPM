# 📘 Tài Liệu Hướng Dẫn Lập Trình Viên - Tài Liệu Web API

## 🧠 Giới Thiệu

Tài liệu này cung cấp hướng dẫn chi tiết về các Web API endpoints của Hệ thống Quản lý Sinh viên. Hệ thống được xây dựng với Node.js, Express.js và PostgreSQL, tuân theo kiến trúc MVC modular.

---

## 🌐 Thông Tin Cơ Bản

### Base URL
```
http://localhost:3000
```

### Xác Thực
Hiện tại hệ thống chưa implement xác thực. Tất cả các endpoints đều có thể truy cập công khai.

### Định Dạng Response Chung
Tất cả API responses đều tuân theo cấu trúc:
```json
{
  "success": boolean,
  "message": "string",
  "data": object | array (optional)
}
```

### Hỗ Trợ Đa Ngôn Ngữ (i18n)
Hệ thống hỗ trợ tiếng Việt và tiếng Anh thông qua:
- Query parameter: `?lang=vi` hoặc `?lang=en`
- Cookie lưu trữ ngôn ngữ ưa thích

---

## 👨‍🎓 API Quản Lý Sinh Viên

### 1. Trang Thêm Sinh Viên
**GET** `/`
- **Mô tả**: Hiển thị trang form thêm sinh viên mới
- **Query Parameters**: Không có
- **Response**: 
  - `200 OK`: HTML page (Handlebars template)
  - `500 Internal Server Error`: Lỗi máy chủ

### 2. Thêm Sinh Viên Mới
**POST** `/add`
- **Mô tả**: Thêm sinh viên mới vào hệ thống
- **Request Body**:
```json
{
  "mssv": "string (required) - Mã số sinh viên",
  "name": "string (required) - Họ và tên",
  "dob": "date (YYYY-MM-DD) - Ngày sinh",
  "gender": "string - Giới tính",
  "course": "string - Khóa học",
  "faculty": "number - ID khoa", 
  "program": "number - ID chương trình đào tạo",
  "status": "number - ID trạng thái sinh viên",
  "email": "string - Email",
  "phone": "string - Số điện thoại"
}
```
- **Response**:
  - `201 Created`: 
    ```json
    {
      "message": "Student added successfully",
      "student": {
        "student_id": "string",
        "full_name": "string",
        "date_of_birth": "date",
        "gender": "string",
        "academic_year": "string",
        "email": "string",
        "phone_string": "string",
        "faculty_id": "number",
        "education_program": "number",
        "student_status": "number"
      }
    }
    ```
  - `400 Bad Request`: 
    ```json
    {
      "message": "Student ID already exists. Please use a different ID."
    }
    ```
  - `500 Internal Server Error`:
    ```json
    {
      "message": "Failed to add student. Please try again later."
    }
    ```

### 3. Trang Tìm Kiếm Sinh Viên
**GET** `/search`
- **Mô tả**: Hiển thị trang tìm kiếm sinh viên
- **Query Parameters**: Không có
- **Response**: 
  - `200 OK`: HTML page với form tìm kiếm
  - `500 Internal Server Error`: Lỗi máy chủ

### 4. Tìm Kiếm Sinh Viên
**GET** `/search-student`
- **Mô tả**: Tìm kiếm sinh viên theo các tiêu chí
- **Query Parameters**:
  - `mssv`: Mã số sinh viên (optional)
  - `name`: Tên sinh viên (optional)
  - `khoa`: ID khoa (optional)
- **Response**:
```json
{
  "success": true,
  "students": [
    {
      "student_id": "string",
      "full_name": "string",
      "date_of_birth": "date",
      "gender": "string",
      "academic_year": "string",
      "email": "string",
      "phone": "string",
      "faculty": "number",
      "education_program": "number",
      "student_status": "number",
      "permanentAddress": "object",
      "temporaryAddress": "object",
      "mailingAddress": "object"
    }
  ]
}
```

### 5. Trang Cập Nhật Sinh Viên
**GET** `/update`
- **Mô tả**: Hiển thị trang cập nhật thông tin sinh viên
- **Query Parameters**: Không có
- **Response**: 
  - `200 OK`: HTML page với form cập nhật
  - `500 Internal Server Error`: Lỗi máy chủ

### 6. Cập Nhật Thông Tin Sinh Viên
**PUT** `/update/student`
- **Mô tả**: Cập nhật thông tin sinh viên
- **Request Body**: 
```json
{
  "mssv": "string (required) - Mã số sinh viên",
  "name": "string (required) - Họ và tên",
  "dob": "date (YYYY-MM-DD) - Ngày sinh",
  "gender": "string - Giới tính",
  "course": "string - Khóa học",
  "faculty": "number - ID khoa",
  "program": "number - ID chương trình đào tạo", 
  "status": "number - ID trạng thái sinh viên",
  "email": "string - Email",
  "phone": "string - Số điện thoại"
}
```
- **Response**:
  - `200 OK`: 
    ```json
    {
      "message": "Student updated successfully",
      "student": {
        "student_id": "string",
        "full_name": "string",
        "date_of_birth": "date",
        "gender": "string",
        "academic_year": "string",
        "email": "string",
        "phone_string": "string",
        "faculty_id": "number",
        "education_program": "number", 
        "student_status": "number"
      }
    }
    ```
  - `404 Not Found`: 
    ```json
    {
      "message": "Student not found"
    }
    ```
  - `400 Bad Request`: 
    ```json
    {
      "message": "Invalid input data"
    }
    ```
  - `500 Internal Server Error`:
    ```json
    {
      "message": "Failed to update student. Please try again later."
    }
    ```

### 7. Trang Xóa Sinh Viên
**GET** `/delete`
- **Mô tả**: Hiển thị trang xóa sinh viên
- **Query Parameters**: Không có
- **Response**: 
  - `200 OK`: HTML page với form xóa
  - `500 Internal Server Error`: Lỗi máy chủ

### 8. Xóa Sinh Viên
**DELETE** `/delete-student`
- **Mô tả**: Xóa sinh viên khỏi hệ thống
- **Request Body**:
```json
{
  "mssv": "string (required) - Mã số sinh viên"
}
```
- **Response**:
  - `200 OK`: 
    ```json
    {
      "message": "Student deleted successfully"
    }
    ```
  - `404 Not Found`: 
    ```json
    {
      "message": "Mã số sinh viên không tồn tại!"
    }
    ```
  - `500 Internal Server Error`:
    ```json
    {
      "message": "Failed to delete student. Please try again later."
    }
    ```

### 9. Xuất Danh Sách Sinh Viên (CSV)
**GET** `/export/csv`
- **Mô tả**: Xuất danh sách sinh viên dưới định dạng CSV
- **Query Parameters**: Không có
- **Response**: 
  - `200 OK`: File CSV download
  - `404 Not Found`: Không có sinh viên để xuất
  - `500 Internal Server Error`: Lỗi máy chủ

### 10. Xuất Danh Sách Sinh Viên (Excel)
**GET** `/export/excel`
- **Mô tả**: Xuất danh sách sinh viên dưới định dạng Excel
- **Query Parameters**: Không có
- **Response**: 
  - `200 OK`: File Excel download
  - `404 Not Found`: Không có sinh viên để xuất
  - `500 Internal Server Error`: Lỗi máy chủ

### 11. Nhập Dữ Liệu Sinh Viên (CSV)
**POST** `/import/csv`
- **Mô tả**: Nhập dữ liệu sinh viên từ file CSV
- **Request**: Multipart form data với file CSV
- **Headers**: `Content-Type: multipart/form-data`
- **Form Data**: 
  - `file`: File CSV chứa dữ liệu sinh viên
- **Response**: 
  - `200 OK`: 
    ```json
    {
      "message": "Import successful",
      "imported": "number - số sinh viên đã import",
      "failed": "number - số sinh viên import thất bại"
    }
    ```
  - `400 Bad Request`: File không hợp lệ
  - `500 Internal Server Error`: Lỗi trong quá trình import

### 12. Nhập Dữ Liệu Sinh Viên (Excel)
**POST** `/import/excel`
- **Mô tả**: Nhập dữ liệu sinh viên từ file Excel
- **Request**: Multipart form data với file Excel
- **Headers**: `Content-Type: multipart/form-data`
- **Form Data**: 
  - `file`: File Excel chứa dữ liệu sinh viên
- **Response**: 
  - `200 OK`: 
    ```json
    {
      "message": "Import successful",
      "imported": "number - số sinh viên đã import",
      "failed": "number - số sinh viên import thất bại"
    }
    ```
  - `400 Bad Request`: File không hợp lệ
  - `500 Internal Server Error`: Lỗi trong quá trình import

---

## 📚 API Quản Lý Môn Học

### 1. Trang Thêm Môn Học
**GET** `/course/addCoursePage`
- **Mô tả**: Hiển thị trang form thêm môn học mới
- **Query Parameters**: Không có
- **Response**: 
  - `200 OK`: HTML page
  - `500 Internal Server Error`: Lỗi máy chủ

### 2. Thêm Môn Học Mới
**POST** `/course/addCourse`
- **Mô tả**: Thêm môn học mới vào hệ thống
- **Request Body**:
```json
{
  "courseCode": "string (required) - Mã môn học",
  "courseName": "string (required) - Tên môn học",
  "courseNameEn": "string (required) - Tên môn học (tiếng Anh)",
  "credits": "number (required) - Số tín chỉ",
  "faculty": "number - ID khoa",
  "description": "string - Mô tả môn học",
  "descriptionEn": "string - Mô tả môn học (tiếng Anh)",
  "prerequisite": "string - Môn học tiên quyết"
}
```
- **Response**:
  - `201 Created`: 
    ```json
    {
      "success": true,
      "message": "Add course successfully",
      "course": {
        "course_id": "string",
        "course_name": "string",
        "course_name_en": "string",
        "credit": "number",
        "faculty": "number",
        "description": "string",
        "description_en": "string",
        "prerequisite": "string"
      }
    }
    ```
  - `409 Conflict`: 
    ```json
    {
      "success": false,
      "message": "Course ID already exists. Please use a different course code.",
      "error": "DUPLICATE_COURSE_ID"
    }
    ```
  - `500 Internal Server Error`:
    ```json
    {
      "success": false,
      "message": "Failed to add course. Please try again later."
    }
    ```

### 3. Lấy Tất Cả Môn Học
**GET** `/course/getAllCourses`
- **Mô tả**: Lấy danh sách tất cả môn học với hỗ trợ đa ngôn ngữ
- **Query Parameters**:
  - `lang`: Mã ngôn ngữ (`vi` hoặc `en`, mặc định: `vi`)
- **Response**:
```json
{
  "success": true,
  "courses": [
    {
      "course_id": "string",
      "course_name": "string",
      "credit": "number",
      "faculty": "number",
      "description": "string",
      "prerequisite": "string"
    }
  ]
}
```

### 4. Tìm Môn Học Theo ID
**GET** `/course/searchCourseById`
- **Mô tả**: Tìm kiếm môn học theo ID
- **Query Parameters**:
  - `courseId`: ID môn học (required)
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "message": "Search course successfully",
      "course": {
        "course_id": "string",
        "course_name": "string",
        "credit": "number",
        "faculty": "number",
        "description": "string",
        "prerequisite": "string"
      }
    }
    ```
  - `400 Bad Request`: 
    ```json
    {
      "success": false,
      "message": "courseId is required."
    }
    ```
  - `500 Internal Server Error`:
    ```json
    {
      "message": "Failed to search course. Please try again later."
    }
    ```

### 5. Cập Nhật Môn Học
**PUT** `/course/updateCourse`
- **Mô tả**: Cập nhật thông tin môn học
- **Query Parameters**:
  - `lang`: Mã ngôn ngữ (`vi` hoặc `en`, mặc định: `en`)
- **Request Body**: 
```json
{
  "courseCode": "string (required) - Mã môn học",
  "courseName": "string (required) - Tên môn học",
  "courseNameEn": "string (required) - Tên môn học (tiếng Anh)",
  "credits": "number (required) - Số tín chỉ",
  "faculty": "number - ID khoa",
  "description": "string - Mô tả môn học",
  "descriptionEn": "string - Mô tả môn học (tiếng Anh)",
  "prerequisite": "string - Môn học tiên quyết"
}
```
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "message": "Update course successfully",
      "course": {
        "course_id": "string",
        "course_name": "string",
        "credit": "number",
        "faculty": "number",
        "description": "string",
        "prerequisite": "string"
      }
    }
    ```
  - `404 Not Found`: Course không tồn tại
  - `500 Internal Server Error`: Lỗi máy chủ

### 6. Cập Nhật Trạng Thái Môn Học
**PUT** `/course/updateCourseStatus`
- **Mô tả**: Cập nhật trạng thái của môn học
- **Request Body**:
```json
{
  "courseId": "string (required) - Mã môn học",
  "status": "string (required) - Trạng thái mới"
}
```
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "message": "Update course status successfully"
    }
    ```
  - `500 Internal Server Error`: Lỗi máy chủ

### 7. Xóa Môn Học
**DELETE** `/course/deleteCourse`
- **Mô tả**: Xóa môn học (chỉ được phép trong vòng 30 phút sau khi tạo và không có lớp học nào)
- **Request Body**:
```json
{
  "courseId": "string (required) - Mã môn học"
}
```
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "message": "Delete course successfully",
      "course": {
        "course_id": "string",
        "course_name": "string"
      }
    }
    ```
  - `400 Bad Request`: Không thể xóa môn học (có lớp học hoặc quá thời hạn)
  - `404 Not Found`: Môn học không tồn tại
  - `500 Internal Server Error`: Lỗi máy chủ

### 8. Trang Chỉnh Sửa Môn Học
**GET** `/course/editCoursePage`
- **Mô tả**: Hiển thị trang chỉnh sửa môn học
- **Query Parameters**: Không có
- **Response**: 
  - `200 OK`: HTML page
  - `500 Internal Server Error`: Lỗi máy chủ

### 9. Kiểm Tra Môn Học Có Trong Lớp
**GET** `/course/isCourseNameExists`
- **Mô tả**: Kiểm tra xem môn học có đang được sử dụng trong lớp học nào không
- **Query Parameters**:
  - `courseId`: ID môn học (required)
- **Response**:
  - `200 OK`: 
    ```json
    {
      "exists": "boolean",
      "message": "string"
    }
    ```
  - `500 Internal Server Error`: Lỗi máy chủ

---

## 🏛️ API Quản Lý Lớp Học

### 1. Trang Quản Lý Lớp Học
**GET** `/class/`
- **Mô tả**: Hiển thị trang quản lý lớp học
- **Query Parameters**: Không có
- **Response**: 
  - `200 OK`: HTML page
  - `500 Internal Server Error`: Lỗi máy chủ

### 2. Thêm Lớp Học Mới
**POST** `/class/`
- **Mô tả**: Tạo lớp học mới cho một môn học
- **Request Body**:
```json
{
  "class_id": "string (required) - Mã lớp học",
  "course_id": "string (required) - Mã môn học",
  "year": "string (required) - Năm học",
  "semester": "number (required) - Học kỳ",
  "lecturer": "string - Giảng viên",
  "maximum": "number - Số lượng sinh viên tối đa",
  "schedule": "string - Lịch học",
  "room": "string - Phòng học"
}
```
- **Response**:
  - `201 Created`: 
    ```json
    {
      "success": true,
      "message": "Class added successfully",
      "class": {
        "class_id": "string",
        "course_id": "string",
        "year": "string",
        "semester": "number",
        "lecturer": "string",
        "maximum": "number",
        "schedule": "string",
        "room": "string"
      }
    }
    ```
  - `409 Conflict`: Mã lớp đã tồn tại
  - `400 Bad Request`: Dữ liệu không hợp lệ
  - `500 Internal Server Error`: Lỗi máy chủ

### 3. Cập Nhật Lớp Học
**PUT** `/class/`
- **Mô tả**: Cập nhật thông tin lớp học
- **Request Body**: Tương tự như API thêm lớp học
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "message": "Class updated successfully",
      "class": {
        "class_id": "string",
        "course_id": "string",
        "year": "string",
        "semester": "number",
        "lecturer": "string",
        "maximum": "number",
        "schedule": "string",
        "room": "string"
      }
    }
    ```
  - `404 Not Found`: Lớp học không tồn tại
  - `500 Internal Server Error`: Lỗi máy chủ

### 4. Lấy Tất Cả Lớp Học
**GET** `/class/classes`
- **Mô tả**: Lấy danh sách tất cả lớp học
- **Query Parameters**: Không có
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "classes": [
        {
          "class_id": "string",
          "course_id": "string",
          "course_name": "string",
          "year": "string",
          "semester": "number",
          "lecturer": "string",
          "maximum": "number",
          "current_enrollment": "number",
          "schedule": "string",
          "room": "string"
        }
      ]
    }
    ```
  - `500 Internal Server Error`: Lỗi máy chủ

### 5. Trang Thêm Sinh Viên Vào Lớp
**GET** `/class/student`
- **Mô tả**: Hiển thị trang thêm sinh viên vào lớp học
- **Query Parameters**: Không có
- **Response**: 
  - `200 OK`: HTML page
  - `500 Internal Server Error`: Lỗi máy chủ

### 6. Thêm Sinh Viên Vào Lớp
**POST** `/class/student`
- **Mô tả**: Đăng ký sinh viên vào lớp học
- **Request Body**:
```json
{
  "student_id": "string (required) - Mã sinh viên",
  "class_id": "string (required) - Mã lớp học",
  "course_id": "string (required) - Mã môn học",
  "year": "string (required) - Năm học",
  "semester": "number (required) - Học kỳ"
}
```
- **Response**:
  - `201 Created`: 
    ```json
    {
      "success": true,
      "message": "Student added to class successfully"
    }
    ```
  - `409 Conflict`: Sinh viên đã đăng ký lớp này
  - `400 Bad Request`: Lớp đã đầy hoặc dữ liệu không hợp lệ
  - `404 Not Found`: Sinh viên hoặc lớp học không tồn tại
  - `500 Internal Server Error`: Lỗi máy chủ

### 7. Cập Nhật Sinh Viên Trong Lớp
**PUT** `/class/student`
- **Mô tả**: Cập nhật thông tin sinh viên trong lớp
- **Request Body**:
```json
{
  "student_id": "string (required) - Mã sinh viên",
  "class_id": "string (required) - Mã lớp học",
  "course_id": "string (required) - Mã môn học",
  "year": "string (required) - Năm học",
  "semester": "number (required) - Học kỳ",
  "grade": "number - Điểm số (optional)"
}
```
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "message": "Student information updated successfully"
    }
    ```
  - `404 Not Found`: Không tìm thấy đăng ký
  - `500 Internal Server Error`: Lỗi máy chủ

### 8. Lấy Danh Sách Môn Học
**GET** `/class/courses`
- **Mô tả**: Lấy danh sách môn học để chọn khi tạo lớp
- **Query Parameters**: Không có
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "courses": [
        {
          "course_id": "string",
          "course_name": "string",
          "credit": "number",
          "faculty": "number"
        }
      ]
    }
    ```
  - `500 Internal Server Error`: Lỗi máy chủ

### 9. Lấy Danh Sách Năm Học
**GET** `/class/year`
- **Mô tả**: Lấy danh sách năm học có sẵn
- **Query Parameters**: Không có
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "years": ["2023", "2024", "2025"]
    }
    ```
  - `500 Internal Server Error`: Lỗi máy chủ

---

## 🏫 API Quản Lý Khoa

### 1. Lấy Tất Cả Khoa
**GET** `/faculty/faculties`
- **Mô tả**: Lấy danh sách tất cả các khoa
- **Query Parameters**: Không có
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "faculties": [
        {
          "faculty_id": "number",
          "faculty_name": "string"
        }
      ]
    }
    ```
  - `500 Internal Server Error`: Lỗi máy chủ

### 2. Thêm Khoa Mới
**POST** `/addFaculty`
- **Mô tả**: Thêm khoa mới vào hệ thống
- **Request Body**:
```json
{
  "faculty_name": "string (required) - Tên khoa"
}
```
- **Response**:
  - `201 Created`: 
    ```json
    {
      "success": true,
      "message": "Faculty added successfully",
      "faculty": {
        "faculty_id": "number",
        "faculty_name": "string"
      }
    }
    ```
  - `409 Conflict`: Tên khoa đã tồn tại
  - `400 Bad Request`: Dữ liệu không hợp lệ
  - `500 Internal Server Error`: Lỗi máy chủ

### 3. Cập Nhật Khoa
**POST** `/updateFaculty`
- **Mô tả**: Cập nhật thông tin khoa
- **Request Body**:
```json
{
  "faculty_id": "number (required) - ID khoa",
  "faculty_name": "string (required) - Tên khoa mới"
}
```
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "message": "Faculty updated successfully",
      "faculty": {
        "faculty_id": "number",
        "faculty_name": "string"
      }
    }
    ```
  - `404 Not Found`: Khoa không tồn tại
  - `500 Internal Server Error`: Lỗi máy chủ

### 4. Tìm Khoa Theo Tên
**GET** `/searchFacultyByName`
- **Mô tả**: Tìm kiếm khoa theo tên
- **Query Parameters**:
  - `name`: Tên khoa cần tìm (required)
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "faculties": [
        {
          "faculty_id": "number",
          "faculty_name": "string"
        }
      ]
    }
    ```
  - `404 Not Found`: Không tìm thấy khoa
  - `500 Internal Server Error`: Lỗi máy chủ

---

## 🎓 API Quản Lý Chương Trình Đào Tạo

### 1. Lấy Tất Cả Chương Trình
**GET** `/program/programs`
- **Mô tả**: Lấy danh sách tất cả chương trình đào tạo
- **Query Parameters**: Không có
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "programs": [
        {
          "program_id": "number",
          "program_name": "string"
        }
      ]
    }
    ```
  - `500 Internal Server Error`: Lỗi máy chủ

### 2. Thêm Chương Trình Mới
**POST** `/addProgram`
- **Mô tả**: Thêm chương trình đào tạo mới
- **Request Body**:
```json
{
  "program_name": "string (required) - Tên chương trình đào tạo"
}
```
- **Response**:
  - `201 Created`: 
    ```json
    {
      "success": true,
      "message": "Program added successfully",
      "program": {
        "program_id": "number",
        "program_name": "string"
      }
    }
    ```
  - `409 Conflict`: Tên chương trình đã tồn tại
  - `400 Bad Request`: Dữ liệu không hợp lệ
  - `500 Internal Server Error`: Lỗi máy chủ

### 3. Cập Nhật Chương Trình
**POST** `/updateProgram`
- **Mô tả**: Cập nhật thông tin chương trình đào tạo
- **Request Body**:
```json
{
  "program_id": "number (required) - ID chương trình",
  "program_name": "string (required) - Tên chương trình mới"
}
```
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "message": "Program updated successfully",
      "program": {
        "program_id": "number",
        "program_name": "string"
      }
    }
    ```
  - `404 Not Found`: Chương trình không tồn tại
  - `500 Internal Server Error`: Lỗi máy chủ

### 4. Tìm Chương Trình Theo Tên
**GET** `/searchProgramByName`
- **Mô tả**: Tìm kiếm chương trình đào tạo theo tên
- **Query Parameters**:
  - `name`: Tên chương trình cần tìm (required)
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "programs": [
        {
          "program_id": "number",
          "program_name": "string"
        }
      ]
    }
    ```
  - `404 Not Found`: Không tìm thấy chương trình
  - `500 Internal Server Error`: Lỗi máy chủ

---

## 📊 API Quản Lý Trạng Thái Sinh Viên

### 1. Lấy Tất Cả Trạng Thái
**GET** `/status/statuses`
- **Mô tả**: Lấy danh sách tất cả trạng thái sinh viên
- **Query Parameters**: Không có
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "status": [
        {
          "status_id": "number",
          "status_name": "string"
        }
      ]
    }
    ```
  - `500 Internal Server Error`: Lỗi máy chủ

### 2. Thêm Trạng Thái Mới
**POST** `/addStatus`
- **Mô tả**: Thêm trạng thái sinh viên mới
- **Request Body**:
```json
{
  "status_name": "string (required) - Tên trạng thái"
}
```
- **Response**:
  - `201 Created`: 
    ```json
    {
      "success": true,
      "message": "Status added successfully",
      "status": {
        "status_id": "number",
        "status_name": "string"
      }
    }
    ```
  - `409 Conflict`: Tên trạng thái đã tồn tại
  - `500 Internal Server Error`: Lỗi máy chủ

### 3. Cập Nhật Trạng Thái
**POST** `/updateStatus`
- **Mô tả**: Cập nhật thông tin trạng thái sinh viên
- **Request Body**:
```json
{
  "status_id": "number (required) - ID trạng thái",
  "status_name": "string (required) - Tên trạng thái mới"
}
```
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "message": "Status updated successfully",
      "status": {
        "status_id": "number",
        "status_name": "string"
      }
    }
    ```
  - `404 Not Found`: Trạng thái không tồn tại
  - `500 Internal Server Error`: Lỗi máy chủ

---

## 📧 API Quản Lý Email Domain

### 1. Lấy Tất Cả Email Domain Được Phép
**GET** `/email/emails`
- **Mô tả**: Lấy danh sách tất cả email domain được phép
- **Query Parameters**: Không có
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "emails": [
        {
          "domain_id": "number",
          "domain_name": "string",
          "is_active": "boolean"
        }
      ]
    }
    ```
  - `500 Internal Server Error`: Lỗi máy chủ

### 2. Thêm Email Domain
**POST** `/addEmail`
- **Mô tả**: Thêm email domain mới được phép
- **Request Body**:
```json
{
  "domain_name": "string (required) - Tên domain (ví dụ: gmail.com)",
  "is_active": "boolean - Trạng thái hoạt động (mặc định: true)"
}
```
- **Response**:
  - `201 Created`: 
    ```json
    {
      "success": true,
      "message": "Email domain added successfully",
      "domain": {
        "domain_id": "number",
        "domain_name": "string",
        "is_active": "boolean"
      }
    }
    ```
  - `409 Conflict`: Domain đã tồn tại
  - `400 Bad Request`: Domain không hợp lệ
  - `500 Internal Server Error`: Lỗi máy chủ

### 3. Cập Nhật Email Domain
**POST** `/updateEmail`
- **Mô tả**: Cập nhật thông tin email domain
- **Request Body**:
```json
{
  "domain_id": "number (required) - ID domain",
  "domain_name": "string (required) - Tên domain mới",
  "is_active": "boolean - Trạng thái hoạt động"
}
```
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "message": "Email domain updated successfully",
      "domain": {
        "domain_id": "number",
        "domain_name": "string",
        "is_active": "boolean"
      }
    }
    ```
  - `404 Not Found`: Domain không tồn tại
  - `500 Internal Server Error`: Lỗi máy chủ

### 4. Xóa Email Domain
**DELETE** `/deleteEmail`
- **Mô tả**: Xóa email domain khỏi danh sách được phép
- **Request Body**:
```json
{
  "domain_id": "number (required) - ID domain"
}
```
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "message": "Email domain deleted successfully"
    }
    ```
  - `404 Not Found`: Domain không tồn tại
  - `400 Bad Request`: Không thể xóa domain đang được sử dụng
  - `500 Internal Server Error`: Lỗi máy chủ

---

## 🎯 API Quản Lý Đăng Ký Môn Học

### 1. Xóa Đăng Ký
**DELETE** `/registration/deleteRegistration`
- **Mô tả**: Hủy đăng ký của sinh viên khỏi lớp học
- **Request Body**:
```json
{
  "student_id": "string (required) - Mã sinh viên",
  "class_id": "string (required) - Mã lớp học",
  "course_id": "string (required) - Mã môn học",
  "year": "string (required) - Năm học",
  "semester": "number (required) - Học kỳ"
}
```
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "message": "Registration deleted successfully"
    }
    ```
  - `404 Not Found`: 
    ```json
    {
      "success": false,
      "message": "Registration not found"
    }
    ```
  - `400 Bad Request`: 
    ```json
    {
      "success": false,
      "message": "Missing required fields"
    }
    ```
  - `500 Internal Server Error`: 
    ```json
    {
      "success": false,
      "message": "Failed to delete registration. Please try again later."
    }
    ```

---

## 📋 API Quản Lý Điểm Số

### 1. Xuất Bảng Điểm Sinh Viên
**GET** `/grade/exportGrades`
- **Mô tả**: Xuất bảng điểm của sinh viên dưới định dạng Excel
- **Query Parameters**:
  - `student_id`: Mã số sinh viên (required)
  - `lang`: Ngôn ngữ (`vi` hoặc `en`, mặc định: `vi`)
- **Response**:
  - `200 OK`: File Excel download với headers:
    ```
    Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    Content-Disposition: attachment; filename="BangDiem_[StudentID].xlsx"
    ```
  - `400 Bad Request`: 
    ```json
    {
      "success": false,
      "message": "student_id is required"
    }
    ```
  - `404 Not Found`: 
    ```json
    {
      "success": false,
      "message": "Student not found or no grades available"
    }
    ```
  - `500 Internal Server Error`: 
    ```json
    {
      "success": false,
      "message": "Failed to export grades. Please try again later."
    }
    ```

---

## 🔍 API Quản Lý Địa Chỉ và Giấy Tờ

### 1. Cập Nhật Giấy Tờ Tùy Thân
**PUT** `/update/identification`
- **Mô tả**: Cập nhật thông tin giấy tờ tùy thân của sinh viên
- **Request Body**:
```json
{
  "student_id": "string (required) - Mã sinh viên",
  "id_type": "string (required) - Loại giấy tờ (CMND, CCCD, Passport)",
  "id_number": "string (required) - Số giấy tờ",
  "issue_date": "date - Ngày cấp (YYYY-MM-DD)",
  "expiry_date": "date - Ngày hết hạn (YYYY-MM-DD)",
  "issue_place": "string - Nơi cấp",
  "issue_country": "string - Quốc gia cấp",
  "has_chip": "boolean - Có chip hay không",
  "note": "string - Ghi chú"
}
```
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "message": "Identification updated successfully",
      "identification": {
        "student_id": "string",
        "id_type": "string",
        "id_number": "string",
        "issue_date": "date",
        "expiry_date": "date",
        "issue_place": "string",
        "issue_country": "string",
        "has_chip": "boolean",
        "note": "string"
      }
    }
    ```
  - `404 Not Found`: Sinh viên không tồn tại
  - `400 Bad Request`: Dữ liệu không hợp lệ
  - `500 Internal Server Error`: Lỗi máy chủ

### 2. Thêm Giấy Tờ Tùy Thân
**POST** `/add-identification`
- **Mô tả**: Thêm thông tin giấy tờ tùy thân cho sinh viên
- **Request Body**: Tương tự như API cập nhật giấy tờ
- **Response**:
  - `201 Created`: 
    ```json
    {
      "success": true,
      "message": "Identification added successfully",
      "identification": {
        "student_id": "string",
        "id_type": "string",
        "id_number": "string",
        "issue_date": "date",
        "expiry_date": "date",
        "issue_place": "string",
        "issue_country": "string",
        "has_chip": "boolean",
        "note": "string"
      }
    }
    ```
  - `409 Conflict`: Giấy tờ đã tồn tại cho sinh viên này
  - `400 Bad Request`: Dữ liệu không hợp lệ
  - `500 Internal Server Error`: Lỗi máy chủ

### 3. Cập Nhật Địa Chỉ
**PUT** `/update/address`
- **Mô tả**: Cập nhật địa chỉ của sinh viên
- **Request Body**:
```json
{
  "student_id": "string (required) - Mã sinh viên",
  "address_type": "string (required) - Loại địa chỉ (permanent, temporary, mailing)",
  "street_address": "string (required) - Địa chỉ chi tiết",
  "ward": "string - Phường/Xã",
  "district": "string - Quận/Huyện",
  "city": "string - Tỉnh/Thành phố",
  "country": "string - Quốc gia"
}
```
- **Response**:
  - `200 OK`: 
    ```json
    {
      "success": true,
      "message": "Address updated successfully",
      "address": {
        "student_id": "string",
        "address_type": "string",
        "street_address": "string",
        "ward": "string",
        "district": "string",
        "city": "string",
        "country": "string"
      }
    }
    ```
  - `404 Not Found`: Sinh viên hoặc địa chỉ không tồn tại
  - `400 Bad Request`: Dữ liệu không hợp lệ
  - `500 Internal Server Error`: Lỗi máy chủ

### 4. Thêm Địa Chỉ
**POST** `/add-address`
- **Mô tả**: Thêm địa chỉ mới cho sinh viên
- **Request Body**: Tương tự như API cập nhật địa chỉ
- **Response**:
  - `201 Created`: 
    ```json
    {
      "success": true,
      "message": "Address added successfully",
      "address": {
        "student_id": "string",
        "address_type": "string",
        "street_address": "string",
        "ward": "string",
        "district": "string",
        "city": "string",
        "country": "string"
      }
    }
    ```
  - `409 Conflict`: Địa chỉ loại này đã tồn tại cho sinh viên
  - `400 Bad Request`: Dữ liệu không hợp lệ
  - `500 Internal Server Error`: Lỗi máy chủ

---

## ⚠️ Xử Lý Lỗi

### Mã Lỗi HTTP Thường Gặp:
- `200`: Thành công
- `400`: Yêu cầu không hợp lệ (dữ liệu đầu vào sai)
- `404`: Không tìm thấy tài nguyên
- `409`: Xung đột (dữ liệu trùng lặp)
- `500`: Lỗi máy chủ nội bộ

### Cấu Trúc Lỗi:
```json
{
  "success": false,
  "message": "Mô tả lỗi chi tiết",
  "error": "Thông tin lỗi kỹ thuật (optional)"
}
```

---

## 📁 Upload/Download File

### Hỗ Trợ:
- **Upload**: File Excel/CSV để import dữ liệu sinh viên
- **Download**: File Excel/CSV cho danh sách sinh viên và bảng điểm

### Thư Viện Sử Dụng:
- `express-fileupload`: Xử lý upload file
- `xlsx`: Xử lý file Excel
- `fast-csv`: Xử lý file CSV

---

## 🗃️ Tham Chiếu Cơ Sở Dữ Liệu

### Các Bảng Chính:
- `students` - Thông tin sinh viên
- `course` - Định nghĩa môn học
- `class` - Lớp học cụ thể
- `register_subject` - Đăng ký môn học của sinh viên
- `faculties` - Khoa/Viện
- `education_programs` - Chương trình đào tạo
- `student_status` - Trạng thái sinh viên
- `address` - Địa chỉ sinh viên
- `identificationdocument` - Giấy tờ tùy thân
- `allowed_email_domains` - Domain email được phép

---

## 📝 Ghi Chú Kỹ Thuật

### Headers Yêu Cầu:
- **Content-Type**: `application/json` cho các API JSON
- **Content-Type**: `multipart/form-data` cho upload file

### Định Dạng Ngày Tháng:
- Tất cả ngày tháng đều sử dụng định dạng `YYYY-MM-DD`
- Timezone: UTC

### Xử Lý File:
- Kích thước file tối đa: 10MB
- Định dạng hỗ trợ: `.xlsx`, `.csv`
- Encoding: UTF-8

---

