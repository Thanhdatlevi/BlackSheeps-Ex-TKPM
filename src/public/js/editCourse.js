function formatDateWithTimezone(date) {
    const offset = -date.getTimezoneOffset(); // Lấy timezone offset (phút)
    const sign = offset >= 0 ? '+' : '-'; // Dấu (+/-) cho timezone
    const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0'); // Giờ
    const minutes = String(Math.abs(offset) % 60).padStart(2, '0'); // Phút

    // Định dạng ngày giờ: YYYY-MM-DD HH:mm:ss.SSS±TZD
    return date.toISOString().replace('T', ' ').replace('Z', '') + `${sign}${hours}:${minutes}`;
}
let courses = [];
let departments = [];

// Tải danh sách khóa học và khoa phụ trách khi trang được load
document.addEventListener('DOMContentLoaded', async function () {
    await window.i18nReady;
    loadCourses();
    loadDepartments();

    // Xử lý form chỉnh sửa khóa học
    document.getElementById('editCourseForm').addEventListener('submit', function (e) {
        e.preventDefault();
        updateCourse();
    });
});

// Tải danh sách khóa học từ API
async function loadCourses() {
    try {
        const response = await fetch('/getAllCourses');
        const data = await response.json();
        if (data.success && data.courses) {
            courses = data.courses;
            
            renderCourseTable();
        } else {
            console.error('Failed to load courses:', data.message);
        }
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

// Tải danh sách khoa phụ trách từ API
async function loadDepartments() {
    try {
        const response = await fetch('/faculties');
        const data = await response.json();
        if (data.success && data.faculties) {
            departments = data.faculties;
            
            renderDepartmentOptions();
        } else {
            console.error('Failed to load departments:', data.message);
        }
    } catch (error) {
        console.error('Error loading departments:', error);
    }
}

// Hiển thị danh sách khóa học trong bảng
function renderCourseTable() {
    console.log("renderCourseTable called");
    const tableBody = document.getElementById('courseTableBody');
    tableBody.innerHTML = '';
    courses.forEach((course, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-2 px-4 border-b">${course.course_id}</td>
            <td class="py-2 px-4 border-b">${course.course_name}</td>
            <td class="py-2 px-4 border-b">${course.faculty_name}</td>
            <td class="py-2 px-4 border-b">${course.status}</td>
            <td class="py-2 px-4 border-b text-center">
                <button onclick="openEditModal('${course.course_id}')" 
                        class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded mr-2">
                    Sửa
                </button>
                <button onclick="deleteCourse('${course.course_id}', '${course.time_create}')" 
                        class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">
                    Xóa
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Hiển thị danh sách khoa phụ trách trong dropdown
function renderDepartmentOptions() {
    const departmentSelect = document.getElementById('editDepartment');
    departmentSelect.innerHTML = '';
    departments.forEach(department => {
        const option = document.createElement('option');
        option.value = department.faculty_id;
        option.textContent = department.faculty_name;
        departmentSelect.appendChild(option);
    });
}

// Mở modal chỉnh sửa khóa học
async function openEditModal(courseId) {
try {
    // Gửi yêu cầu kiểm tra xem khóa học có tồn tại trong bảng class không
    const response = await fetch(`/isCourseNameExists?courseId=${courseId}`);

    const data = await response.json();

    // Tìm khóa học trong danh sách courses
    const course = courses.find(c => c.course_id === courseId);
    if (course) {
        // Điền thông tin khóa học vào modal
        document.getElementById('editCourseId').value = course.course_id;
        document.getElementById('editCourseName').value = course.course_name;
        document.getElementById('editDescription').value = course.description;
        document.getElementById('editDepartment').value = course.faculty;
        document.getElementById('editCredit').value = course.credit;

        // Kiểm tra kết quả từ API
        if (data.exists) {
            // Nếu khóa học tồn tại trong bảng class, ẩn phần sửa tín chỉ
            document.getElementById('editCredit').parentElement.style.display = 'none';
        } else {
            // Nếu không tồn tại, hiển thị phần sửa tín chỉ
            document.getElementById('editCredit').parentElement.style.display = 'block';
        }

        // Hiển thị modal
        document.getElementById('editModal').classList.remove('hidden');
        document.getElementById('editModal').classList.add('flex');
    }
} catch (error) {
    console.error('Error checking course existence in class:', error);
    alert(i18next.t('alert.error'));
}
}

// Đóng modal chỉnh sửa
function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    document.getElementById('editModal').classList.remove('flex');
}

// Cập nhật khóa học
async function updateCourse() {
    const id = document.getElementById('editCourseId').value;
    const courseName = document.getElementById('editCourseName').value.trim();
    const description = document.getElementById('editDescription').value.trim();
    const faculty = document.getElementById('editDepartment').value;
    const credit = document.getElementById('editCredit').value.trim();
    const validCredits = parseInt(document.getElementById('editCredit').value,10);
    if (isNaN(validCredits) || validCredits < 2) {
        alert(i18next.t('alert.notCredit'));
        return;
    }
    if (!courseName || !description || !faculty) {
        alert(i18next.t('alert.notFill'));
        return;
    }

    try {
        const response = await fetch(`/updateCourse`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id ,courseName, description, faculty, credit })
        });
        const data = await response.json();
        if (data.success) {
            await loadCourses();
            const index = courses.findIndex(c => c.course_id == id);
            if (index !== -1) {
                courses[index] = { ...courses[index], courseName, description, faculty };
            }
            
            renderCourseTable();
            closeEditModal();
            alert(i18next.t('alert.updateSuccCourse'));
        } else {
            alert('Error: ' + (data.message || i18next.t('alert.updateFaultCourse')));
        }
    } catch (error) {
        console.error('Error updating course:', error);
    }
}

// Xóa khóa học
async function deleteCourse(courseId, timeCreate) {
    const reponse = await fetch(`/isCourseNameExists?courseId=${courseId}`);
    const data = await reponse.json();
    const createdTime = new Date(timeCreate);
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() - 7); // Giờ Việt Nam UTC+7
    const diffMinutes = (currentTime - createdTime) / (1000 * 60);
    if (diffMinutes <= 30) {
        if (!data.exists) {
            if (confirm(i18next.t('alert.suredDeleteStudent'))) {
            try {
                const response = await fetch(`/deleteCourse`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ courseId: courseId })
        });
                const data = await response.json();
                if (data.success) {
                    await loadCourses();
                    courses = courses.filter(c => c.course_id != courseId);
                    renderCourseTable();
                    alert(i18next.t('alert.deleteSuccCourse'));
                } else {
                    alert('Lỗi: ' + (data.message || i18next.t('alert.deleteFaultCourse')));
                }
            } catch (error) {
                console.error('Error deleting course:', error);
            }
        }
        }
        else {
            if (confirm(i18next.t('alert.DeactivateCourse'))) {
            try {
                const response = await fetch(`/updateCourseStatus`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ courseId: courseId,
                status: 'Deactivated' })
        });
                const data = await response.json();
                if (data.success) {
                    await loadCourses();
                    const index = courses.findIndex(c => c.id == courseId);
                    if (index !== -1) {
                        courses[index].status = 'Deactivated';
                    }
                    renderCourseTable();
                    alert(i18next.t('alert.DeactivateSuccCourse'));
                } else {
                    alert('Lỗi: ' + (data.message || i18next.t('alert.DeactivateFaultCourse')));
                }
            } catch (error) {
                console.error('Error deactivating course:', error);
            }
        }
        }
    } else {
            alert(i18next.t('alert.cantDeleteCourse'));
        }
}