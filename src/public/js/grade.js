async function fetchStudentGrades() {
    const studentId = document.getElementById("studentId").value;
    if (!studentId) {
        alert(i18next.t('alert.notFill'));
        return;
    }
    
    const response = await fetch(`/searchGrade?student_id=${studentId}`);
    const data = await response.json();
    console.log(data)

    const tableBody = document.getElementById("gradesTable");
    tableBody.innerHTML = "";
    let totalCredits = 0;
    let totalPoints = 0;
    console.log(data.grades)
    if (data.grades.length > 0) {
        data.grades.forEach((grade) => {
            const row = `<tr>
            <td class="border p-2">${grade.course_id}</td>
            <td class="border p-2">${grade.course_name}</td>
            <td class="border p-2">${grade.year}</td>
            <td class="border p-2">${grade.semester}</td>
            <td class="border p-2">${grade.credit}</td>
            <td class="border p-2">${grade.grade}</td>
            </tr>`;
            tableBody.innerHTML += row;
            
            totalCredits += grade.credit;
            totalPoints += grade.grade * grade.credit;
        });
    } else {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-500">${data.message}</td></tr>`;
    }

    const gpa = (totalPoints / totalCredits).toFixed(2);
    document.getElementById("gpa").innerText = gpa;
}

async function exportStudentGrades() {
    const studentId = document.getElementById("studentId").value.trim();
    if (!studentId) {
        alert(i18next.t('alert.notFill'));
        return;
    }

    const url = `/exportGrades?student_id=${studentId}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Lỗi: ${response.statusText}`);
        }

        // Tạo URL tải file
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        
        // Tạo thẻ <a> để tải file
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `bang_diem_${studentId}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Giải phóng bộ nhớ
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error("Lỗi khi tải bảng điểm:", error);
        alert(i18next.t('alert.cantDownloadStudent'));
    }
}