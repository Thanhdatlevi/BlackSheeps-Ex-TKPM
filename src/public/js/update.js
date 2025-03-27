window.grayCheckBox = async () => {
    // TODO: fix this please
    value = document.getElementById('id_type').value;
    if (value !== "CCCD") {
        document.getElementById('has_chip').disabled = "disabled";
        document.getElementById('has_chip').checked = false;
    }
    else {
        document.getElementById('has_chip').removeAttribute('disabled');
    }

    if (value !== "passport") {
        document.getElementById('issue_country').disabled = "disabled"
        document.getElementById('issue_country').classList.add('bg-gray-100')
    }
    else {
        document.getElementById('issue_country').removeAttribute('disabled');
        document.getElementById('issue_country').classList.remove('bg-gray-100')
    }
}
// run once everytime this page load 
grayCheckBox();

window.queryStudentIdentification = async (id) => {
    mssv = document.getElementById(id).value;
    if (!mssv) {
        alert("Vui lòng nhập MSSV để cập nhật!");
        return;
    }

    const result = await fetch(`/updateSearchID?mssv=${mssv}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })


    data = await result.json();

    if (data.length === 0) {
        alert('Giấy tờ tuỳ thân của mã số sinh viên tương ứng không tồn tại!');
        return
    }

    data = data[0]
    // showStudentInfo('ID_info', data);
    // document.getElementById('updateCardIDType').value = data[0].id_type;
    // document.getElementById('updateCardIDNumber').value = data[0].id_number;
    // document.getElementById('updateCardIssueDate').value = data[0].issue_date;
    // document.getElementById('updateCardIssuePlace').value = data[0].issue_place;
    // document.getElementById('updateCardExpireDate').value = data[0].expiry_date;
    // document.getElementById('updateCardChip').checked = data[0].has_chip;
    // document.getElementById('updateCardIssueCountry').value = data[0].issue_country;
    // document.getElementById('updateCardNotes').value = data[0].note;
    //
    grayCheckBox();
};

window.showStudentInfo = async (type, data) => {
    info_elems = document.getElementById(type);
    for (i = 0; i < info_elems.childNodes.length; i++) {
        let curr_elem = info_elems.childNodes[i]
        let node_name = curr_elem.id

        if (['student_id', 'student_id_2', 'student_id_3'].find((name) => name == node_name) != undefined) {
            // TODO: after merge
            // console.log(data['student_id']);
            continue;
        }

        if (node_name == undefined || node_name == "") {
            continue;
        }

        if (node_name == 'has_chip') {
            curr_elem.checked = data[node_name];
            continue;
        }
        curr_elem.value = data[node_name]
    }
}

window.showStudentAddress = async (addrType, data) => {
    elem_name = addrType + '_address';
    class_name = addrType + '_address_cl';

    address = data[elem_name].split(', ');
    let add_elems = document.getElementsByClassName(class_name);
    console.log(address);
    if (address != undefined && address[0] != "") {
        for (i = 0; i < add_elems.length; i++) {
            add_elems[i].value = address[i];
        }
    }
    else {
        for (i = 0; i < add_elems.length; i++) {
            add_elems[i].value = "";
        }
    }

}

window.queryStudent = async (id) => {
    mssv = document.getElementById(id).value;
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

    // info
    showStudentInfo('student_info', data);

    // TODO: why identifications is an array ??
    showStudentInfo('ID_info', data.identifications[0]);

    // perm address
    showStudentAddress('permanent', data);

    // temp address
    showStudentAddress('temporary', data);

    // mail address
    showStudentAddress('mailing', data);

};

window.getInformationFromElements = async (object_group) => {
    let inputs = document.getElementById(object_group)
    inputs = inputs.querySelectorAll(['input', 'select']);

    console.log(inputs);

    let information = {};

    for (i = 0; i < inputs.length; i++) {
        if (inputs[i].value == "" || inputs[i].value == undefined) {
            if(['note', 'student_id_3', 'issue_country', 'has_chip'].find((element) => element == inputs[i].id) != undefined){
                continue;
            }
            information = undefined;
            break;
        }
        information[inputs[i].getAttribute('id')] = inputs[i].value;
    }

    return information;
}
window.updateStudent = async () => {
    const info = await getInformationFromElements("student_info");

    const ID_info = await getInformationFromElements('ID_info');

    const permanent_address = await getInformationFromElements('permanent_address_info');

    const temporary_address = await getInformationFromElements('temporary_address_info');

    const mailing_address = await getInformationFromElements('mailing_address_info');

    const sinhvien = {
        info: info,
        ID_info: ID_info,
        permanent_address: permanent_address,
        temporary_address: temporary_address,
        mailing_address: mailing_address
    }

    // TODO: fix backend controller before deploy this 
    console.log(sinhvien);

    return undefined;

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

    // console.log(JSON.stringify(sinhvien));
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
