function getLangFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('lang') || 'vi';
}

async function loadFaculties() {
    try {
        const response = await fetch('/faculty/faculties');
        const data = await response.json();
        const facultySelect = document.getElementById('faculty');
        
        if (data.faculties && data.faculties.length > 0) {
            data.faculties.forEach(faculty => {
                const option = document.createElement('option');
                option.value = faculty.faculty_id; // Sử dụng ID
                option.textContent = faculty.faculty_name;
                facultySelect.appendChild(option);
            });
        } else {
            // Fallback nếu không lấy được dữ liệu từ API
            const validDepartments = ['Khoa Luật', 'Khoa Tiếng Anh thương mại', 'Khoa Tiếng Nhật', 'Khoa Tiếng Pháp'];
            validDepartments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept;
                option.textContent = dept;
                facultySelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading faculties:', error);
        // Fallback khi có lỗi
        const validDepartments = ['Khoa Luật', 'Khoa Tiếng Anh thương mại', 'Khoa Tiếng Nhật', 'Khoa Tiếng Pháp'];
        const facultySelect = document.getElementById('faculty');
        validDepartments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept;
            option.textContent = dept;
            facultySelect.appendChild(option);
        });
    }
}
async function validPrerequisite(prerequisite){
    const query = new URLSearchParams();
    query.append('courseId', prerequisite); // Thay 'courseCode' bằng tên tham số mà API yêu cầu
    try {
        // Gửi request với query string
        const response = await fetch(`/course/searchCourseById?${query.toString()}`);

        // Kiểm tra nếu response không thành công
        const data = await response.json();
        if (!data.success) {
            console.error('Failed to fetch prerequisite course:', response.message);
            alert(i18next.t('alert.notPreCourse'));
            return false;
        }

        // Parse dữ liệu JSON
        

        // Kiểm tra nếu khóa học tồn tại
        return data.success; // Giả sử API trả về { exists: true/false }
    } catch (error) {
        console.error('Error fetching prerequisite course:', error);
        return false; // Giả định khóa học không tồn tại nếu có lỗi
    }
}
function formatDateWithTimezone(date) {
    const offset = -date.getTimezoneOffset(); // Lấy timezone offset (phút)
    const sign = offset >= 0 ? '+' : '-'; // Dấu (+/-) cho timezone
    const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0'); // Giờ
    const minutes = String(Math.abs(offset) % 60).padStart(2, '0'); // Phút

    // Định dạng ngày giờ: YYYY-MM-DD HH:mm:ss.SSS±TZD
    return date.toISOString().replace('T', ' ').replace('Z', '') + `${sign}${hours}:${minutes}`;
}
document.addEventListener('DOMContentLoaded', async () => {
    await window.i18nReady;
    loadFaculties();
});
// Example script to validate prerequisite course existence
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission for validation

    const validCredits = parseInt(document.getElementById('credits').value,10);
    if (isNaN(validCredits) || validCredits < 2) {
        alert(i18next.t('alert.notCredit'));
        return;
    }

    const date = new Date();
    
    const currentTime = formatDateWithTimezone(date);
    
    const course = {
        courseCode: document.getElementById('courseCode').value,
        courseName: document.getElementById('courseName').value,
        courseNameEn: document.getElementById('courseNameEn').value,
        credits: validCredits,
        faculty: document.getElementById('faculty').value,
        description: document.getElementById('description').value,
        descriptionEn: document.getElementById('descriptionEn').value,
        prerequisite: null,
        time_create:currentTime,
        
    };
    if (document.getElementById('prerequisite').value){
       const isvalid = validPrerequisite(document.getElementById('prerequisite').value);
       if (isvalid){
            course.prerequisite = document.getElementById('prerequisite').value;
        }else{
            return;
        }
    }
    console.log(course);
    fetch('/course/addCourse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(course)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(i18next.t('alert.addSuccCourse'));
            // Optionally, redirect or refresh the page
            document.querySelector('form').reset(); // Reset form after successful submission
        } else {
            alert(i18next.t('alert.addFaultCourse') +": " +data.message);
        }
    })
    .catch(error => {
        console.error('Error adding course:', error);
        alert(i18next.t('alert.addFaultCourse'));
    });

});