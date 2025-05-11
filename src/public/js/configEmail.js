// Danh sách domains - sẽ được thay thế bằng dữ liệu từ API
let domains = [];

// Tải danh sách domains khi trang được load
document.addEventListener('DOMContentLoaded', async function() {
    // Wait for i18next to be ready
    await window.i18nReady;
    
    loadDomains();

    // Xử lý form thêm domain
    document.getElementById('addDomainForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addDomain();
    });

    // Xử lý form edit domain
    document.getElementById('editDomainForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateDomain();
    });
    
    
});

// Tải danh sách domains từ API
async function loadDomains() {
    try {
        const response = await fetch('/emails');
        const data = await response.json();
        console.log(data);
        if (data.success && data.domains) {
            domains = data.domains;
            renderDomainTable();
        } else {
            console.error('Failed to load domains:', data.message);
            // mock data
            domains = [
                { id: 1, domain: "gmail.com" },
                { id: 2, domain: "outlook.com" },
                { id: 3, domain: "yahoo.com" },
                { id: 4, domain: "student.hcmus.edu.vn" }
            ];
            renderDomainTable();
        }
    } catch (error) {
        console.error('Error loading domains:', error);
        // mock data
        domains = [
            { id: 1, domain: "gmail.com" },
            { id: 2, domain: "outlook.com" },
            { id: 3, domain: "yahoo.com" },
            { id: 4, domain: "student.hcmus.edu.vn" }
        ];
        renderDomainTable();
    }
}

// Hiển thị danh sách domains trong bảng
function renderDomainTable() {
    const tableBody = document.getElementById('domainTableBody');
    tableBody.innerHTML = '';
    domains.forEach((domain, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-2 px-4 border-b">${index + 1}</td>
            <td class="py-2 px-4 border-b">${domain.email_domain}</td>
            <td class="py-2 px-4 border-b text-center">
                <button onclick="openEditModal(${domain.email_id}, '${domain.email_domain}')" 
                        class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded mr-2">
                    ${i18next.t('EMAIL.editButton')}
                </button>
                <button onclick="deleteDomain(${domain.email_id})" 
                        class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">
                    ${i18next.t('EMAIL.deleteButton')}
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Thêm domain mới
async function addDomain() {
    const domainInput = document.getElementById('newDomain');
    const domainName = domainInput.value.trim();
    
    if (!domainName) {
        alert(i18next.t('EMAIL.domainRequired'));
        return;
    }

    try {
        const response = await fetch('/addEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ domain: domainName })
        });

        const data = await response.json();
        console.log(data);
        if (data.success) {
            // Thêm domain mới vào danh sách và hiển thị lại
            const newId = data.email.email_id || domains.length + 1;
            domains.push({ email_id: newId, email_domain: domainName });
            renderDomainTable();
            domainInput.value = '';
            alert(i18next.t('alert.addEmailSuccess'));
        } else {
            alert(i18next.t('alert.addEmailError') + ': ' + (data.message || i18next.t('alert.generalEmailError')));
        }
    } catch (error) {
        console.error('Error adding domain:', error);
        alert(i18next.t('alert.generalEmailError'));
    }
}

// Mở modal chỉnh sửa domain
function openEditModal(id, domainName) {
    document.getElementById('editDomainId').value = id;
    document.getElementById('editDomainName').value = domainName;
    document.getElementById('editModal').classList.remove('hidden');
    document.getElementById('editModal').classList.add('flex');
}

// Đóng modal chỉnh sửa
function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    document.getElementById('editModal').classList.remove('flex');
}

// Cập nhật domain
async function updateDomain() {
    const id = document.getElementById('editDomainId').value;
    const newDomainName = document.getElementById('editDomainName').value.trim();
    
    if (!newDomainName) {
        alert(i18next.t('EMAIL.domainRequired'));
        return;
    }

    try {
        const response = await fetch(`/updateEmail`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email_id : id, email_domain: newDomainName })
        });
        const data = await response.json();
        console.log(data);
        if (data.success) {
            // Cập nhật domain trong danh sách và hiển thị lại
            const index = domains.findIndex(d => d.email_id == id);
            console.log("index:",index);
            if (index !== -1) {
                domains[index].email_domain = newDomainName;
            }
            console.log("domain:",domains);
            renderDomainTable();
            closeEditModal();
            alert(i18next.t('alert.updateEmailSuccess'));
        } else {
            alert(i18next.t('alert.updateEmailError') + ': ' + (data.message || i18next.t('alert.generalEmailError')));
        }
    } catch (error) {
        console.error('Error updating domain:', error);
        alert(i18next.t('alert.generalEmailError'));
    }
}

// Xóa domain
async function deleteDomain(id) {
    if (!confirm(i18next.t('alert.confirmDeleteEmail'))) {
        return;
    }

    try {
        const response = await fetch(`/deleteEmail`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email_id: id })
        });

        const data = await response.json();
        
        if (data.success) {
            // Xóa domain khỏi danh sách và hiển thị lại
            domains = domains.filter(d => d.email_id != id);
            renderDomainTable();
            alert(i18next.t('alert.deleteEmailSucc'));
        } else {
            alert(i18next.t('alert.deleteEmailFault') + ': ' + (data.message || i18next.t('alert.generalEmailError')));
        }
    } catch (error) {
        console.error('Error deleting domain:', error);
        alert(i18next.t('alert.generalEmailError'));
    }
}