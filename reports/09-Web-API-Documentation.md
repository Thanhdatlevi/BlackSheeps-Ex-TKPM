# Tài Liệu Web API

## Giới Thiệu

Web API Hệ thống Quản lý Sinh viên cung cấp quyền truy cập vào tất cả các chức năng của nền tảng cũng như toàn quyền kiểm soát các thực thể cơ sở dữ liệu. Đây là một RESTful API được xây dựng theo các tiêu chuẩn web API hiện đại. Sử dụng các công cụ như Swagger UI hoặc Postman, các nhà phát triển có thể nhanh chóng học cách API hoạt động và tương tác với tất cả chức năng hệ thống.

Hệ thống Quản lý Sinh viên cung cấp một bộ API toàn diện cho phép các nhà phát triển:
- Đọc và ghi dữ liệu sinh viên
- Quản lý hồ sơ học tập và thông tin môn học
- Tương tác với các hệ thống và nền tảng bên ngoài
- Thêm chức năng mới vào nền tảng hiện có
- Xây dựng các tích hợp tùy chỉnh và ứng dụng di động

API cung cấp quyền truy cập vào tất cả các chức năng cốt lõi bao gồm quản lý sinh viên, quản trị môn học, đăng ký lớp học, theo dõi điểm số và các hoạt động quản trị.

### API Hệ Thống Cốt Lõi

Web API cung cấp quyền truy cập vào tất cả chức năng của Hệ thống Quản lý Sinh viên. Sử dụng các phương thức API này, bạn có thể có toàn quyền kiểm soát các chức năng như quản lý sinh viên, quản trị môn học, hồ sơ học tập và bất cứ điều gì bạn muốn kiểm soát trong hệ thống giáo dục. Sử dụng API này để xây dựng các ứng dụng như cổng thông tin sinh viên, bảng điều khiển học tập, hệ thống báo cáo và các ứng dụng khác cần truy cập vào các quy trình quản lý sinh viên.

Sau khi khởi động ứng dụng, bạn sẽ có thể xem danh sách các phương thức API hiện có bằng endpoint sau: `http://localhost:3000/api-docs` (khi Swagger UI được triển khai)

#### Phạm Vi và Quyền Hạn

Hiện tại, tất cả các endpoint API đều có thể truy cập công khai cho mục đích phát triển. Trong triển khai sản xuất, các cơ chế xác thực và ủy quyền phù hợp sẽ được triển khai để kiểm soát quyền truy cập vào các chức năng API khác nhau.

### API Quản Lý Sinh Viên
Các hoạt động CRUD hoàn chỉnh cho hồ sơ sinh viên bao gồm thông tin cá nhân, tình trạng học tập, lịch sử đăng ký và quản lý tài liệu. Hỗ trợ các hoạt động hàng loạt thông qua chức năng nhập/xuất CSV/Excel.

### API Quản Lý Môn Học
Quản lý danh mục môn học đầy đủ với hỗ trợ đa ngôn ngữ, theo dõi môn học tiên quyết và liên kết chương trình học tập.

### API Quản Lý Lớp Học  
Lập lịch lớp học, quản lý đăng ký, kiểm soát sức chứa với theo dõi tình trạng có sẵn theo thời gian thực và quản lý danh sách chờ.

### API Hồ Sơ Học Tập
Quản lý điểm số, tạo bảng điểm, theo dõi tiến độ học tập và phân tích hiệu suất.

### API Quản Trị
Quản lý khoa, cấu hình chương trình giáo dục, quản lý trạng thái sinh viên và cấu hình hệ thống.

## Định Dạng Phản Hồi

Tất cả phản hồi API đều tuân theo cấu trúc JSON nhất quán với mã trạng thái chuẩn hóa và xử lý lỗi.

### Cấu Trúc Phản Hồi Chuẩn

```json
{
  "success": boolean,
  "message": "string",
  "data": object | array (tùy chọn),
  "error": "string (tùy chọn)"
}
```

### Mã Trạng Thái HTTP

- `200 OK`: Yêu cầu thành công
- `201 Created`: Tài nguyên được tạo thành công  
- `400 Bad Request`: Tham số yêu cầu không hợp lệ
- `401 Unauthorized`: Yêu cầu xác thực (triển khai tương lai)
- `403 Forbidden`: Không đủ quyền (triển khai tương lai)
- `404 Not Found`: Không tìm thấy tài nguyên
- `409 Conflict`: Tài nguyên đã tồn tại hoặc vi phạm ràng buộc
- `422 Unprocessable Entity`: Lỗi xác thực
- `500 Internal Server Error`: Lỗi máy chủ

