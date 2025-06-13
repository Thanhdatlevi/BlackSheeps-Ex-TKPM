# 📘 Developer Guide: Data Validation 
- (takes Class Registration - addClass as example)

Hệ thống xác thực dữ liệu (data validation) bao gồm 2 tầng chính:

1. ✅ **Frontend (Client-side validation)**: kiểm tra nhanh dữ liệu đầu vào của người dùng trước khi gửi về server.
2. ✅ **Backend (Server-side validation)**: đảm bảo tính đúng đắn và hợp lệ của dữ liệu trước khi lưu vào cơ sở dữ liệu.

---

## 🎯 Mục Tiêu

* Ngăn chặn dữ liệu trống, sai định dạng hoặc không hợp lệ.
* Đảm bảo toàn vẹn logic nghiệp vụ như: lớp không trùng, sinh viên tồn tại, khóa học hợp lệ...

---

## 1. 🧩 Frontend Validation (JavaScript)

### ✅ Kiểm Tra Trống

Trước khi gửi form:

```js
for (let e in formData) {
  if (!formData[e] || formData[e] == '') {
    alert(i18next.t('alert.notFill'));
    return null;
  }
}
```

→ Tất cả các trường (text/select) **bắt buộc phải có giá trị**.

---

### ✅ Biến Đổi Dữ Liệu Trước Khi Gửi

#### Lịch học (`schedule`) và giờ học (`time`) được gom lại thành chuỗi dạng:

```
schedule = "Mon-Wed-Fri 08:00-10:00"
```

→ Tối ưu để lưu trữ backend, nhưng vẫn cần parse lại khi dùng.

---

### ✅ Load dữ liệu từ Server

Khi tạo/lọc dữ liệu:

```js
const response = await fetch(COURSE_URL + params.toString());
```

→ Nếu không có `lang`, mặc định là `'vi'`. Điều này hỗ trợ hiển thị ngôn ngữ động cho dropdown.

---

## 2. 🛡️ Backend Validation (Node.js - classService)

### ✅ `addClass(classObject)` – Validate nghiệp vụ

| Kiểm tra                     | Mục đích                         |
| ---------------------------- | -------------------------------- |
| `searchYear(year, semester)` | Kiểm tra học kỳ có tồn tại không |
| `countClass(class_id, ...)`  | Tránh thêm lớp bị trùng          |
| `searchCourse(course_id)`    | Khóa học có hợp lệ không         |

```js
if (year_result.length === 0)
  throw new Error('Year Term not found');

if (parseInt(class_result.count) !== 0)
  throw new Error('Class already existed');

if (courseResult.length === 0)
  throw new Error('Course with id not existed');
```

---

### ✅ `addStudentToClass(studentList, classObject)`

* Mỗi sinh viên phải tồn tại
* Lớp học phải tồn tại
* Sinh viên chưa đăng ký lớp đó

```js
const student_result = await studentModel.searchStudent(student_id);
if (student_result.length === 0)
  throw new Error('Non-existing Student');

const subject_result = await classModel.countRegister(...);
if (parseInt(subject_result.count) !== 0)
  throw new Error('Student already register this subject');
```

---

## 💡 Best Practices

- 🔒 1. Luôn kiểm tra phía **backend** – frontend chỉ là UI trợ giúp (no trust).

- 📄 2. Trả lỗi rõ ràng từ service, có thể gắn mã lỗi cụ thể (error code).

- 🧪 3. Unit test các hàm `addClass`, `addStudentToClass` bằng cách mock model.

- 📑 4. Hiển thị lỗi cho người dùng từ backend (qua alert/i18next).

- 🌐 5. Dùng `URLSearchParams` để truyền query rõ ràng (ngôn ngữ, bộ lọc…).

---

## ✅ Checklist Kiểm Tra 

| Kiểm Tra                 | Frontend | Backend                       |
| ------------------------ | -------- | ----------------------------- |
| Dữ liệu trống            | ✅        | ✅                             |
| Logic nghiệp vụ          | ❌        | ✅                             |
| Kiểu dữ liệu             | ✅        | ✅                             |
| Format và miền giá trị   | ❌        | ✅                             |
| Ngôn ngữ động            | ✅        | ✅ (nếu có `getCourses(lang)`) |

