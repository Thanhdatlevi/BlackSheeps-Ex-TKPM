async function searchStudent() {

    const khoa = document.getElementById('facultySelect').value.trim();
    const mssv = document.getElementById('searchMSSV').value.trim();
    const name = document.getElementById('searchName').value.trim();

    // Kiểm tra nếu không nhập gì thì cảnh báo
    if (!mssv && !name && !khoa) {
        alert(i18next.t('alert.notFill'));
        return;
    }

    // Tạo query string chỉ chứa tham số có giá trị
    const query = new URLSearchParams();
    if (mssv) query.append('mssv', mssv);
    if (name) query.append('name', name);
    if (khoa) query.append('khoa', khoa);

    try {
        const response = await fetch(`/search-student?${query.toString()}`);
        const result = await response.json();

        const studentList = document.getElementById('studentList');
        studentList.innerHTML = ''; // Xóa nội dung cũ

        if (!response.ok || !result || !Array.isArray(result) || result.length === 0) {
            studentList.innerHTML = `<p class='text-center text-gray-500'>${i18next.t('SEARCHSTUDENT.noListStudent')}.</p>`;
            return;
        }
        console.log(result)
        // Hiển thị danh sách sinh viên
        studentList.innerHTML = result.map(student => {
            const information = student.information;
            const ID_info = student.ID_info;
            const permanent_address = student.permanent_address;
            const temporary_address = student.temporary_address;
            const mailing_address = student.mailing_address;

            let formattedDate = 'N/A';
            if (information.date_of_birth) {
                const tempDate = new Date(information.date_of_birth);
                formattedDate = tempDate.toISOString().split('T')[0];
            }

            // Hiển thị giấy tờ tùy thân (nếu có)
            let idDocsHTML = '';
            if (ID_info) {
                idDocsHTML = `
                    <p><strong>${i18next.t('inforStudent.ID.idDoc')}:</strong></p>
                    <ul class="ml-4 list-disc grid grid-cols-2">
                        <li>
                            <p><strong>${i18next.t('ADDSTUDENT.idType')}:</strong> ${ID_info.id_type}</p>
                            <p><strong>${i18next.t('inforStudent.ID.number')}:</strong> ${ID_info.id_number}</p>
                            <p><strong>${i18next.t('inforStudent.ID.createDate')}:</strong> ${ID_info.issue_date || 'Không có'}</p>
                            <p><strong>${i18next.t('inforStudent.ID.expireDate')}:</strong> ${ID_info.expiry_date || 'Không có'}</p>
                            <p><strong>${i18next.t('inforStudent.ID.issuePlace')}:</strong> ${ID_info.issue_place || 'Không có'}</p>
                            <p><strong>${i18next.t('inforStudent.ID.hasChip')}:</strong> ${ID_info.issue_country || 'Không có'}</p>
                            <p><strong>${i18next.t('inforStudent.ID.country')}:</strong> ${ID_info.has_chip ? 'Có' : 'Không'}</p>
                            <p><strong>${i18next.t('inforStudent.ID.note')}:</strong> ${ID_info.note || 'Không có'}</p>
                        </li>
                    </ul>
                `;
            }

            // Hiển thị thông tin địa chỉ
            const addressHTML = (address, type) => address ? `
                <p><strong>${type}:</strong> ${address.street_address}, ${address.ward}, ${address.district}, ${address.city}, ${address.country}</p>
            ` : `<p><strong>${type}:</strong> Không có</p>`;

            return `
                <li class='p-4 border-b bg-white shadow rounded-lg mb-2'>
                    <p><strong>${i18next.t('inforStudent.studentID')}:</strong> ${information.student_id}</p>
                    <p><strong>${i18next.t('inforStudent.name')}:</strong> ${information.full_name}</p>
                    <p><strong>${i18next.t('inforStudent.dob')}:</strong> ${formattedDate}</p>
                    <p><strong>${i18next.t('inforStudent.gender')}:</strong> ${information.gender}</p>
                    <p><strong>${i18next.t('inforStudent.faculty')}:</strong> ${information.faculty}</p>
                    <p><strong>${i18next.t('inforStudent.course')}:</strong> ${information.academic_year}</p>
                    <p><strong>${i18next.t('inforStudent.program')}:</strong> ${information.education_program}</p>
                    <p><strong>${i18next.t('inforStudent.email')}:</strong> ${information.email}</p>
                    <p><strong>${i18next.t('inforStudent.phone')}:</strong> ${information.phone}</p>
                    <p><strong>${i18next.t('inforStudent.status')}:</strong> ${information.student_status}</p>
                    ${addressHTML(permanent_address, i18next.t('inforStudent.address.permanentAddress'))}
                    ${addressHTML(temporary_address, i18next.t('inforStudent.address.temporaryAddress'))}
                    ${addressHTML(mailing_address, i18next.t('inforStudent.address.mailingAddress'))}
                    ${idDocsHTML}
                </li>
            `;
        }).join("");

    } catch (error) {
        alert(i18next.t('alert.notConnectServer'));
        console.error(error);
    }
}

async function exportCSVList() {
    try {
        // Bước 1: Tải danh sách sinh viên
        await exportStudentList('/export/csv', 'students.csv');


    } catch (error) {
        console.error("Lỗi khi tải file:", error);
    }
}

async function exportExcelList() {
    try {
        // Bước 1: Tải danh sách sinh viên
        await exportStudentList('/export/excel', 'students.xlsx');


    } catch (error) {
        console.error("Lỗi khi tải file:", error);
    }
}

async function exportStudentList(url, filename) {
    return fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl);
        })
        .catch(error => console.error(`Lỗi khi tải file ${filename}:`, error));
}

document.addEventListener("DOMContentLoaded", async function () {
    
    await window.i18nReady; //Đảm bảo i18next đã sẵn sàng
    const facultySelect = document.getElementById('facultySelect');

    try {
        const response = await fetch("/faculties"); // Gọi API để lấy danh sách khoa
        const data = await response.json();
        if (response.ok) {
            data.faculties.forEach(faculty => {
                const option = document.createElement('option');
                option.value = faculty.faculty_id;
                option.textContent = faculty.faculty_name;
                facultySelect.appendChild(option);
            });
        } else {
            console.error("Lỗi khi lấy danh sách khoa:", data.message);
        }
    } catch (error) {
        console.error("Lỗi kết nối API:", error);
    }
});