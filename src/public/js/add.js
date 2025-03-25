let allowedDomains = [];
document.addEventListener('DOMContentLoaded', function() {
    // Load dữ liệu từ database cho các dropdown
    loadFaculties();
    loadPrograms();
    loadStatuses();
    loadAllowedDomains();

    // Thêm event listener cho input email
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', function() {
        // Clear error when user starts typing
        const emailError = document.getElementById('emailError');
        emailError.classList.add('hidden');
        this.classList.remove('border-red-500');
    });

    // Xử lý khi chọn loại giấy tờ
    const idTypeSelect = document.getElementById('id_type');
    idTypeSelect.addEventListener('change', function() {
        toggleIdFields(this.value);
    });

    // Xử lý khi chọn loại địa chỉ nhận thư
    const mailingAddressTypeSelect = document.getElementById('mailing_address_type');
    mailingAddressTypeSelect.addEventListener('change', function() {
        toggleMailingAddress(this.value);
    });

    // Xử lý khi check "Giống địa chỉ thường trú"
    const sameAsPermanentCheckbox = document.getElementById('same_as_permanent');
    sameAsPermanentCheckbox.addEventListener('change', function() {
        if (this.checked) {
            copyPermanentAddress();
        } else {
            clearTemporaryAddress();
        }
    });
     
    // Form validation và submit
    document.getElementById("studentForm").addEventListener("submit", addStudent);
});
async function loadAllowedDomains() {
    try {
        const response = await fetch('/emails');
        const data = await response.json();
        console.log("API response:", data);
        if (data.domains) {
            allowedDomains = data.domains.map(d => d.email_domain);
        }
    } catch (error) {
        console.error('Error loading allowed domains:', error);
    }
}
// Functions to load dropdown data
async function loadFaculties() {
    try {
        const response = await fetch('/faculties');
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
            const validDepartments = ["Khoa Luật", "Khoa Tiếng Anh thương mại", "Khoa Tiếng Nhật", "Khoa Tiếng Pháp"];
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
        const validDepartments = ["Khoa Luật", "Khoa Tiếng Anh thương mại", "Khoa Tiếng Nhật", "Khoa Tiếng Pháp"];
        const facultySelect = document.getElementById('faculty');
        validDepartments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept;
            option.textContent = dept;
            facultySelect.appendChild(option);
        });
    }
}

