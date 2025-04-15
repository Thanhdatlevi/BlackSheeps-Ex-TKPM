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
    const template2 = Handlebars.compile(options_template('terms', 'year', 'year'));
    console.log(options_template('terms', 'year', 'year'));
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
    inputs.forEach(input => {
        formData[input.name] = input.value;
    });
    return formData;
}
window.submitFormData = async () => {
    const formData = await getInputValues();
    console.log(formData);

    studentList = [{
        student_id: formData['student_id'],
        grade: formData['grade'],
    }];

    classObject = {};
    for (let e in formData) {
        if (e == 'student_id' || e == 'grade') {
            continue;
        }
        classObject[e] = formData[e];
    }

    try {
        const response = await fetch('/class/student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentList: studentList,
                classObject: classObject,
            })
        }).then(res => {
            if (res.ok) {
                console.log('Form data submitted successfully!');
                alert(`Thêm học sinh vào lớp học thành công`);
            }
            return res.json().then(text => {throw new Error(text.message)});
        });
    } catch (error) {
        console.error('Error submitting form data:', error.message);
        alert(`Lỗi khi thêm học sinh vào lớp học:\n${error.message}`);
    }
}

