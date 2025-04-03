// Hàm tải tất cả lớp học của sinh viên ngay khi trang tải
async function loadAllRegisteredClasses() {
    const response = await fetch('/registration/searchdeleteRegistration');
    const data = await response.json();

    const tableBody = document.getElementById('classListBody');
    tableBody.innerHTML = ''; // Xóa nội dung cũ
    
    if (data.data.length > 0) {
        data.data.forEach((deleteRegistration) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-4 py-2">${deleteRegistration.student_id}</td>
                <td class="px-4 py-2">${deleteRegistration.class_id}</td>
                <td class="px-4 py-2">${deleteRegistration.course_id}</td>
                <td class="px-4 py-2">${deleteRegistration.year}</td>
                <td class="px-4 py-2">${deleteRegistration.semester}</td>
                <td class="px-4 py-2">
                    <button class="px-4 py-2 bg-red-500 text-white rounded-lg" onclick="deleteClass('${deleteRegistration.student_id}', '${deleteRegistration.class_id}', '${deleteRegistration.course_id}', '${deleteRegistration.year}', ${deleteRegistration.semester})">Xóa</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-500">${data.message}</td></tr>`;
    }
}

// Hàm xử lý tìm kiếm lớp đăng ký theo MSSV
document.getElementById('searchBtn').addEventListener('click', async function() {
    const studentId = document.getElementById('studentId').value.trim();
    if (!studentId) {
        alert("Vui lòng nhập mã sinh viên.");
        return;
    }

    const response = await fetch(`/registration/searchdeleteRegistration?student_id=${studentId}`);
    const data = await response.json();

    const tableBody = document.getElementById('classListBody');
    tableBody.innerHTML = '';
    
    if (data.data.length > 0) {
        data.data.forEach((deleteRegistration) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-4 py-2">${deleteRegistration.student_id}</td>
                <td class="px-4 py-2">${deleteRegistration.class_id}</td>
                <td class="px-4 py-2">${deleteRegistration.course_id}</td>
                <td class="px-4 py-2">${deleteRegistration.year}</td>
                <td class="px-4 py-2">${deleteRegistration.semester}</td>
                <td class="px-4 py-2">
                    <button class="px-4 py-2 bg-red-500 text-white rounded-lg" onclick="deleteRegister('${deleteRegistration.student_id}', '${deleteRegistration.class_id}', '${deleteRegistration.course_id}', '${deleteRegistration.year}', ${deleteRegistration.semester})">Xóa</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-500">${data.message}</td></tr>`;
    }
});

// Hàm xóa lớp đăng ký
async function deleteRegister(student_id, class_id, course_id, year, semester) {
    const isConfirmed = confirm(`Bạn có chắc chắn muốn xóa đăng ký ${student_id}, ${class_id}, ${course_id} này không?`);

    if (!isConfirmed) return;

    const response = await fetch('/registration/deleteRegistration', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id, class_id, course_id, year, semester })
    });

    const result = await response.json();
    if (response.ok) {
        alert(result.message);
        loadAllRegisteredClasses();
    } else {
        alert(result.message || 'Lỗi khi xóa lớp.');
    }
}

window.onload = loadAllRegisteredClasses;