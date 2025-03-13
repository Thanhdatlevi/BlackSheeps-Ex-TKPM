async function addStudent(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Kiểm tra email có đúng định dạng không
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(data.email)) {
        alert("Email không hợp lệ!");
        return;
    }
    // Kiểm tra sdt có đúng định dạng không
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(data.phone)) {
        alert("Số điện thoại không hợp lệ!");
        return;
    }
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
