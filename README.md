# BlackSheeps-Ex-BT1

  

# Project name: Website quản lý sinh viên

[Tài liệu chi tiết](./reports)

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

# Hướng dẫn sử dụng Version 3.0

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
### MSSV phải là duy nhất:
Khi người dùng thêm sinh viên mới vào danh sách, nếu mssv đã có trong database thì sẽ hiện thông báo đã tồn tại mã số sinh viên, hãy chọn mssv khác.
   
![Screenshot 2025-03-28 010102](https://github.com/user-attachments/assets/de15cf5d-cfee-4df4-a273-df24260d3035)  
  
### Email phải thuộc một tên miền nhất định và có thể cấu hình động (configurable):  
Khi người dùng thêm sinh viên vào dánh sách mới, sẽ kiểm tra xem email có đuôi dịnh dạng đúng không.
Có thêm chức năng thêm, xóa, sửa đuôi email cho phép.
  
![Screenshot 2025-03-28 010009](https://github.com/user-attachments/assets/bddf8978-2a10-496d-a7b0-42d850aee28a)  
  
### Số điện thoại phải có định dạng hợp lệ theo quốc gia (configurable) :
Khi người dùng thêm sinh viên vào dánh sách mới, sẽ kiểm tra xem điện thoại có đúng định dạng của Việt Nam không nếu không thì hiện thống báo số điện thoại không hợp lệ
  
![Screenshot 2025-03-28 010037](https://github.com/user-attachments/assets/cdd700b2-5161-4176-926e-51a0e198d5a5)  

  
### Tình trạng sinh viên chỉ có thể thay đổi theo một số quy tắc (configurable):
Khi người dùng cập nhật sinh viên, sẽ kiểm tra xem trạng thái có đổi từ đã tốt nghiệp không. Vì khi đã tốt nghiệp sẽ không đổi được sang các trạng thái khác.
  
![Screenshot 2025-03-28 011126](https://github.com/user-attachments/assets/67226bf4-6b10-4277-a231-e418bd4b9ad8)  

# Hướng dẫn sử dụng Version 4.0

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
### Chức năng hủy đăng ký học phần của sinh viên:
Khi giáo vụ muốn hủy đăng ký của môn của sinh viên trong kỳ đăng ký. Giáo vụ sẽ tới trang xóa đăng ký, ở đây sẽ hiện ra toàn bộ thông tin đăng ký hiện tại còn được phép xóa (trước hạn đăng ký của học kỳ). Giáo vụ có thể nhập MSSV để lọc theo sinh viên sau đó ấn xóa để hủy đăng ký học phần của sinh viên. Hệ thống sẽ ghi nhận lại lịch sử hủy đăng ký này.
   
![Screenshot 2025-04-03 215031](https://github.com/user-attachments/assets/3a7a355e-48a8-402d-8893-e3e6da08cc84)

  
![Screenshot 2025-04-03 215042](https://github.com/user-attachments/assets/fd849106-5339-4f11-ab86-88d59a18cda4)

    
![Screenshot 2025-04-03 215118](https://github.com/user-attachments/assets/fdee2de6-4012-4282-89c0-23e191813027)
  
  
### Xem điểm và xuất file điểm cho sinh viên
Khi giáo vụ muốn xuất một file điểm cho sinh viên thì giáo vụ vào trang tra cứu điểm. Sau đó, giáo vụ nhập mã số sinh viên và trang web sẽ hiện ra thông tin điểm của sinh viên. Giáo vụ có thể ấn Xuất file để tải về file Excel danh sách điểm của sinh viên.

![Screenshot 2025-04-03 215138](https://github.com/user-attachments/assets/9c101c4e-0f95-4396-b4e4-fc16301f092a)


![Screenshot 2025-04-03 215149](https://github.com/user-attachments/assets/26208046-fdce-4585-a97f-da5115a11dc9)
   
### Sửa lại giao diện phần thông báo lỗi domain email ở add Student
    
![Screenshot 2025-04-03 222121](https://github.com/user-attachments/assets/66f59d99-6147-49c9-af69-ea0541a372d3)
  
  
### Báo cáo unit test:
File báo cáo nằm trong folder report
   
![Screenshot 2025-04-03 223348](https://github.com/user-attachments/assets/f6f01f50-67ac-40e0-853f-6a5690565cb4)

# Hướng dẫn sử dụng Version 5.0

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
### Chức năng thêm lớp học của giáo vụ: 
Để mở một lớp của 1 khóa học trong 1 kì cho sinh viên đăng ký, giáo vụ có thể vào phần **Quản lý lớp học** => **Thêm lớp học** và tiến hành điền các trường thông tin cần thiết.
![Screenshot 2025-04-18 072758](https://github.com/user-attachments/assets/0e05488d-bfd8-4c64-893d-bfa294d3f2bb)
### Chức năng thêm học sinh vào lớp:
Sinh viên muốn tham gia 1 khóa học thì phải vào 1 lớp. Giáo vụ sẽ thực hiện đăng ký thủ công cho sinh viên để đảm bảo sinh viên tham gia đúng lớp. Giáo vụ vào phần **Quản lý lớp học** => **Thêm học sinh vào lớp**.
![Screenshot 2025-04-18 072919](https://github.com/user-attachments/assets/7c8f0040-21a3-4c0d-bbc8-9ba1d929b06d)
### Chức năng xóa học sinh khỏi lớp:
Khi việc đăng ký có sai sót hoặc sinh viên có lý do đặc biệt, giáo vụ có thể tiến hành hủy đăng ký cho sinh viên. Giáo vụ vào phần **Quản lý lớp học** => **Xóa học sinh khỏi lớp**.
![Screenshot 2025-04-18 073008](https://github.com/user-attachments/assets/d55f1dd3-fe99-4154-a5d3-7712677a1d4f)
![Screenshot 2025-04-18 073017](https://github.com/user-attachments/assets/fa799b8b-8b7a-4f32-b415-a60621c8ef54)
Hệ thống sẽ ghi lại lịch sử hủy đăng ký.
![image](https://github.com/user-attachments/assets/5169f7cc-49c1-43c6-8283-08fda21c2a5e)
### Chức năng in bảng điểm cho học sinh:
Khi có nhu cầu, giáo vụ có thể tiến hành in bảng điểm cho sinh viên ở mục **Xem điểm sinh viên** => **Xuất Excel** .
![image](https://github.com/user-attachments/assets/880ef62c-15f0-4f2c-815b-61fecfec0edc)
### Chức năng thêm khóa học:
Khi muốn tạo 1 khóa học mới cho sinh viên có thể đăng ký học tập, giáo vụ sẽ vào phần **Quản lý khóa học** => **Thêm khóa học**.
![image](https://github.com/user-attachments/assets/8f00c45f-bf7d-4682-93cf-3269b5cb4b71)
Khóa học phải có số tín chỉ hợp lệ (>=2).
![image](https://github.com/user-attachments/assets/766d5481-6359-43c4-9e75-fc91b3df85fa)

Khóa học tiên quyết phải tồn tại.
![image](https://github.com/user-attachments/assets/92755898-7bad-4bfd-b14a-83093ea7b139)
### Chức năng xóa khóa học: 
Khi xảy ra sai sót trong quá trình nhập liệu, Giáo vụ có thể xóa khóa học để sửa lỗi. Giáo vụ có thể vào phần **Quản lý khóa học** => **Chỉnh sửa khóa học** => **Xóa**.
![image](https://github.com/user-attachments/assets/f803cdfc-0953-4665-b719-27cdb4bc9d3b)
Chỉ có thể xóa khóa học trong vòng 30 phút sau khi tạo nếu chưa lớp nào được mở cho môn đó.
![image](https://github.com/user-attachments/assets/7e44b175-1672-439a-a03e-1241bc85d319)
Nếu đã được đăng ký thì chỉ có thể sửa trạng thái từ **Active** => **Deactive**
![image](https://github.com/user-attachments/assets/3525ba30-b0fd-4c63-a1a1-221b213feb50)
![image](https://github.com/user-attachments/assets/69bb03aa-9cc6-45be-8ab9-d876a0c6d70b)
### Chức năng chỉnh sửa khóa học:
Nếu trong thông tin khóa học bị sai ở 1 số chỗ nhưng không muốn xóa vì không muốn mất dữ liệu, Giáo vụ sẽ vào phần **Quản lý khóa học** => **Chỉnh sửa khóa học** => **Sửa**.
![image](https://github.com/user-attachments/assets/014ef491-ff0d-4b11-b520-e4420dc198ad)
![image](https://github.com/user-attachments/assets/2c4e6907-2b71-4b42-89c8-13a64ac343af)
Chỉ có thể sửa tín chỉ với các khóa học chưa có lớp đăng ký.
![image](https://github.com/user-attachments/assets/b27a23cd-adf9-45ce-b755-ec96475dd065)
### Cài đặt unit test
Viết 23 unit test
 + Add a student to the class.
 + Add a class to the database.
 + Should return 409 error when class already existed.
 + should return 409 error when course doesn't exist.
 + Should return 409 error when year doesn't exist.
 + Adding a course API.
 + Handling duplicate course ID in add Course API.
 + Missing required fields in add Course API.
 + Handling very long course names in add Course API.
 + Handling special characters in course name and description in add. 
 + Export grades as an Excel file for valid student_id.
 + Should return 400 if student_id is missing.
 + Should return 404 if student exists but has no grades.
 + Should return 404 if student does not exist.
 + Delete registration successfully.
 + Should return 500 if registration does not exist.
 + Should return 500 if missing required fields.
 + Should delete a student successfully.
 + Should return 404 if student does not exist.
 + Export the student list as an Excel file.
 + Export the student list as a CSV file.
 + Should return 404 if no students to export as a CSV file.
 + Should return 404 if no students to export as a Excel file.
![image](https://github.com/user-attachments/assets/cfcde36f-7b20-49fb-a135-cbb3319132ea)

# Hướng dẫn sử dụng Version 6.0

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
### Refactor code
- Refactor theo clean code ở những file sau:
	+ search.js: Tách nhỏ hàm searchStudent.
	+ gradeController.js: Tách nhỏ hàm export grate.
	+ studentController.js: Tách nhỏ hàm export và import Student.
	+ courseController, courseModel: chỉnh lại phần mã lỗi cho chính xác.
	+ studentController, studentModel: Bỏ phần address và chỉnh lại phần mã lỗi cho chính xác.
### Chức năng chuyển ngôn ngữ cho các tiêu đề
Người dùng sẽ nhấn vào nút ngân ngữ trên thanh điều khiển để chọn loại ngôn ngữ
- Tiếng Việt
![Screenshot 2025-05-16 135507](https://github.com/user-attachments/assets/39a43e26-73d8-42bc-8ab3-e6013165600f)
- Tiếng Anh
![Screenshot 2025-05-16 135517](https://github.com/user-attachments/assets/032e81d5-c30e-4978-8845-192d860f8c2e)
### Chức năng chuyển ngôn ngữ cho các dữ liệu động
Thông tin sẽ hiển thị theo loại ngôn ngữ mà người dùng chọn
- Tiếng Việt
  ![Screenshot 2025-05-16 135624](https://github.com/user-attachments/assets/9e5e9916-aad1-41b9-abcf-b2611d0778bb)
- Tiếng Anh
  ![Screenshot 2025-05-16 135635](https://github.com/user-attachments/assets/2cf45868-6930-4550-ae04-0ce4989d31a1)
### Cài đặt thêm các unit test
+ Test classController: Bao gồm add Class (add thành công, thất bại), Thêm sinh viên vào class, Cập nhật CLass, Cập nhật học sinh trong lớp, lấy khóa học, lấy năm/ học kì.
+ Test classModel: Tìm kiếm năm và học kì
  ![image](https://github.com/user-attachments/assets/ebba9f57-c092-4b62-81e0-25e8581feb39)
+ Update test StudentController: Kiểm tra tìm kiếm, cập nhật, xóa.
  ![Screenshot 2025-05-16 162928](https://github.com/user-attachments/assets/28275d5a-8565-4532-8814-1483ad29bd22)
+ Test StudentModel: Update sinh viên.
  ![Screenshot 2025-05-16 162959](https://github.com/user-attachments/assets/f57e9173-f510-45cc-a785-dde42a9bc001)
+ Add student: add Student thành công, lỗi khi add sinh viên lặp ID, Lỗi có kí tự đặc biệt,...
  ![Screenshot 2025-05-16 163055](https://github.com/user-attachments/assets/f894e006-8fcb-4e2d-8011-dc1f1f7babd5)
+ Add Course: add Course thành công, lặp ID, lỗi ký tự đặc biệt.
+ Search Course: search Course thành công, Lỗi ID không xuất hiện, lấy toàn bộ course
+ Delete and update Course: Update thành công, update status thành công, xóa thành công, kiểm tra course đã có class, không thể update ID không xuất hiện.
+ Test Performance and Edge Cases.
  
  ![Screenshot 2025-05-16 163212](https://github.com/user-attachments/assets/601d9c8c-0aba-4a03-bdfc-4170ea0fbcb7)
# Hướng dẫn sử dụng Version 7.0

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
### Refactor code
- Tạo thêm tầng service nằm giữa controller và model. Viết code nghiệp vụ nằm trong tầng service này và ở controller hay model sẽ không có nghiệp vụ.
- Thay đổi tên các web api gọi đến để từ đó làm rõ và clean hơn về web api. Ví dụ: các api liên quan đến class sẽ bắt đầu bằng /class
- Web sử dụng mô hình 3 lớp và đã chia thêm tầng service giúp Clean Architecture
- Sửa lỗi một số chỗ theo unit test để có thể chạy test hoạt thiện toàn bộ.
- Viết các báo cáo từ 00 -> 09 về developer Guide để hướng dẫn developer một số cái về lập trình web sao cho clean và chính xác nhất.
