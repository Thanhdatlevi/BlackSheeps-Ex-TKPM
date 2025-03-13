async function addStudent(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(form.action, {
            method: form.method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message); // Hiển thị alert khi thêm thành công
            document.getElementById("studentForm").reset(); // Reset form bằng ID
            console.log("Form đã reset");
        } else {
            alert(result.message); // Hiển thị alert khi có lỗi (email/sđt không hợp lệ)
        }
    } catch (error) {
        console.error("Lỗi gửi form:", error);
        alert("Đã xảy ra lỗi, vui lòng thử lại!");
    }
}

document.getElementById("studentForm").addEventListener("submit", addStudent);
