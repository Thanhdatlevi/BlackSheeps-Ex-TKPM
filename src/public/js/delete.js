async function deleteStudent() {
    await window.i18nReady; //Đảm bảo i18next đã sẵn sàng
    const deleteId = document.getElementById('deleteId').value.trim();
    
    if (!deleteId) {
        alert(i18next.t('alert.notFill'));
        return;
    }

    // Hiển thị hộp thoại xác nhận
    const isConfirmed = confirm(`${i18next.t('alert.suredDeleteStudent')} ${deleteId}`);
    
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
        alert(`${i18next.t('alert.deleteSuccStudent')}\nTên: ${result.deletedStudent.full_name}\nMSSV: ${result.deletedStudent.student_id}`);
        document.getElementById('deleteId').value = '';
    } else {
        alert("Lỗi: " + result.message);
    }
}