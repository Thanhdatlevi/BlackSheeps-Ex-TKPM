async function searchStudent() {
    const searchValue = document.getElementById("search").value.trim();
    const searchType = document.getElementById("searchType").value;
    
    if (!searchValue) {
        alert("Vui lòng nhập thông tin để tìm kiếm!");
        return;
    }
    
    const response = await fetch("/api/search-student", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ type: searchType, value: searchValue })
    });
    
    const result = await response.json();
    
    if (response.ok) {
        const studentList = document.getElementById("studentList");
        studentList.innerHTML = result.students.map(student => `
            <li class='p-4 border-b bg-white shadow rounded-lg mb-2'>
                <p><strong>MSSV:</strong> ${student.mssv}</p>
                <p><strong>Họ tên:</strong> ${student.name}</p>
                <p><strong>Ngày sinh:</strong> ${student.dob}</p>
                <p><strong>Giới tính:</strong> ${student.gender}</p>
                <p><strong>Khoa:</strong> ${student.faculty}</p>
                <p><strong>Khóa:</strong> ${student.course}</p>
                <p><strong>Chương trình:</strong> ${student.program}</p>
                <p><strong>Địa chỉ:</strong> ${student.address}</p>
                <p><strong>Email:</strong> ${student.email}</p>
                <p><strong>Số điện thoại:</strong> ${student.phone}</p>
                <p><strong>Tình trạng sinh viên:</strong> ${student.status}</p>
            </li>
        `).join("");
    } else {
        alert("Lỗi: " + result.message);
    }
}