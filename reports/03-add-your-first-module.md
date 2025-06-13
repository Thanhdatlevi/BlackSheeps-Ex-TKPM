## 1. 📂 Cấu trúc dự án chính (rút gọn)

src/
│
├── modules/
│   ├── course/
│   │   ├── courseController.js     # Xử lý request từ client
│   │   ├── courseService.js        # Xử lý logic nghiệp vụ
│   │   └── courseModel.js          # Truy vấn dữ liệu từ PostgreSQL
│   └── ...
│
├── routes/
│   ├── courseRoutes.js             # Định tuyến endpoint API khóa học
│   └── ...
│
├── config/
│   ├── db.js                       # Kết nối cơ sở dữ liệu
│   └── logging.js                 # Ghi log hoạt động
│
└── views/
    ├── addCourse.ejs              # Trang thêm khóa học
    └── editCourse.ejs             # Trang chỉnh sửa khóa học

## 🧩 BƯỚC 2: TẠO MODEL, SERVICE, CONTROLLER (theo chuẩn `course`)

### 🎯 Mục tiêu

Tạo logic xử lý dữ liệu (model), xử lý nghiệp vụ (service), và điều khiển request/response (controller) cho tính năng mới theo kiến trúc đã có.

---

## 🔹 2.1 Viết Model

### ✅ Mục đích

Model là nơi tương tác trực tiếp với database bằng các câu truy vấn SQL (sử dụng `db.query()`).

### 📁 Vị trí:

`src/modules/ten_module/tenModel.js`

### 🧪 Ví dụ từ `courseModel.js` – thêm một khóa học mới:

```js
static async addCourse(course){
    const query = `
        INSERT INTO public.course (
            course_id, course_name, credit, faculty, description, prerequisite,
            status, time_create, en_course_name, en_description
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
    `;
    const result = await db.query(query, [
        course.courseCode, course.courseName, course.credits, course.faculty,
        course.description, course.prerequisite, 'Active', course.time_create,
        course.courseNameEn, course.descriptionEn
    ]);
    return result.rows[0] || null;
}
```

---

## 🔹 2.2 Viết Service

### ✅ Mục đích

Service là nơi xử lý nghiệp vụ (business logic), như kiểm tra dữ liệu, gọi model, xử lý luồng điều kiện, hoặc phối hợp nhiều model.

### 📁 Vị trí:

`src/modules/ten_module/tenService.js`

### 🧪 Ví dụ từ `courseService.js` – gọi model để thêm khóa học:

```js
static async addCourse(course) {
    // Kiểm tra nghiệp vụ nếu cần
    return await courseModel.addCourse(course);
}
```

---

## 🔹 2.3 Viết Controller

### ✅ Mục đích

Controller nhận request, gọi service xử lý, rồi trả response lại cho client (API hoặc render view).

### 📁 Vị trí:

`src/modules/ten_module/tenController.js`

### 🧪 Ví dụ từ `courseController.js` – thêm khóa học mới:

```js
static async addCourse(req, res){
    try {
        logger.info("addCourse method got called in courseController");
        const course = req.body;
        const addedCourse = await courseService.addCourse(course);
        if (addedCourse){
            return res.status(201).json({
                success: true,
                message: "Add course successfully",
                course: addedCourse
            });
        } else {
            return res.status(500).json({
                message: "Failed to add course. Please try again later."
            });
        }
    } catch (error) {
        logger.error("Error in addCourseController:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to add course. Please try again later."
        });
    }
}
```

---

## ✅ Tóm tắt flow:

1. **Client gọi API (POST /addCourse)** →
2. **Controller (`addCourse`) nhận request** →
3. **Gọi Service (`courseService.addCourse`)** →
4. **Gọi Model (`courseModel.addCourse`) để tương tác DB** →
5. **Trả kết quả lại về client.**


