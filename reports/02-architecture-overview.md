# 📘 Hướng Dẫn Dành Cho Lập Trình Viên: Tổng Quan Kiến Trúc Hệ Thống

## 🧠 Giới thiệu

Tài liệu này cung cấp cái nhìn tổng quan về kiến trúc ứng dụng nhằm giúp lập trình viên nắm được cấu trúc dự án, trách nhiệm của từng phần và cách mở rộng, bảo trì hệ thống theo nguyên lý **SOLID** và **Separation of Concerns** (phân tách trách nhiệm rõ ràng).

---

## 📐 Kiến Trúc Tổng Thể

Dự án tuân theo mô hình kiến trúc **Modular + MVC mở rộng**, tổ chức theo từng tính năng trong thư mục `src/modules`.

Cụ thể:

* **MVC (Model-View-Controller)** với mở rộng:

  * **Service**: Xử lý logic nghiệp vụ
  * **Controller**: Xử lý yêu cầu HTTP
  * **Model**: Tương tác cơ sở dữ liệu (qua Knex.js)
  * **View**: Render HTML bằng Handlebars (SSR)

---

## 🗂️ Cấu Trúc Thư Mục Chính

### Root

| Đường dẫn          | Mô tả                                |
| ------------------ | ------------------------------------ |
| `app.js`           | Điểm khởi động ứng dụng (Express)    |
| `knexfile.js`      | Cấu hình Knex cho các môi trường     |
| `migrations/`      | Các tập tin định nghĩa cấu trúc DB   |
| `seeds/`           | Dữ liệu mẫu ban đầu cho DB           |
| `reports/`         | Các tài liệu PDF liên quan đến dự án |

---

### `src/` – Nơi chứa toàn bộ mã nguồn ứng dụng

#### 1. `config/` – Cấu hình hệ thống

* `db.js`, `db_test.js`: Kết nối DB cho production và test
* `logging.js`: Log hệ thống đơn giản

#### 2. `modules/` – Tổ chức theo tính năng (tách biệt)

Mỗi thư mục là một **module tính năng**, ví dụ: `student`, `course`, `grade`, v.v.

Mỗi module gồm:

* `*Controller.js`: Điều phối yêu cầu từ client
* `*Service.js`: Xử lý logic nghiệp vụ
* `*Model.js`: Truy vấn cơ sở dữ liệu (pg.js)
* `*.test.js`: Unit test

➡️ Tuân thủ nguyên lý **Single Responsibility Principle**

#### 3. `routes/` – Khai báo route của Express

Kết nối đường dẫn HTTP tới controller tương ứng.

#### 4. `views/` – Giao diện người dùng với Handlebars

Các file `.hbs` tổ chức theo chức năng như `addCourse.hbs`, `updateStatus.hbs`, ...

#### 5. `public/` – Tài nguyên tĩnh phía client

* `css/`: File Tailwind
* `js/`: Các script xử lý hành vi phía người dùng (`add.js`, `update.js`, `delete.js`, ...)

---

## 🔄 Dòng Chảy Dữ Liệu

1. **Yêu cầu gửi đến** từ route (`src/routes/*.js`)
2. **Controller** nhận và kiểm tra yêu cầu
3. Gọi đến **Service** để xử lý nghiệp vụ
4. **Model** tương tác với cơ sở dữ liệu qua Knex
5. Trả kết quả dạng JSON hoặc render HTML bằng Handlebars

---

## 🧱 Nguyên Tắc Thiết Kế

| Nguyên lý                 | Ứng dụng trong dự án                                                       |
| ------------------------- | -------------------------------------------------------------------------- |
| **Single Responsibility** | Mỗi module chỉ xử lý 1 chức năng                                           |
| **Open/Closed**           | Có thể mở rộng thêm module mà không chỉnh sửa code cũ                      |
| **Liskov Substitution**   | Tách biệt giữa controller - service - model                                |
| **Interface Segregation** | File đơn nhiệm, tách biệt rõ ràng                                          |
| **Dependency Inversion**  | Service có thể thay thế / test riêng (có thể cải thiện hơn với DI sau này) |

---

## 🧪 Kiểm Thử

* Mỗi module có test file tương ứng (`*.test.js`)
* Kiểm thử cả logic nghiệp vụ và xử lý DB
* Đặt tên file test rõ ràng: `test_addStudent.test.js`, `student_model_update.test.js`, ...

---

## 🌐 Hỗ Trợ Đa Ngôn Ngữ (i18n)

* Sử dụng file `lang/en.json`, `lang/vi.json` để định nghĩa chuỗi ngôn ngữ
* Client sử dụng `i18n-init.js` để khởi tạo giao diện đa ngôn ngữ

---

## 🧩 Cách Mở Rộng Tính Năng

Chi tiết tại [How to add a module](./add-your-first-module.md)

Để thêm một module mới (tóm tắt):

1. Tạo thư mục mới trong `src/modules/[tên_module]`
2. Thêm các file:

   * `[module]Controller.js`
   * `[module]Service.js`
   * `[module]Model.js`
   * `[module].test.js` (nếu cần)
3. Thêm đường dẫn vào `src/routes/`
4. Tạo migration + seed DB nếu có
5. Tạo giao diện `.hbs` và file JS nếu có thao tác phía client

---

## 📘 Tổng Kết

Ưu điểm của kiến trúc này:

* Tách biệt rõ ràng theo chức năng
* Dễ mở rộng và bảo trì
* Tuân thủ nguyên lý SOLID
* Phù hợp cho teamwork & CI/CD


