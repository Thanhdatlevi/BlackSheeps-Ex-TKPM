## 🧭 Registering New Routes

### Mục đích

Cho phép định tuyến các yêu cầu HTTP đến đúng controller tương ứng, giúp tách biệt logic xử lý nghiệp vụ và điều hướng request trong ứng dụng Node.js.

---

### 📂 Bước 1: Tạo File Router Mới

Trong thư mục `routes`, tạo một file mới tương ứng với module, ví dụ: `courseRoutes.js`.

Ví dụ:

```js
// src/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../modules/course/courseController');

router.get('/addCoursePage', courseController.addCoursePage);
router.post('/addCourse', courseController.addCourse);

router.get('/searchCourseById', courseController.searchCourseById);

router.get('/getAllCourses', courseController.getAllCourses);
router.delete('/deleteCourse', courseController.deleteCourse);

router.put('/updateCourse', courseController.updateCourse);
router.put('/updateCourseStatus', courseController.updateCourseStatus);

router.get('/editCoursePage', courseController.editCoursePage);

router.get('/isCourseNameExists', courseController.isCourseExistInClass);
module.exports = router;
```

---

### 🔗 Bước 2: Đăng Ký Router Trong `app.js`

Mở file `app.js` (hoặc nơi khởi tạo app Express), thêm router vừa tạo:

```js
// app.js
const express = require('express');
const app = express();

// Existing middleware
app.use(express.json());

// Import and use your new route
const courseRoutes = require('./src/routes/courseRoutes');

// ... 
app.use('/course', courseRoutes); // Base path

// ...other routes and setup
```

---

### ✅ Kết Quả Mong Đợi

Sau khi thực hiện các bước trên, bạn có thể truy cập các endpoint mới như sau:

| Phương thức | URL                 | Mô tả                  |
| ----------- | ------------------- | ---------------------- |
| GET         | `/getAllCourses`    | Lấy danh sách khóa học |
| GET         | `/searchCourseById` | Lấy chi tiết theo ID   |
| POST        | `/addCourse`        | Tạo khóa học mới       |
| PUT         | `/updateCourse`     | Cập nhật khóa học      |
| DELETE      | `/deleteCourse`     | Xóa khóa học           |

---

### 💡 Mẹo

* Đặt tên file router trùng tên module để dễ quản lý.
* Không để logic xử lý trong router – chỉ gọi hàm controller.
* Có thể nhóm router bằng `express.Router()` theo từng domain logic.

