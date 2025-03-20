async function searchStudent() { 
    const khoa = document.getElementById("facultySelect").value.trim();
    const mssv = document.getElementById("searchMSSV").value.trim();
    const name = document.getElementById("searchName").value.trim();
    console.log(mssv , name)
    // Nếu cả hai đều rỗng, không tìm kiếm
    if (!mssv && !name && !khoa) {
        alert("Vui lòng nhập MSSV hoặc Họ Tên hoặc Khoa để tìm kiếm!");
        return;
    }

    // Tạo query string chỉ chứa tham số có giá trị
    const query = new URLSearchParams();
    if (mssv) query.append("mssv", mssv);
    if (name) query.append("name", name);
    if (khoa) query.append("khoa", khoa);

    const response = await fetch(`/search-student?${query.toString()}`);
    const result = await response.json();

    if (response.ok) {
        const studentList = document.getElementById("studentList");

        if (!result || !Array.isArray(result) || result.length === 0) {
            studentList.innerHTML = `<p class='text-center text-gray-500'>Không tìm thấy sinh viên nào.</p>`;
            return;
        }

        // Hiển thị danh sách sinh viên
        studentList.innerHTML = result.map(student => {
            let formattedDate = "N/A";
            if (student.date_of_birth) {
                const tempDate = new Date(student.date_of_birth);
                formattedDate = tempDate.toISOString().split('T')[0];
            }

            if (student.identifications && student.identifications.length > 0) {
                idDocsHTML = `
                    <p><strong>Giấy tờ tùy thân:</strong></p>
                    <ul class="ml-4 list-disc grid grid-cols-2">
                        ${student.identifications.map(id => `
                            <li>
                                <p><strong>Loại:</strong> ${id.id_type}</p>
                                <p><strong>Số:</strong> ${id.id_number}</p>
                                <p><strong>Ngày cấp:</strong> ${id.issue_date || 'Không có'}</p>
                                <p><strong>Hạn sử dụng:</strong> ${id.expiry_date || 'Không có'}</p>
                                <p><strong>Nơi cấp:</strong> ${id.issue_place || 'Không có'}</p>
                                <p><strong>Quốc gia:</strong> ${id.issue_country || 'Không có'}</p>
                                <p><strong>Chip:</strong> ${id.has_chip ? 'Có' : 'Không'}</p>
                                <p><strong>Ghi chú:</strong> ${id.note || 'Không có'}</p>
                            </li>
                        `).join("")}
                    </ul>
                `;
            }

            return `
                <li class='p-4 border-b bg-white shadow rounded-lg mb-2'>
                    <p><strong>MSSV:</strong> ${student.student_id}</p>
                    <p><strong>Họ tên:</strong> ${student.full_name}</p>
                    <p><strong>Ngày sinh:</strong> ${formattedDate}</p>
                    <p><strong>Giới tính:</strong> ${student.gender}</p>
                    <p><strong>Khoa:</strong> ${student.faculty}</p>
                    <p><strong>Khóa:</strong> ${student.academic_year}</p>
                    <p><strong>Chương trình:</strong> ${student.education_program}</p>
                    <p><strong>Địa chỉ thường trú:</strong> ${student.permanent_address || 'Không có'}</p>
                    <p><strong>Địa chỉ tạm trú:</strong> ${student.temporary_address||'Không có'}</p>
                    <p><strong>Địa chỉ nhận thư:</strong> ${student.mailing_address|| 'Không có'}</p>
                    <p><strong>Email:</strong> ${student.email}</p>
                    <p><strong>Số điện thoại:</strong> ${student.phone}</p>
                    <p><strong>Tình trạng sinh viên:</strong> ${student.student_status}</p>
                    ${idDocsHTML}
                </li>
            `;
        }).join("");
    } else {
        alert("Lỗi: " + result.message);
    }
}

async function exportCSVList() {
    try {
        // Bước 1: Tải danh sách sinh viên
        await exportStudentList('/export/csv', 'students.csv');

        // Bước 2: Tải danh sách giấy tờ
        await exportStudentList('/export/csv/identification', 'identification_documents.csv');

    } catch (error) {
        console.error("Lỗi khi tải file:", error);
    }
}

async function exportExcelList() {
    try {
        // Bước 1: Tải danh sách sinh viên
        await exportStudentList('/export/excel', 'students.xlsx');

        // Bước 2: Tải danh sách giấy tờ
        await exportStudentList('/export/excel/identification', 'identification_documents.xlsx');

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
    const facultySelect = document.getElementById("facultySelect");

    try {
        const response = await fetch("/faculties"); // Gọi API để lấy danh sách khoa
        const data = await response.json();
        if (response.ok) {
            data.faculties.forEach(faculty => {
                const option = document.createElement("option");
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