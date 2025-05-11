document.addEventListener('DOMContentLoaded', async () => {
    await window.i18nReady;
});
const programForm = document.getElementById('programForm');
programForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    fetch('/addProgram', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name})
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(i18next.t('alert.addSucc'));
            } else {
                alert(i18next.t('alert.addFault'));
            }
            programForm.reset();
        });
});