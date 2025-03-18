window.queryStudent = async () => {
    mssv = document.getElementById('updateId').value;
    if (!mssv) {
        alert("Vui lòng nhập MSSV để cập nhật!");
        return;
    }

    const result = await fetch(`/updateSearch?mssv=${mssv}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })


    data = await result.json();

    console.log(data)
    if (data.length === 0) {
        alert('Mã số sinh viên không tồn tại!');
        return
    }

    console.log(data[0]);
    document.getElementById('updateHoten').value = data[0].full_name;
    // console.log(tempDate)
    document.getElementById('updateNgaySinh').value = data[0].date_of_birth;
    document.getElementById('updateGioiTinh').value = data[0].gender;
    document.getElementById('updateKhoa').value = data[0].faculty;
    document.getElementById('updateNamKhoa').value = data[0].academic_year;
    document.getElementById('updateChuongTrinh').value = data[0].education_program;
    document.getElementById('updateDiaChi').value = data[0].address;
    document.getElementById('updateEmail').value = data[0].email;
    document.getElementById('updateSdt').value = data[0].phone;
    document.getElementById('updateTinhTrang').value = data[0].student_status;
};

window.updateStudent = async () => {
    const sinhvien = {
        mssv: document.getElementById('updateId').value,
        name: document.getElementById('updateHoten').value,
        dob: document.getElementById('updateNgaySinh').value,
        gender: document.getElementById('updateGioiTinh').value,
        faculty: document.getElementById('updateKhoa').value,
        course: document.getElementById('updateNamKhoa').value,
        program: document.getElementById('updateChuongTrinh').value,
        address: document.getElementById('updateDiaChi').value,
        email: document.getElementById('updateEmail').value,
        phone: document.getElementById('updateSdt').value,
        status: document.getElementById('updateTinhTrang').value
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(sinhvien.email)) {
        alert("Email không hợp lệ!");
        return;
    }
    // Kiểm tra sdt có đúng định dạng không
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(sinhvien.phone)) {
        alert("Số điện thoại không hợp lệ!");
        return;
    }

    const validDepartments = ["Khoa Luật", "Khoa Tiếng Anh thương mại", "Khoa Tiếng Nhật", "Khoa Tiếng Pháp"];
    if (!validDepartments.includes(sinhvien.faculty)) {
        alert("Khoa không hợp lệ! Vui lòng chọn một trong các khoa: " + validDepartments.join(", "));
        return;
    }

    const validStatuses = ["Đang học", "Đã tốt nghiệp", "Đã thôi học", "Tạm dừng học"];
    if (!validStatuses.includes(sinhvien.status)) {
        alert("Tình trạng sinh viên không hợp lệ! Vui lòng chọn một trong các tình trạng: " + validStatuses.join(", "));
        return;
    }

    console.log(JSON.stringify(sinhvien));
    const response = await fetch(`/update`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sinhvien)
    })

    if (response.status != 200) {
        alert("Update student failed");
    }
    else {
        alert("Update student successfully");
    }
};
