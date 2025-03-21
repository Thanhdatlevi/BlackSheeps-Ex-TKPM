# BlackSheeps-Ex-BT1

  

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

![Screenshot 2025-03-21 092211](https://github.com/user-attachments/assets/440917d1-84ff-42e7-942a-b2f358f7a563)
  
![Screenshot 2025-03-21 091849](https://github.com/user-attachments/assets/0979de0a-88ee-4246-af2f-0fc6c417aa93)

  
### Xóa sinh viên:
Chọn vào ô Xóa sinh viên, sau đó điền mã số sinh viên vào chọn xóa và chọn đồng ý thông tin nhắc nhở. Nếu xóa thành công, web sẽ hiện thông báo xóa thành công sinh viên.

![Screenshot 2025-03-21 101613](https://github.com/user-attachments/assets/dbf4482d-b93f-4300-bcc4-b1405d386e30)

  
### Cập nhật sinh viên:
Chọn vào ô Cập nhật sinh viên, sau đó điền thông tin của sinh viên và chọn Cập nhật sinh viên. Nếu cập nhật thành công, web sẽ hiện thông báo cập nhật thành công sinh viên.

![Screenshot 2025-03-21 131103](https://github.com/user-attachments/assets/08b6b49c-3fbf-4254-834c-5b2e1fff5fcd)
  

### Tra cứu sinh viên:
Chọn vào ô Tìm kiếm sinh viên, sau đó điền mã số sinh viên, tên, khoa (hoặc 1 trong những cái trên) và chọn tìm kiếm. Danh sách sinh viên sẽ hiện bên dưới.

![Screenshot 2025-03-21 092242](https://github.com/user-attachments/assets/6c7e468e-c746-4cde-be61-fc1420736640)
  
![Screenshot 2025-03-21 092315](https://github.com/user-attachments/assets/8bcebc8c-536c-41b2-951e-d22ed5d4c828)

  
### Export danh sách sinh viên:
Chọn vào ô Tìm kiếm sinh viên, sau đó chọn dạng file mà mình muốn export. Danh sách sinh viên và thông tin giấy tờ sẽ được tải về máy theo định dạng được chọn (CSV hoặc Excel).

![Screenshot 2025-03-21 095915](https://github.com/user-attachments/assets/e247620b-0717-48b7-9642-ebede68b098a)

![Screenshot 2025-03-21 100028](https://github.com/user-attachments/assets/b17233a1-6c08-4fb8-b61c-10deafeb5dd0)


### Import danh sách sinh viên:
Chọn vào ô Thêm sinh viên, sau đó chọn dạng file mà mình muốn import. Web hiện ra dialog để người dùng đưa vào 2 file Danh sách sinh viên và thông tin giấy tờ, sau đó ấn Import. Nếu thêm thành công, web sẽ hiện thông báo thêm thành công sinh viên.
  
![Screenshot 2025-03-21 101218](https://github.com/user-attachments/assets/22911ff7-30ec-409f-a6af-16eb92ac534c)
  
![Screenshot 2025-03-21 101241](https://github.com/user-attachments/assets/b4db2991-018f-4105-a22d-950c21571eda)


### Thêm khoa, chương trình, tình trạng sinh viên:
Chọn vào ô Thêm tương ứng với cái mình muốn thêm. Sau đó, nhập tên khoa/ chương trình/ tình trạng và ấn nút Thêm. Nếu thêm thành công, sẽ có thông báo thành công.
  
![Screenshot 2025-03-21 094812](https://github.com/user-attachments/assets/0c46cf34-d987-4f9b-ac44-83bd82892021)


  
### Sửa khoa, chương trình, tình trạng sinh viên:
Chọn vào ô Sửa tương ứng với cái mình muốn sửa. Sau đó, nhập tên khoa/ chương trình/ tình trạng, sửa lại tên và ấn cập nhật. Nếu cập nhật thành công, sẽ có thông báo thành công.
  

![Screenshot 2025-03-21 094853](https://github.com/user-attachments/assets/997c4296-5ce0-4854-aab0-c750f6d1bd7a)
  
  
### Chức năng logging:
Ghi lại thông tin các hoạt động diễn ra trong trang web.

![Screenshot 2025-03-21 105910](https://github.com/user-attachments/assets/236787dd-640a-46a3-aed1-6db462b4f54b)
