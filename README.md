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

## Hướng dẫn cài đặt và chạy chương trình

# Hướng dẫn cài đặt
Bước 1: Cài đặt NodeJS và npm
Bước 2: Clone repo về máy
Bước 3: Chạy npm install để cài đặt node-modules
Bước 4: Tạo file .env và thêm các nội dung có note bên bài txt đã nộp

# Chạy chương trình
Trong terminal

Nếu là môi trường sản phẩm chạy npm start

Nếu là môi trường developer chạy
    npm run build:css (Để khởi động tailwind)
    npm run start:dev (Để chạy web)
