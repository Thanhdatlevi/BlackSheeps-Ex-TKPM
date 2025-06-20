## 🛠️ Cách Cập Nhật Một Thực Thể Hiện Có (Thêm Thuộc Tính Mới)

### Mục đích

Thêm hai thuộc tính mới vào bảng `course`:

* `en_course_name`: Tên khóa học bằng tiếng Anh
* `en_description`: Mô tả khóa học bằng tiếng Anh

---

## 🧰 1. Công Cụ Cần Thiết Cho Tác Vụ Này

| Công cụ       | Mục đích               |
| ------------- | ---------------------- |
| Knex.js       | Thực hiện migration    |
| PostgreSQL    | Quản lý dữ liệu        |
| Terminal/bash | Chạy lệnh CLI cho Knex |

---

## 💾 2. Viết File Migration Để Cập Nhật Bảng

Tạo file migration:

```bash
npx knex migrate:make add_en_fields_to_course
```

Sau đó, mở file mới tạo và cập nhật nội dung như sau:

```js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.alterTable('course', function(table) {
    table.string('en_course_name', 100);
    table.string('en_description', 100);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.alterTable('course', function(table) {
    table.dropColumn('en_course_name');
    table.dropColumn('en_description');
  });
};
```

---

## 🚀 3. Thực Thi Migration

Chạy lệnh sau để cập nhật cơ sở dữ liệu:

```bash
npx knex migrate:latest
```

> ✅ Kết quả: Bảng `course` sẽ có thêm hai cột mới.

---

## 🧪 4. Kiểm Tra Cơ Sở Dữ Liệu

Sau khi chạy migration, kiểm tra lại bảng `course` bằng lệnh SQL:

```sql
\d course
```

Kết quả sẽ hiển thị thêm hai cột:

```text
en_course_name      | character varying(100)
en_description       | character varying(100)
```

---

## 🔄 5. Rollback (Nếu Cần)

Nếu muốn xóa hai cột vừa thêm:

```bash
npx knex migrate:rollback
```

---

## 📌 Lưu Ý Khi Cập Nhật Model, Service, Controller

Sau khi cập nhật DB, bạn nên:

* Cập nhật file model `course.model.js` để bao gồm các field mới
* Cập nhật `course.service.js` nếu có logic liên quan
* Cập nhật `course.controller.js` để xử lý dữ liệu đầu vào/ra
* Thêm test nếu có kiểm thử tự động

Ví dụ cập nhật trong model:

```js
function mapDbCourseToModel(row) {
  return {
    id: row.id,
    course_name: row.course_name,
    description: row.description,
    en_course_name: row.en_course_name, // ✅ Mới thêm
    en_description: row.en_description, // ✅ Mới thêm
  };
}
```