### Loại Nội Dung

- **Yêu cầu**: `application/json` cho JSON payload
- **Yêu cầu**: `multipart/form-data` cho tải lên tệp
- **Phản hồi**: `application/json` cho phản hồi JSON
- **Phản hồi**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` cho tệp Excel
- **Phản hồi**: `text/csv` cho tệp CSV

### Hỗ Trợ Quốc Tế Hóa

Hệ thống hỗ trợ nhiều ngôn ngữ thông qua:
- **Tham Số Truy Vấn**: `?lang=vi` (Tiếng Việt) hoặc `?lang=en` (Tiếng Anh)
- **Lưu Trữ Cookie**: Tùy chọn ngôn ngữ được duy trì qua các yêu cầu
- **Mặc Định**: Tiếng Việt (`vi`) khi không chỉ định ngôn ngữ

## URL Cơ Sở và Cấu Hình

```
http://localhost:3000
```

## Cấu Trúc API Tổng Quát

### Quy Tắc Đường Dẫn (Endpoint)

Tất cả các đường dẫn API được thiết kế theo nguyên tắc RESTful, bắt đầu bằng tên của tài nguyên mà bạn muốn quản lý:

- **Sinh viên**: `/student` - Quản lý thông tin sinh viên
- **Môn học**: `/course` - Quản lý danh mục môn học  
- **Lớp học**: `/class` - Quản lý lớp học và đăng ký
- **Khoa**: `/faculty` - Quản lý thông tin khoa
- **Chương trình**: `/program` - Quản lý chương trình đào tạo
- **Điểm số**: `/grade` - Quản lý điểm số và bảng điểm

### 4 Phương Thức HTTP Cơ Bản

Mỗi tài nguyên hỗ trợ 4 phương thức HTTP cơ bản để thực hiện các thao tác CRUD:

#### 1. **GET** - Lấy dữ liệu (Read)

Sử dụng để lấy thông tin từ server mà không thay đổi dữ liệu.

**Ví dụ: Lấy danh sách lớp học**
```http
GET /class?semester=1&year=2024
```

```bash
curl -X GET 'http://localhost:3000/class?semester=1&year=2024' \
  -H 'accept: application/json'
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Lấy danh sách lớp học thành công",
  "data": [
    {
      "class_id": "CS101-01",
      "course_name": "Nhập môn Lập trình",
      "lecturer": "TS. Nguyễn Văn A",
      "maximum": 30,
      "current_enrollment": 25
    }
  ]
}
```

#### 2. **POST** - Tạo mới dữ liệu (Create)  

Sử dụng để tạo một tài nguyên mới trong hệ thống.

**Ví dụ: Tạo lớp học mới**
```http
POST /class
```

```bash
curl -X POST 'http://localhost:3000/class' \
  -H 'Content-Type: application/json' \
  -d '{
    "class_id": "CS102-01",
    "course_id": "CS102",
    "lecturer": "ThS. Trần Thị B",
    "maximum": 30,
    "semester": 1,
    "year": "2024"
  }'
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Tạo lớp học thành công",
  "data": {
    "class_id": "CS102-01",
    "course_name": "Cấu trúc Dữ liệu",
    "lecturer": "ThS. Trần Thị B",
    "maximum": 30,
    "current_enrollment": 0,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

#### 3. **PUT** - Cập nhật dữ liệu (Update)

Sử dụng để cập nhật toàn bộ hoặc một phần thông tin của tài nguyên hiện có.

**Ví dụ: Cập nhật thông tin lớp học**
```http
PUT /class/CS102-01
```

```bash
curl -X PUT 'http://localhost:3000/class/CS102-01' \
  -H 'Content-Type: application/json' \
  -d '{
    "lecturer": "PGS. Lê Văn C",
    "maximum": 35
  }'
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Cập nhật lớp học thành công",
  "data": {
    "class_id": "CS102-01",
    "lecturer": "PGS. Lê Văn C", 
    "maximum": 35,
    "updated_at": "2024-01-15T14:30:00Z"
  }
}
```

#### 4. **DELETE** - Xóa dữ liệu (Delete)

Sử dụng để xóa một tài nguyên khỏi hệ thống.

**Ví dụ: Xóa lớp học**
```http
DELETE /class/CS102-01
```

```bash
curl -X DELETE 'http://localhost:3000/class/CS102-01' \
  -H 'accept: application/json'
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Xóa lớp học thành công",
  "data": {
    "deleted_class_id": "CS102-01",
    "deleted_at": "2024-01-15T16:30:00Z"
  }
}
```

**Lỗi thường gặp** (409 Conflict):
```json
{
  "success": false,
  "message": "Không thể xóa lớp học",
  "error": "Lớp học có 25 sinh viên đang đăng ký"
}
```

### Các Cách Truyền Dữ Liệu

API hỗ trợ nhiều cách truyền dữ liệu:

#### 1. **Path Parameters** - Tham số trong đường dẫn

Dữ liệu được truyền trực tiếp trong URL, thường dùng để xác định tài nguyên cụ thể.

**Ví dụ:**
```http
GET /student/SV001
```
- `SV001` là path parameter (ID sinh viên)

```bash
curl -X GET 'http://localhost:3000/student/SV001'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "student_id": "SV001",
    "full_name": "Nguyễn Văn A",
    "email": "nguyenvana@student.edu"
  }
}
```

#### 2. **Query Parameters** - Tham số truy vấn

Dữ liệu được truyền sau dấu `?` trong URL, thường dùng để lọc, tìm kiếm, phân trang.

**Ví dụ:**
```http
GET /student?faculty=1&status=active&page=1&limit=10
```
- `faculty=1`, `status=active`, `page=1`, `limit=10` là query parameters

```bash
curl -X GET 'http://localhost:3000/student?faculty=1&status=active&page=1&limit=10'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "students": [
      {
        "student_id": "SV001",
        "full_name": "Nguyễn Văn A",
        "faculty_name": "Công nghệ Thông tin",
        "status": "active"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_records": 50
    }
  }
}
```

#### 3. **Request Body** - Dữ liệu trong phần thân

Dữ liệu được gửi trong phần thân của HTTP request, thường dùng cho POST/PUT.

**Ví dụ:**
```http
POST /student
Content-Type: application/json
```

```bash
curl -X POST 'http://localhost:3000/student' \
  -H 'Content-Type: application/json' \
  -d '{
    "student_id": "SV002",
    "full_name": "Trần Thị B",
    "email": "tranthib@student.edu",
    "faculty_id": 1
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo sinh viên thành công",
  "data": {
    "student_id": "SV002",
    "full_name": "Trần Thị B",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

#### 4. **Form Data** - Dữ liệu form (cho upload file)

Dữ liệu được gửi dưới dạng multipart/form-data, thường dùng để upload file.

**Ví dụ:**
```http
POST /student/import
Content-Type: multipart/form-data
```

```bash
curl -X POST 'http://localhost:3000/student/import' \
  -F 'file=@students.xlsx' \
  -F 'semester=1' \
  -F 'year=2024'
```

**Response:**
```json
{
  "success": true,
  "message": "Nhập dữ liệu thành công",
  "data": {
    "total_processed": 100,
    "successful_imports": 95,
    "failed_imports": 5
  }
}
```

### Mã Trạng Thái HTTP Phổ Biến

#### **200 OK** - Thành công
Yêu cầu được xử lý thành công, thường dùng cho GET, PUT, DELETE.

**Ví dụ:**
```json
{
  "success": true,
  "message": "Lấy thông tin sinh viên thành công",
  "data": {
    "student_id": "SV001",
    "full_name": "Nguyễn Văn A"
  }
}
```

#### **201 Created** - Tạo mới thành công
Tài nguyên mới được tạo thành công, thường dùng cho POST.

**Ví dụ:**
```json
{
  "success": true,
  "message": "Tạo sinh viên thành công",
  "data": {
    "student_id": "SV002",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

#### **400 Bad Request** - Yêu cầu không hợp lệ
Dữ liệu đầu vào không đúng định dạng hoặc thiếu thông tin bắt buộc.

**Ví dụ:**
```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "error": {
    "student_id": "ID sinh viên là bắt buộc",
    "email": "Email không đúng định dạng"
  }
}
```

#### **404 Not Found** - Không tìm thấy tài nguyên
Tài nguyên được yêu cầu không tồn tại trong hệ thống.

**Ví dụ:**
```json
{
  "success": false,
  "message": "Không tìm thấy sinh viên",
  "error": "Sinh viên với ID 'SV999' không tồn tại"
}
```

#### **500 Internal Server Error** - Lỗi máy chủ
Lỗi xảy ra bên trong server, không phải do lỗi của client.

**Ví dụ:**
```json
{
  "success": false,
  "message": "Lỗi máy chủ nội bộ",
  "error": "Không thể kết nối đến cơ sở dữ liệu"
}
```

