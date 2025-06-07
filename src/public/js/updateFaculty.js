    document.addEventListener('DOMContentLoaded', async () => {
    await window.i18nReady;
});
const searchFacultyForm = document.getElementById('searchFacultyForm');
const updateFacultyForm = document.getElementById('updateFacultyForm');
const facultyName = document.getElementById('facultyName');

searchFacultyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchName = document.getElementById('searchName').value;
    console.log(searchName);
    fetch(`/faculty/searchFacultyByName?searchName=${searchName}`)
        .then(res => res.json())
        .then(data => {
            if (data.faculty) {
                console.log(data.faculty);
                facultyName.value = data.faculty[0].faculty_name;
            } else {
                alert(i18next.t('alert.noInfoStudent'));
            }
        });
});

updateFacultyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchName = document.getElementById('searchName').value;
    const facultyName = document.getElementById('facultyName').value;
    fetch('/faculty/updateFaculty', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            searchName,
            facultyName
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(i18next.t('alert.updateSucc'));
            } else {
                alert(i18next.t('alert.updateFault'));
            }
            searchFacultyForm.reset();
            updateFacultyForm.reset();
        });
});