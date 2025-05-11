document.addEventListener('DOMContentLoaded', async () => {
    await window.i18nReady;
});
const searchStatusForm = document.getElementById('searchStatusForm');
const updateStatusForm = document.getElementById('updateStatusForm');
const statusName = document.getElementById('statusName');

searchStatusForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchName = document.getElementById('searchName').value;
    console.log("searchName: ",searchName);
    fetch(`/searchStatusByName?searchName=${searchName}`)
        .then(res => res.json())
        .then(data => {
            if (data.status) {
                console.log("data: ",data.status);
                console.log("data: ",data.status.status_name);
                statusName.value = data.status.status_name;
            } else {
                alert(i18next.t('alert.noInfoStudent'));
            }
        });
});

updateStatusForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchName = document.getElementById('searchName').value;
    const statusName = document.getElementById('statusName').value;
    fetch('/updateStatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            searchName,
            statusName
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(i18next.t('alert.updateSucc'));
            } else {
                alert(i18next.t('alert.updateFault'));
            }
            searchStatusForm.reset();
            updateStatusForm.reset();
        });
});