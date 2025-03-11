// public/app.js
document.addEventListener("DOMContentLoaded", () => {
    const fetchStudents = async () => {
        const res = await fetch("/students");
        const students = await res.json();
        renderStudents(students);
    };

    const renderStudents = (students) => {
        document.getElementById("studentList").innerHTML = students.map(s => `
            <li>${s.name} - ${s.id} 
                <button onclick="deleteStudent('${s.id}')" class="bg-red-500 text-white p-1 rounded">Xóa</button>
                <button onclick="updateStudent('${s.id}')" class="bg-yellow-500 text-white p-1 rounded">Cập nhật</button>
            </li>`).join(" ");
    };

    window.deleteStudent = async (id) => {
        await fetch(`/students/delete/${id}`, { method: "DELETE" });
        fetchStudents();
    };

    window.updateStudent = async (id) => {
        const newName = prompt("Nhập tên mới:");
        const newEmail = prompt("Nhập email mới:");
        const newPhone = prompt("Nhập số điện thoại mới:");
        if (newName && newEmail && newPhone) {
            await fetch(`/students/update/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, name: newName, email: newEmail, phone: newPhone }),
            });
            fetchStudents();
        }
    };

    fetchStudents();
});
