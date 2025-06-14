document.addEventListener("DOMContentLoaded", async function() {
    await window.i18nReady; // Đảm bảo i18next đã sẵn sàng

    const facultySelect = document.getElementById("faculty");
    const programSelect = document.getElementById("education_program");
    const statusSelect = document.getElementById("student_status");

    // run once everytime this page load 
    grayCheckBox();

    try {
        // Gọi từng API riêng biệt
        const faculties = await fetchFaculties();
        const programs = await fetchPrograms();
        const statuses = await fetchStatuses();
        console.log(statuses, programs, 11)
        // Render dữ liệu vào <select>
        renderOptions(facultySelect, faculties);
        renderOptions(programSelect, programs);
        renderOptions(statusSelect, statuses);

        // Lưu dữ liệu vào biến để kiểm tra hợp lệ
        window.facultyOptions = faculties.map(f => f.faculty_name);
        window.statusOptions = statuses.map(s => s.status_name);
        window.programOptions = programs.map(s => s.program_name);

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
});

// Hàm fetch danh sách khoa
async function fetchFaculties() {
    const response = await fetch("/faculty/faculties");
    const data = await response.json();
    if (!response.ok) throw new Error("Lỗi lấy danh sách khoa");
    return data.faculties;
}

// Hàm fetch danh sách chương trình đào tạo
async function fetchPrograms() {
    const response = await fetch("/program/programs");
    const data = await response.json();
    if (!response.ok) throw new Error("Lỗi lấy danh sách chương trình đào tạo");
    console.log(data, 'program')
    return data.programs;
}

// Hàm fetch danh sách trạng thái sinh viên
async function fetchStatuses() {
    const response = await fetch("/status/statuses");
    const data = await response.json();
    if (!response.ok) throw new Error("Lỗi lấy danh sách trạng thái sinh viên");
    console.log(data, 'status')
    return data.status;
}

// Hàm render options vào select
function renderOptions(selectElement, data) {
    selectElement.innerHTML = data.map(item => `<option value="${item.faculty_name || item.program_name || item.status_name}">${item.faculty_name || item.program_name || item.status_name}</option>`).join('');
}

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
        document.getElementById('issue_country').value = '';
        document.getElementById('issue_country').disabled = "disabled"
        document.getElementById('issue_country').classList.add('bg-gray-100')
    }
    else {
        document.getElementById('issue_country').removeAttribute('disabled');
        document.getElementById('issue_country').classList.remove('bg-gray-100')
    }
}

window.queryStudentIdentification = async (id) => {
    mssv = document.getElementById(id).value;
    if (!mssv) {
        alert(i18next.t('alert.notFill'));
        return;
    }

    const result = await fetch(`/updateSearch?mssv=${mssv}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })

    data = await result.json();

    if (data.length === 0) {
        alert(i18next.t('alert.noInfoStudent'));
        return
    }

    data = data[0]
    grayCheckBox();
};

window.showStudentInfo = async (type, data) => {
    console.log(data)
    info_elems = document.getElementById(type);
    for (i = 0; i < info_elems.childNodes.length; i++) {
        let curr_elem = info_elems.childNodes[i]
        let node_name = curr_elem.id

        if (['student_id', 'student_id_2', 'student_id_3'].find((name) => name == node_name) != undefined) {
            curr_elem.value = data['student_id'];
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

window.queryStudent = async (id) => {
    mssv = document.getElementById(id).value;
    if (!mssv) {
        alert(i18next.t('alert.notFill'));
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
        alert(i18next.t('alert.noInfoStudent'));
        return
    }

    // info
    showStudentInfo('student_info', data.information);

    // TODO: why identifications is an array ??
    showStudentInfo('ID_info', data.ID_info);
    showStudentInfo('address_info', data.ID_info);
    showStudentInfo('permanent_address_info', data.permanent_address);
    showStudentInfo('temporary_address_info', data.temporary_address);
    showStudentInfo('mailing_address_info', data.mailing_address);
};

window.getInformationFromElements = async (object_group) => {
    let inputs = document.getElementById(object_group)
    inputs = inputs.querySelectorAll(['input', 'select']);

    let information = {};

    if (['permanent_address_info',
        'temporary_address_info',
        'mailing_address_info'].find((element) => element == object_group)
        != undefined) {
        information['student_id'] = document.getElementById('student_id_2').value;
    }

    for (i = 0; i < inputs.length; i++) {
        if (inputs[i].value == "" || inputs[i].value == undefined) {
            // prevent id from undefined with non required info
            if (['note', 'issue_country', 'has_chip'].find((element) => element == inputs[i].id) != undefined) {
                continue;
            }
            information = undefined;
            break;
        }
        if (['student_id_3'].find((element) => element == inputs[i].id) != undefined) {
            information['student_id'] = inputs[i].value;
            continue;
        }
        information[inputs[i].id] = inputs[i].value;
    }

    return information;
}
window.updateStudent = async () => {
    const information = await getInformationFromElements("student_info");

    // TODO: fix backend controller before deploy this 
    // return undefined;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(information.email)) {
        alert(i18next.t('alert.errorFormatEmail'));
        return;
    }
    // Kiểm tra sdt có đúng định dạng không
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(information.phone)) {
        alert(i18next.t('alert.errorPhone'));
        return;
    }

    if (!window.facultyOptions.includes(information.faculty)) {
        alert(i18next.t('alert.invalidFaculty')+ window.facultyOptions.join(", "));
        return;
    }

    if (!window.statusOptions.includes(information.student_status)) {
        alert(i18next.t('alert.invalidStatus') + window.statusOptions.join(", "));
        return;
    }

    if (!window.programOptions.includes(information.education_program)) {
        alert(i18next.t('alert.invalidProgram') + window.programOptions.join(", "));
        return;
    }

    // console.log(JSON.stringify(sinhvien));
    const response = await fetch(`/update/student`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(information)
    })

    if (!response.ok) {
        // Lấy chi tiết lỗi từ API nếu có
        const errorData = await response.json();
        alert(errorData.message);
    }
    else {
        alert(i18next.t('alert.updateSuccStudent'));
    }
};

window.updateIdentification = async () => {
    const ID_info = await getInformationFromElements('ID_info');

    const response = await fetch(`/update/identification`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ID_info)
    })

    if (response.status != 200) {
        alert(i18next.t('alert.updateFaultStudent'));
    }
    else {
        alert(i18next.t('alert.updateSuccStudent'));
    }
};

window.updateAddress = async () => {
    const permanent_address = await getInformationFromElements('permanent_address_info');
    permanent_address['address_type'] = 'thuongtru'

    const temporary_address = await getInformationFromElements('temporary_address_info');
    temporary_address['address_type'] = 'tamtru'

    const mailing_address = await getInformationFromElements('mailing_address_info');
    mailing_address['address_type'] = 'nhanthu'

    address = {
        permanent_address: permanent_address,
        temporary_address: temporary_address,
        mailing_address: mailing_address
    }

    const ID_info = await getInformationFromElements('ID_info');

    const response = await fetch(`/update/address`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address)
    })

    if (response.status != 200) {
        alert(i18next.t('alert.updateFaultStudent'));
    }
    else {
        alert(i18next.t('alert.updateSuccStudent'));
    }

}
