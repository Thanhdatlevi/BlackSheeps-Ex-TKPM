// Function to get all input field values and store them in an object
const CLASS_URL = '/classes'
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
    await window.i18nReady;
    
    const courseData = await getOptions(COURSE_URL);
    const template = Handlebars.compile(options_template('courses', 'course_id', 'course_name'));
    const html = template(courseData);
    document.getElementById('course_id').innerHTML += html;

    const yearData = await getOptions(YEAR_URL);
    const template2 = Handlebars.compile(options_template('terms', 'year', 'year'));
    console.log(options_template('terms', 'year', 'year'));
    const html2 = template2(yearData);
    document.getElementById('year').innerHTML += html2;

    const classData = await getOptions(CLASS_URL);
    const template3 = Handlebars.compile(options_template('classes', 'class_id', 'class_id'));
    console.log(options_template('classes', 'class', 'class'));
    const html3 = template3(classData);
    document.getElementById('class_id').innerHTML += html3;
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

    for (let e in formData){
        if (!formData[e] || formData[e] == ''){
            alert(i18next.t('alert.notFill'));
            return null
        }
    }

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
                alert(i18next.t('alert.addSuccStuToClass'));
                return res.json();
            }
            return res.json().then(text => {throw new Error(text.message)});
        });
    } catch (error) {
        console.error('Error submitting form data:', error.message);
        alert(`${i18next.t('alert.addFaultStuToClass')}:\n${error.message}`);
    }
}

