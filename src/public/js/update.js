window.grayCheckBox = async () => {
    value = document.getElementById('updateCardIDType').value;
    if (value !== "CCCD") {
        document.getElementById('updateCardChip').disabled = "disabled";
        document.getElementById('updateCardChip').checked = false;
    }
    else {
        document.getElementById('updateCardChip').removeAttribute('disabled');
    }

    if (value !== "passport") {
        document.getElementById('updateCardIssueCountry').disabled = "disabled"
        document.getElementById('updateCardIssueCountry').classList.add('bg-gray-100')
    }
    else {
        document.getElementById('updateCardIssueCountry').removeAttribute('disabled');
        document.getElementById('updateCardIssueCountry').classList.remove('bg-gray-100')
    }
}
// run once everytime this page load 
grayCheckBox();

window.queryStudentIdentification = async () => {
    mssv = document.getElementById('updateId').value;
    if (!mssv) {
        alert("Vui lòng nhập MSSV để cập nhật!");
        return;
    }

    const result = await fetch(`/updateSearchID?mssv=${mssv}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })


    data = await result.json();

    console.log(data)
    if (data.length === 0) {
        alert('Giấy tờ tuỳ thân của mã số sinh viên tương ứng không tồn tại!');
        return
    }

    console.log(data[0]);
    document.getElementById('updateCardIDType').value = data[0].id_type;
    document.getElementById('updateCardIDNumber').value = data[0].id_number;
    document.getElementById('updateCardIssueDate').value = data[0].issue_date;
    document.getElementById('updateCardIssuePlace').value = data[0].issue_place;
    document.getElementById('updateCardExpireDate').value = data[0].expiry_date;
    document.getElementById('updateCardChip').checked = data[0].has_chip;
    document.getElementById('updateCardIssueCountry').value = data[0].issue_country;
    document.getElementById('updateCardNotes').value = data[0].note;

    grayCheckBox();
};
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
    data = data[0]

    console.log(data)
    if (data.length === 0) {
        alert('Mã số sinh viên không tồn tại!');
        return
    }

    console.log(data);
    document.getElementById('updateHoten').value = data.full_name;
    document.getElementById('updateNgaySinh').value = data.date_of_birth;
    document.getElementById('updateGioiTinh').value = data.gender;
    document.getElementById('updateKhoa').value = data.faculty;
    document.getElementById('updateNamKhoa').value = data.academic_year;
    document.getElementById('updateChuongTrinh').value = data.education_program;
    // document.getElementById('updateDiaChi').value = data.address;
    document.getElementById('updateEmail').value = data[0].email;
    document.getElementById('updateSdt').value = data[0].phone;
    document.getElementById('updateTinhTrang').value = data[0].student_status;

    permanent_address = data.permanent_address.split(', ');
    perm_add_elems = document.getElementsByClassName('permanent_address_cl');
    if (data.permanent_address != undefined) {
        for (i = 0; i < perm_add_elems.length; i++) {
            perm_add_elems[i].value = permanent_address[i];
        }
    }
    else {
        for (i = 0; i < perm_add_elems.length; i++) {
            perm_add_elems[i].value = '';
        }
    }


    temporary_address = data.temporary_address.split(', ');
    let temp_add_elems = document.getElementsByClassName('temporary_address_cl');
    if (temporary_address != undefined && temporary_address[0] != undefined) {
        for (i = 0; i < temp_add_elems.length; i++) {
            temp_add_elems[i].value = temporary_address[i];
        }
    }
    else {
        for (i = 0; i < temp_add_elems.length; i++) {
            temp_add_elems[i].value = '';
        }
    }

};

window.updateStudent = async () => {
    const sinhvien = {
        //information: {
        mssv: document.getElementById('updateId').value,
        name: document.getElementById('updateHoten').value,
        dob: document.getElementById('updateNgaySinh').value,
        gender: document.getElementById('updateGioiTinh').value,
        faculty: document.getElementById('updateKhoa').value,
        course: document.getElementById('updateNamKhoa').value,
        program: document.getElementById('updateChuongTrinh').value,
        email: document.getElementById('updateEmail').value,
        phone: document.getElementById('updateSdt').value,
        status: document.getElementById('updateTinhTrang').value,
        //},

        // TODO: group these up to identification info 
        //ID_info: {
        id_type: document.getElementById('updateCardIDType').value,
        id_number: document.getElementById('updateCardIDNumber').value,
        issue_date: document.getElementById('updateCardIssueDate').value,
        issue_place: document.getElementById('updateCardIssuePlace').value,
        expire_date: document.getElementById('updateCardExpireDate').value,
        card_chip: document.getElementById('updateCardChip').checked,
        issue_country: document.getElementById('updateCardIssueCountry').value,
        note: document.getElementById('updateCardNotes').value,
        //},

        permanent_address: {
            student_id: document.getElementById('updateId').value,
            addresstype: 'thuongtru',
            street: document.getElementById('permanent_street').value,
            ward: document.getElementById('permanent_ward').value,
            district: document.getElementById('permanent_district').value,
            city: document.getElementById('permanent_city').value,
            country: document.getElementById('permanent_country').value,
        },

        temporary_address: {
            student_id: document.getElementById('updateId').value,
            addresstype: 'tamtru',
            street: document.getElementById('temporary_street').value,
            ward: document.getElementById('temporary_ward').value,
            district: document.getElementById('temporary_district').value,
            city: document.getElementById('temporary_city').value,
            country: document.getElementById('temporary_country').value,
        },

        mailing_address: {
            student_id: document.getElementById('updateId').value,
            addresstype: 'nhanthu',
            street: document.getElementById('mailing_street').value,
            ward: document.getElementById('mailing_ward').value,
            district: document.getElementById('mailing_district').value,
            city: document.getElementById('mailing_city').value,
            country: document.getElementById('mailing_country').value,
        },
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
