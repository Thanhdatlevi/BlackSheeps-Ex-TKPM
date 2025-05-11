document.addEventListener('DOMContentLoaded', async () => {
    await window.i18nReady;
});
const facultyForm = document.getElementById('facultyForm');
facultyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    fetch('/addFaculty', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(i18next.t('alert.addSucc'));
            } else {
                alert(i18next.t('alert.addFault'));
            }
            facultyForm.reset();
        });
});