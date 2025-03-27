async function deleteStudent() {
    const deleteId = document.getElementById('deleteId').value.trim();
    
    if (!deleteId) {
        alert("Vui lòng nhập MSSV để xóa!");
        return;
    }

    // Hiển thị hộp thoại xác nhận
    const isConfirmed = confirm(`Bạn có chắc chắn muốn xóa sinh viên có MSSV: ${deleteId} không?`);
    
    if (!isConfirmed) {
        return; // Người dùng hủy, không thực hiện xóa
    }

    const response = await fetch("/delete-student", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ mssv: deleteId })
    });

    const result = await response.json();

    if (response.ok) {
        alert(`Xóa thành công!\nTên: ${result.deletedStudent.full_name}\nMSSV: ${result.deletedStudent.student_id}`);
        document.getElementById('deleteId').value = '';
    } else {
        alert("Lỗi: " + result.message);
    }
}