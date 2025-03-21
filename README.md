![Screenshot 2025-03-21 092211](https://github.com/user-attachments/assets/a7cbf5f7-6ffd-4a81-a138-658e66a13dc5)# BlackSheeps-Ex-BT1

  

# Project name: Website quản lý sinh viên

  

## Cấu trúc source code

```

node_modules/

src/

config/

modules/

student/

studentController.js

studentModel.js

public/

css/

input.css

output.css

js/

add.js

delete.js

search.js

routes/

studentROutes.js

view/

layouts/

main.hbs

partials/

header.hbs

add.hbs

delete.hbs

search.hbs

update.hbs

.env

.gitignore

add.js

package-lock.json

package.json

README.md

tailwind.config.js

```

  

# Hướng dẫn cài đặt và chạy chương trình Version 1  
## Hướng dẫn cài đặt
```

Bước 1: Cài đặt NodeJS và npm

Bước 2: Clone repo về máy

Bước 3: Chạy npm install để cài đặt node-modules

Bước 4: Tạo file .env và thêm các nội dung có note bên bài txt đã nộp

```

  

## Chạy chương trình

Trong terminal
Nếu là môi trường sản phẩm chạy npm start

Nếu là môi trường developer chạy

npm run build:css (Để khởi động tailwind)

npm run start:dev (Để chạy web)

  

# Hướng dẫn sử dụng Version 2.0

## Hướng dẫn cài đặt
```

Bước 1: Cài đặt NodeJS và npm

Bước 2: Clone repo về máy

Bước 3: Chạy npm install để cài đặt node-modules

Bước 4: Tạo file .env và thêm các nội dung có note bên bài txt đã nộp
```
## Chạy chương trình

Trong terminal  
Nếu là môi trường sản phẩm chạy: npm start  
Nếu là môi trường developer chạy: npm run start:dev 

## Hướng dẫn sử dụng web
### Thêm sinh viên:
Chọn vào ô Thêm sinh viên, sau đó điền các thông tin của sinh viên và chọn Thêm sinh viên. Nếu thêm thành công, web sẽ hiện thông báo thêm thành công sinh viên.
![Screenshot 2025-03-21 092211](https://github.com/user-attachments/assets/26fda474-6830-4ce8-afb6-c0d67f66262a)
![Screenshot 2025-03-21 091849](https://github.com/user-attachments/assets/d1c18e22-d9ab-497b-aea4-b65cbf42af23)

### Xóa sinh viên:
Chọn vào ô Xóa sinh viên, sau đó điền mã số sinh viên vào chọn xóa và chọn đồng ý thông tin nhắc nhở. Nếu xóa thành công, web sẽ hiện thông báo xóa thành công sinh viên.

### Cập nhật sinh viên:
Chọn vào ô Cập nhật sinh viên, sau đó điền thông tin của sinh viên và chọn Cập nhật sinh viên. Nếu cập nhật thành công, web sẽ hiện thông báo cập nhật thành công sinh viên.

### Tra cứu sinh viên:
Chọn vào ô Tìm kiếm sinh viên, sau đó điền mã số sinh viên, tên, khoa (hoặc 1 trong những cái trên) và chọn tìm kiếm. Danh sách sinh viên sẽ hiện bên dưới.

### Export danh sách sinh viên:
Chọn vào ô Tìm kiếm sinh viên, sau đó chọn dạng file mà mình muốn export. Danh sách sinh viên và thông tin giấy tờ sẽ được tải về máy theo định dạng được chọn (CSV hoặc Excel).

### Import danh sách sinh viên:
Chọn vào ô Thêm sinh viên, sau đó chọn dạng file mà mình muốn import. Web hiện ra dialog để người dùng đưa vào 2 file Danh sách sinh viên và thông tin giấy tờ, sau đó ấn Import. Nếu thêm thành công, web sẽ hiện thông báo thêm thành công sinh viên.

### Thêm khoa, chương trình, tình trạng sinh viên:
Chọn vào ô Thêm tương ứng với cái mình muốn thêm. Sau đó, nhập tên khoa/ chương trình/ tình trạng và ấn nút Thêm. Nếu thêm thành công, sẽ có thông báo thành công.

### Sửa khoa, chương trình, tình trạng sinh viên:
Chọn vào ô Sửa tương ứng với cái mình muốn sửa. Sau đó, nhập tên khoa/ chương trình/ tình trạng, sửa lại tên và ấn cập nhật. Nếu cập nhật thành công, sẽ có thông báo thành công.

### Chức năng Logging:
Ghi vết các nội dung hành động của người dùng.
