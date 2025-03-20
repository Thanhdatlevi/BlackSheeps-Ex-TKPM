async function addStudent(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(data.email)) {
        alert("Email không hợp lệ!");
        return;
    }

    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(data.phone)) {
        alert("Số điện thoại không hợp lệ!");
        return;
    }

    const validDepartments = ["Khoa Luật", "Khoa Tiếng Anh thương mại", "Khoa Tiếng Nhật", "Khoa Tiếng Pháp"];
    if (!validDepartments.includes(data.faculty)) {
        alert("Khoa không hợp lệ! Vui lòng chọn một trong các khoa: " + validDepartments.join(", "));
        return;
    }

    const validStatuses = ["Đang học", "Đã tốt nghiệp", "Đã thôi học", "Tạm dừng học"];
    if (!validStatuses.includes(data.status)) {
        alert("Tình trạng sinh viên không hợp lệ! Vui lòng chọn một trong các tình trạng: " + validStatuses.join(", "));
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


let importType = "";

function openImportDialog(type) {
    importType = type;
    document.getElementById("importTitle").innerText = `Import ${type.toUpperCase()}`;
    document.getElementById("importDialog").style.display = "block";
}

function closeDialog() {
    document.getElementById("importDialog").style.display = "none";
}

function submitImport() {
    const studentFile = document.getElementById("studentFile").files[0];
    const docFile = document.getElementById("docFile").files[0];

    if (!studentFile || !docFile) {
        alert("Vui lòng chọn đủ 2 file.");
        return;
    }

    const formData = new FormData();
    formData.append("studentFile", studentFile);
    formData.append("docFile", docFile);
    fetch(`/import/${importType}`, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        closeDialog();
    })
    .catch(error => {
        console.error("Lỗi import:", error);
        alert("Import thất bại.");
    });
}