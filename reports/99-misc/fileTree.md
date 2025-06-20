.
├── 2
├── app.js
├── fileTree.md
├── knexfile.js
├── lang
│   ├── en.json
│   └── vi.json
├── migrations
│   ├── 20250320042329_create_students_table.js
│   ├── 20250320073435_create_student_status_faculties_programs.js
│   ├── 20250320082550_create_identificationdocument.js
│   ├── 20250320091450_create_address_table.js
│   ├── 20250320093633_update_students_table.js
│   ├── 20250325070527_add_trigger_status_change_fault.js
│   ├── 20250327043317_create_allowed_email_domains.js
│   ├── 20250331144808_create_course_table.js
│   ├── 20250331151051_create_class_table.js
│   ├── 20250331154511_create_registerSubject_table.js
│   ├── 20250331155743_create_term_table.js
│   ├── 20250402095855_create_DeleteRegister_table.js
│   └── 20250515111035_add_en_fields_to_course.js
├── package.json
├── package-lock.json
├── README.md
├── reports
│   ├── Báo cáo THE BROKEN WINDOW THEORY & THE BOY SCOUT RULE.pdf
│   ├── Quy tắc lập trình.pdf
│   └── UnitTest_report.pdf
├── seeds
│   ├── seed_address.js
│   ├── seed_allowed_email_domains.js
│   ├── seed_classes.js
│   ├── seed_courses.js
│   ├── seed_identificationdocument.js
│   ├── seed_register_subjects.js
│   ├── seed_students_Ex1.js
│   ├── seed_students_Ex2.js
│   ├── seed_student_status_faculties_programs.js
│   ├── seed_terms.js
│   └── update_en_fields_in_course.js
├── src
│   ├── config
│   │   ├── db.js
│   │   ├── db_test.js
│   │   └── logging.js
│   ├── modules
│   │   ├── address
│   │   │   ├── addressController.js
│   │   │   ├── addressModel.js
│   │   │   └── addressService.js
│   │   ├── class
│   │   │   ├── classController.js
│   │   │   ├── class_controller.test.js
│   │   │   ├── classModel.js
│   │   │   ├── class_model.test.js
│   │   │   ├── classService.js
│   │   │   └── class.test.js
│   │   ├── course
│   │   │   ├── courseController.js
│   │   │   ├── courseModel.js
│   │   │   ├── courseService.js
│   │   │   └── course.test.js
│   │   ├── email
│   │   │   ├── emailController.js
│   │   │   ├── emailModel.js
│   │   │   └── emailService.js
│   │   ├── faculty
│   │   │   ├── facultyController.js
│   │   │   ├── facultyModel.js
│   │   │   └── facultyService.js
│   │   ├── grade
│   │   │   ├── gradeController.js
│   │   │   ├── gradeModel.js
│   │   │   ├── gradeService.js
│   │   │   └── test_exportGrade.test.js
│   │   ├── identification
│   │   │   ├── identificationController.js
│   │   │   ├── identificationModel.js
│   │   │   └── identificationService.js
│   │   ├── program
│   │   │   ├── programController.js
│   │   │   ├── programModel.js
│   │   │   └── programService.js
│   │   ├── registration
│   │   │   ├── registrationController.js
│   │   │   ├── registrationModel.js
│   │   │   ├── registrationService.js
│   │   │   └── test_deleteRegistration.test.js
│   │   ├── status
│   │   │   ├── statusController.js
│   │   │   ├── statusModel.js
│   │   │   └── statusService.js
│   │   └── student
│   │       ├── studentController.js
│   │       ├── student_controller_update.test.js
│   │       ├── studentModel.js
│   │       ├── student_model_update.test.js
│   │       ├── studentService.js
│   │       ├── test_addStudent.test.js
│   │       ├── test_deleteStudent.test.js
│   │       └── test_exportStudentList.test.js
│   ├── public
│   │   ├── css
│   │   │   └── input.css
│   │   └── js
│   │       ├── addClass.js
│   │       ├── addCourse.js
│   │       ├── addFaculty.js
│   │       ├── add.js
│   │       ├── addProgram.js
│   │       ├── addStatus.js
│   │       ├── addStudentClass.js
│   │       ├── configEmail.js
│   │       ├── delete.js
│   │       ├── deleteRegistration.js
│   │       ├── editCourse.js
│   │       ├── grade.js
│   │       ├── i18n-init.js
│   │       ├── search.js
│   │       ├── updateAnims.js
│   │       ├── updateFaculty.js
│   │       ├── update.js
│   │       ├── updateProgram.js
│   │       └── updateStatus.js
│   ├── routes
│   │   ├── classRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── emailDomainRoutes.js
│   │   ├── facultyRoutes.js
│   │   ├── gradeRoutes.js
│   │   ├── programRoutes.js
│   │   ├── registerSubjectRoutes.js
│   │   ├── statusRoutes.js
│   │   └── studentRoutes.js
│   └── views
│       ├── addCourse.hbs
│       ├── addFaculty.hbs
│       ├── add.hbs
│       ├── addProgram.hbs
│       ├── addStatus.hbs
│       ├── Classes
│       │   ├── AddClass.hbs
│       │   └── AddStudentClass.hbs
│       ├── configEmail.hbs
│       ├── delete.hbs
│       ├── deleteRegistration.hbs
│       ├── editCourse.hbs
│       ├── grade.hbs
│       ├── layouts
│       │   └── main.hbs
│       ├── partials
│       │   └── header.hbs
│       ├── search.hbs
│       ├── updateFaculty.hbs
│       ├── update.hbs
│       ├── updateProgram.hbs
│       └── updateStatus.hbs
├── studentDB.sqlite
├── tailwind.config.js
├── TestImportAndExport
│   ├── students.csv
│   └── students.xlsx
└── tree.txt

28 directories, 136 files
