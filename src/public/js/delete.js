async function deleteStudent() {
    const deleteId = document.getElementById("deleteId").value.trim();
    
    if (!deleteId) {
        alert("Vui lòng nhập MSSV để xóa!");
        return;
    }
    
    const response = await fetch("/api/delete-student", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ mssv: deleteId })
    });
    
    const result = await response.json();
    
    if (response.ok) {
        alert("Xóa sinh viên thành công!");
        document.getElementById("deleteId").value = "";
    } else {
        alert("Lỗi: " + result.message);
    }
}