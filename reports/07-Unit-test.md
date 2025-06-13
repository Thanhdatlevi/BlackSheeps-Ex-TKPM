## 🧪 Hướng Dẫn Viết Unit Test với Jest

### 🎯 Mục Tiêu

* Kiểm tra chức năng logic bên trong `service` hoặc `controller` mà không phụ thuộc vào HTTP hay database.
* Thay vì kiểm tra tích hợp toàn bộ hệ thống (**integration test**), ta kiểm tra logic riêng từng hàm một.

---

### ⚙️ Công Cụ Cần Dùng

* `jest` để chạy test.
* `jest-mock` (tích hợp sẵn trong `jest`) để mô phỏng các dependency như `model` hoặc `db`.

---

## 🧱 Ví Dụ: Unit Test cho `courseService.createCourse`

### 📄 Hàm Gốc trong `courseService.js`

Giả sử ta có một hàm như sau:

```js
// src/modules/course/courseService.js
const courseModel = require('./courseModel');

exports.createCourse = async (data) => {
  if (!data.courseCode || !data.courseName) {
    throw new Error('Missing required fields');
  }
  return await courseModel.insertCourse(data);
};
```

---

### 📄 File Unit Test: `courseService.test.js`

```js
// src/modules/course/courseService.test.js
const courseService = require('./courseService');
const courseModel = require('./courseModel');

jest.mock('./courseModel'); // 🧠 Jest sẽ thay thế mọi hàm thật bằng mock function

describe('Course Service - createCourse', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call insertCourse with correct data when valid', async () => {
    const input = {
      courseCode: 'CS101',
      courseName: 'Intro to CS',
      credits: 3,
    };

    // Mock hành vi của model
    courseModel.insertCourse.mockResolvedValue({
      course_id: 'CS101',
      ...input,
      status: 'Active',
    });

    const result = await courseService.createCourse(input);

    // ✅ Kiểm tra hàm model được gọi đúng
    expect(courseModel.insertCourse).toHaveBeenCalledWith(input);

    // ✅ Kiểm tra kết quả trả về
    expect(result.course_id).toBe('CS101');
    expect(result.status).toBe('Active');
  });

  it('should throw error if required fields are missing', async () => {
    const input = { courseCode: '' };

    await expect(courseService.createCourse(input)).rejects.toThrow('Missing required fields');

    expect(courseModel.insertCourse).not.toHaveBeenCalled();
  });
});
```

---

## 📌 So sánh Integration vs Unit Test

| Tiêu chí                  | Integration Test (`supertest`)      | Unit Test (`jest.mock`)               |
| ------------------------- | ----------------------------------- | ------------------------------------- |
| Phạm vi kiểm tra          | Gọi API đầy đủ (route, controller…) | Logic bên trong 1 hàm cụ thể          |
| Có sử dụng CSDL hay không | Có (knex + test DB)                 | Không – mock database/model hoàn toàn |
| Thời gian chạy            | Chậm hơn                            | Rất nhanh                             |
| Dễ viết/dễ debug          | Phức tạp hơn                        | Dễ kiểm soát lỗi hơn                  |
| Phát hiện lỗi logic       | Có                                  | Có – tốt hơn khi test chi tiết        |

---

## 🧠 Lưu Ý Khi Viết Unit Test

* **Không import express hoặc supertest**.
* Luôn **mock các dependency** như model, service phụ, hoặc DB.
* **Không đụng đến database thật** hay file hệ thống.
* Đặt câu hỏi: *"Nếu tôi chạy hàm này riêng, logic có đúng không?"*

