// Function to get all input field values and store them in an object
const COURSE_URL = '/class/courses';
const YEAR_URL = '/class/year';

const options_template = (obj, prop1, prop2) => {
    return `
    {{#each ${obj}}}
        <option value="{{this.${prop1}}}">{{this.${prop2}}}</option>
    {{/each}}
    `;
}
document.addEventListener('DOMContentLoaded', async () => {
    const courseData = await getOptions(COURSE_URL);
    const template = Handlebars.compile(options_template('courses', 'course_id', 'course_name'));
    const html = template(courseData);
    document.getElementById('course_id').innerHTML += html;

    const yearData = await getOptions(YEAR_URL);
    const template2 = Handlebars.compile(options_template('terms','year','year'));
    console.log(options_template('terms','year','year'));
    const html2 = template2(yearData);
    document.getElementById('year').innerHTML += html2;
});
async function getOptions(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const formData = await response.json();
        if (response.ok) {
            // return data;
            console.log(formData);
            return formData;
        } else {
            console.error('Failed to fetch courses:', response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
        return [];
    }
}
async function getInputValues() {
    const inputs = document.querySelectorAll('#info_window input, #info_window select');
    const formData = {};
    formData[`schedule`] = {};
    formData[`time`] = {};
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            formData[`schedule`][input.name] = input.checked;
        }
        else if (input.type === 'time') {
            formData[`time`][input.name] = input.value;
        }
        else {
            formData[input.name] = input.value;
        }
    });
    return formData;
}
window.submitFormData = async () => {
    const formData = await getInputValues();

    let result = '';
    for (let day in formData.schedule) {
        if (formData.schedule[day]) {
            if (result !== '') result += '-';
            result += day;
        }
    }
    formData.schedule = result;

    result = '';
    for (let time in formData.time) {
        if (formData.time[time]) {
            if (result !== '') result += '-';
            result += formData.time[time];
        }
    }
    formData.schedule += ' ' + result;

    delete formData.time;

    console.log(formData);

    try {
        const response = await fetch('/class', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        if (response.status == 200) {
            console.log('Form data submitted successfully!');
            // Optionally, you can redirect or show a success message
        } else {
            console.error('Failed to submit form data:', response.statusText);
            alert(`Lỗi khi thêm lớp học: ${response.message}`);
        }
    } catch (error) {
        console.error('Error submitting form data:', error);
        alert('Lỗi khi thêm lớp học');
    }
}

