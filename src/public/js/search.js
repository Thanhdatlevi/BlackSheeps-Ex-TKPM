async function searchStudent() { 
    const mssv = document.getElementById("searchMSSV").value.trim();
    const name = document.getElementById("searchName").value.trim();
    console.log(mssv , name)
    // Nếu cả hai đều rỗng, không tìm kiếm
    if (!mssv && !name) {
        alert("Vui lòng nhập MSSV hoặc Họ Tên để tìm kiếm!");
        return;
    }

    // Tạo query string chỉ chứa tham số có giá trị
    const query = new URLSearchParams();
    if (mssv) query.append("mssv", mssv);
    if (name) query.append("name", name);

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
            // Chuyển đổi ngày sinh sang định dạng YYYY-MM-DD
            let formattedDate = "N/A";
            if (student.date_of_birth) {
                const tempDate = new Date(student.date_of_birth);
                formattedDate = tempDate.toISOString().split('T')[0];
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
                    <p><strong>Địa chỉ:</strong> ${student.address}</p>
                    <p><strong>Email:</strong> ${student.email}</p>
                    <p><strong>Số điện thoại:</strong> ${student.phone}</p>
                    <p><strong>Tình trạng sinh viên:</strong> ${student.student_status}</p>
                </li>
            `;
        }).join("");
    } else {
        alert("Lỗi: " + result.message);
    }
}