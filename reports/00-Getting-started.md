## 🧰 1. Công Cụ Cần Thiết Để Phát Triển

| Công cụ                                                         | Mục đích                             | Phiên bản đề xuất      |
| --------------------------------------------------------------- | ------------------------------------ | ---------------------- |
| [Node.js](https://nodejs.org/)                                  | Môi trường chạy JavaScript backend   | 18.x hoặc 20.x         |
| [npm](https://www.npmjs.com/) hoặc [yarn](https://yarnpkg.com/) | Trình quản lý gói                    | npm v9+ / yarn v1+     |
| [PostgreSQL](https://www.postgresql.org/)                       | Cơ sở dữ liệu quan hệ                | v14+                   |
| [Knex.js](https://knexjs.org/)                                  | Query builder & công cụ migration DB | Đã bao gồm trong dự án |
| [Jest](https://jestjs.io/)                                      | Framework kiểm thử                   | v29+                   |
| [Concurrently](https://www.npmjs.com/package/concurrently)      | Chạy song song nhiều script npm      | Đã bao gồm             |
| [Tailwind CSS](https://tailwindcss.com/)                        | Framework CSS tiện ích (frontend)    | v3+                    |

---

## 🧱 2. Stack Công Nghệ Được Sử Dụng Trong Ứng Dụng

| Tầng ứng dụng   | Công Nghệ Sử Dụng     |
| --------------- | --------------------- |
| HandleBars      | Dùng để render HTML   |
| Javascript      | Dùng để xử lý logic   |

| Tầng nghiệp vụ  | Công Nghệ Sử Dụng                |
| --------------- | ---------------------            |
| Runtime         | Node.js                          |
| Framework Web   | Express.js                       |
| ORM             | Knex.js                          |
| Query           | pg.js (node-postgres)            |
| Kiểm Thử        | Jest                             |
| CSS             | Tailwind CSS                     |
| Công Cụ Dev     | nodemon, concurrently, cross-env |
| Biến Môi Trường | dotenv                           |

| Tầng Dữ liệu    | Công Nghệ Sử Dụng     |
| --------------- | --------------------- |
| Cơ Sở Dữ Liệu   | PostgreSQL            |

---

## 💻 3. Cách Tải Dự Án Và Chạy Trên Máy Local

### 🔽 Clone dự án

```bash
git clone https://github.com/Thanhdatlevi/BlackSheeps-Ex-TKPM
cd BlackSheeps-Ex-TKPM
```

### 📦 Cài đặt các package cần thiết

```bash
npm install
```

### 🛠️ Cấu hình biến môi trường

Tạo file `.env` ở thư mục gốc:

```env
DB_HOST=<host>
DB_PORT=<port>
DB_USER=<user>
DB_PASSWORD=<password>
DB_NAME=<db_name>


DB_HOST_TEST=<test_host>
DB_PORT_TEST=<test_port>
DB_USER_TEST=<test_user>
DB_PASSWORD_TEST=<test_password>
# this is important, don't change this name or tests will break.
DB_NAME_TEST=blacksheep_test
```

### 🧬 Thực hiện migrate CSDL (cho môi trường dev)

```bash
npx knex migrate:latest
```                  
                     
> Cho môi trường kiể m thử:
> `npm run migrate:test`
                     
### ▶️ Khởi chạy ser ver ở chế độ phát triển
                     
```bash
npm run start:dev
```

Script này sẽ:

* Theo dõi và build Tailwind CSS
* Khởi động server với `nodemon` để tự reload khi thay đổi mã nguồn
* Tailwindcss sẽ được tự động build lại khi thay đổi mã nguồn