async function loadPrograms() {
    try {
        const response = await fetch('/programs');
        const data = await response.json();
        const programSelect = document.getElementById('program');
        console.log("API response:", data);
        if (data.programs && data.programs.length > 0) {
            data.programs.forEach(program => {
                const option = document.createElement('option');
                option.value = program.program_id;
                option.textContent = program.program_name;
                programSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading programs:', error);
        // Fallback với một số chương trình mặc định
        const defaultPrograms = ["Cử nhân", "Kỹ sư", "Cao học"];
        const programSelect = document.getElementById('program');
        defaultPrograms.forEach(prog => {
            const option = document.createElement('option');
            option.value = prog;
            option.textContent = prog;
            programSelect.appendChild(option);
        });
    }
}

async function loadStatuses() {
    try {
        const response = await fetch('/statuses');
        const data = await response.json();
        console.log("API response:", data);
        const statusSelect = document.getElementById('status');
        
        if (data.status && data.status.length > 0) {
            data.status.forEach(status => {
                console.log("Status object:", status); // Kiểm tra từng đối tượng status
                const option = document.createElement('option');
                option.value = status.status_id;
                option.textContent = status.status_name;
                statusSelect.appendChild(option);
            });
        } else {
            // Fallback nếu không lấy được dữ liệu từ API
            const validStatuses = ["Đang học", "Đã tốt nghiệp", "Đã thôi học", "Tạm dừng học"];
            validStatuses.forEach(status => {
                const option = document.createElement('option');
                option.value = status;
                option.textContent = status;
                statusSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading statuses:', error);
        // Fallback khi có lỗi
        const validStatuses = ["Đang học", "Đã tốt nghiệp", "Đã thôi học", "Tạm dừng học"];
        const statusSelect = document.getElementById('status');
        validStatuses.forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            statusSelect.appendChild(option);
        });
    }
}
// Hàm validate email
function validateEmail() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    emailError.classList.add('hidden');
    emailInput.classList.remove('border-red-500');
    if (!email) return; // Bỏ qua nếu email trống

    if (!emailRegex.test(email)) {
        showEmailError("Email không đúng định dạng!");
        return false;
    }

    // Kiểm tra domain
    const domain = email.split('@')[1];
    if (!allowedDomains.includes(domain)) {
        showEmailError("Domain email không được phép sử dụng!");
        return false;
    }

    return true;
}
function showEmailError(message) {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    
    emailError.textContent = message;
    emailError.classList.remove('hidden');
    emailInput.classList.add('border-red-500');
}
// Toggle ID fields based on selection
function toggleIdFields(idType) {
    // Hide all ID fields first
    document.getElementById('cmnd_fields').classList.add('hidden');
    document.getElementById('cccd_fields').classList.add('hidden');
    document.getElementById('passport_fields').classList.add('hidden');
    
    // Show selected ID fields
    if (idType === 'cmnd') {
        document.getElementById('cmnd_fields').classList.remove('hidden');
    } else if (idType === 'cccd') {
        document.getElementById('cccd_fields').classList.remove('hidden');
    } else if (idType === 'passport') {
        document.getElementById('passport_fields').classList.remove('hidden');
    }
}

// Toggle mailing address fields
function toggleMailingAddress(type) {
    const otherMailingAddressDiv = document.getElementById('other_mailing_address');
    if (type === 'other') {
        otherMailingAddressDiv.classList.remove('hidden');
    } else {
        otherMailingAddressDiv.classList.add('hidden');
    }
}

// Copy permanent address to temporary address
function copyPermanentAddress() {
    document.getElementById('temporary_street').value = document.getElementById('permanent_street').value;
    document.getElementById('temporary_ward').value = document.getElementById('permanent_ward').value;
    document.getElementById('temporary_district').value = document.getElementById('permanent_district').value;
    document.getElementById('temporary_city').value = document.getElementById('permanent_city').value;
    document.getElementById('temporary_country').value = document.getElementById('permanent_country').value;
}

// Clear temporary address fields
function clearTemporaryAddress() {
    document.getElementById('temporary_street').value = '';
    document.getElementById('temporary_ward').value = '';
    document.getElementById('temporary_district').value = '';
    document.getElementById('temporary_city').value = '';
    document.getElementById('temporary_country').value = 'Việt Nam';
}

// Form validation and submission
async function addStudent(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Validate email
    if (!validateEmail()) {
        return;
    }

    // Validate phone
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(data.phone)) {
        alert("Số điện thoại không hợp lệ!");
        return;
    }

    // Validate faculty
    const validDepartments = ["Khoa Luật", "Khoa Tiếng Anh thương mại", "Khoa Tiếng Nhật", "Khoa Tiếng Pháp"];
    if (data.faculty === "") {
        alert("Vui lòng chọn khoa!");
        return;
    }

    // Validate status
    const validStatuses = ["Đang học", "Đã tốt nghiệp", "Đã thôi học", "Tạm dừng học"];
    if (data.status === "") {
        alert("Vui lòng chọn tình trạng sinh viên!");
        return;
    }

    // Validate ID document
    if (data.id_type === "") {
        alert("Vui lòng chọn loại giấy tờ tùy thân!");
        return;
    }

    // Prepare the data for address
    const studentData = {
        ...data,
        permanent_address: {
            student_id: data.mssv,
            addresstype: 'thuongtru',
            street: data.permanent_street,
            ward: data.permanent_ward,
            district: data.permanent_district,
            city: data.permanent_city,
            country: data.permanent_country
        },
        temporary_address: null
    };

    // Add temporary address if provided
    if (data.temporary_street) {
        studentData.temporary_address = {
            student_id: data.mssv,
            addresstype: 'tamtru',
            street: data.temporary_street,
            ward: data.temporary_ward,
            district: data.temporary_district,
            city: data.temporary_city,
            country: data.temporary_country
        };
    }

    // Set mailing address based on selection
    if (data.mailing_address_type === 'permanent') {
        studentData.mailing_address = studentData.permanent_address;
    } else if (data.mailing_address_type === 'temporary') {
        studentData.mailing_address = studentData.temporary_address || studentData.permanent_address;
    } else if (data.mailing_address_type === 'other' && data.mailing_street) {
        studentData.mailing_address = {
            street: data.mailing_street,
            ward: data.mailing_ward,
            district: data.mailing_district,
            city: data.mailing_city,
            country: data.mailing_country
        };
    } else {
        studentData.mailing_address = studentData.permanent_address;
    }

    // Prepare ID document data
    if (data.id_type === 'cmnd') {
        studentData.id_document = {
            student_id: data.mssv,
            type: 'CMND',
            number: data.cmnd_number,
            issue_date: data.cmnd_issue_date,
            issue_place: data.cmnd_issue_place,
            expiry_date: data.cmnd_expiry_date
        };
    } else if (data.id_type === 'cccd') {
        studentData.id_document = {
            student_id: data.mssv,
            type: 'CCCD',
            number: data.cccd_number,
            issue_date: data.cccd_issue_date,
            issue_place: data.cccd_issue_place,
            expiry_date: data.cccd_expiry_date,
            has_chip: data.cccd_has_chip ? true : false
        };
    } else if (data.id_type === 'passport') {
        studentData.id_document = {
            student_id: data.mssv,
            type: 'passport',
            number: data.passport_number,
            issue_date: data.passport_issue_date,
            issue_place: data.passport_issue_place,
            expiry_date: data.passport_expiry_date,
            issue_country: data.passport_issue_country,
            notes: data.passport_notes
        };
    }

    try {
        console.log("Gửi form:", studentData);
        const response = await fetch(form.action, {
            method: form.method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentData)
        });

        const result = await response.json();
        const responseAdress = await fetch('/add-address', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentData.permanent_address)
        });    
        if (studentData.temporary_address) {
            const responseAdress = await fetch('/add-address', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(studentData.temporary_address)
            });
        }
        const responseIdentification = await fetch('/add-identification', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentData.id_document)
        });
        if (response.ok && responseAdress.ok && responseIdentification.ok) {
            alert(result.message || "Thêm sinh viên thành công!"); 
            form.reset();
            
            // Reset form và ẩn các trường
            document.getElementById('cmnd_fields').classList.add('hidden');
            document.getElementById('cccd_fields').classList.add('hidden');
            document.getElementById('passport_fields').classList.add('hidden');
            document.getElementById('other_mailing_address').classList.add('hidden');
            
            console.log("Form đã reset");
        } else {
            alert(result.message || "Thêm sinh viên thất bại!"); 
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