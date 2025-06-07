document.addEventListener('DOMContentLoaded', async () => {
    await window.i18nReady;
});
const searchProgramForm = document.getElementById('searchProgramForm');
const updateProgramForm = document.getElementById('updateProgramForm');
const programName = document.getElementById('programName');

searchProgramForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchName = document.getElementById('searchName').value;
    console.log(searchName);
    fetch(`/program/searchProgramByName?searchName=${searchName}`)
        .then(res => res.json())
        .then(data => {
            if (data.program) {
                console.log(data.program);
                console.log(data.program.program_name);
                programName.value = data.program.program_name;
            } else {
                alert(i18next.t('alert.noInfoStudent'));
            }
        });
});

updateProgramForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchName = document.getElementById('searchName').value;
    const programName = document.getElementById('programName').value;
    fetch('/program/updateProgram', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            searchName,
            programName
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(i18next.t('alert.updateSucc'));
            } else {
                alert(i18next.t('alert.updateFault'));
            }
            searchProgramForm.reset();
            updateProgramForm.reset();
        });
});