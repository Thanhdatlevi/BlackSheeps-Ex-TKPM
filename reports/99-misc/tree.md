.
├── app.js
├── knexfile.js
├── package.json
├── package-lock.json
├── README.md
├── tailwind.config.js
├── studentDB.sqlite
├── fileTree.md
├── tree.txt
│
├── lang/                             # i18n translations
│   ├── en.json
│   └── vi.json
│
├── migrations/                       # Knex migration scripts
│   ├── 20250320042329_create_students_table.js
│   ├── ...
│   └── 20250515111035_add_en_fields_to_course.js
│
├── seeds/                            # Knex seed scripts
│   ├── seed_address.js
│   ├── ...
│   └── update_en_fields_in_course.js
│
├── reports/                          # Documentation & reports
│   ├── Báo cáo THE BROKEN WINDOW THEORY & THE BOY SCOUT RULE.pdf
│   ├── Quy tắc lập trình.pdf
│   └── UnitTest_report.pdf
│
├── TestImportAndExport/             # Data files for import/export
│   ├── students.csv
│   └── students.xlsx
│
├── src/
│   ├── config/                       # Configuration (db, logging, etc.)
│   │   ├── db.js
│   │   ├── db_test.js
│   │   └── logging.js
│
│   ├── modules/                      # Feature-based modules (MVC)
│   │   ├── address/
│   │   ├── class/
│   │   ├── course/
│   │   ├── ...
│   │   └── student/
│   │       ├── studentController.js
│   │       ├── studentModel.js
│   │       ├── studentService.js
│   │       ├── ...
│   │       └── test_exportStudentList.test.js
│
│   ├── public/                       # Static frontend assets
│   │   ├── css/
│   │   │   └── input.css
│   │   └── js/
│   │       ├── add.js
│   │       ├── update.js
│   │       ├── ...
│   │       └── updateStatus.js
│
│   ├── routes/                       # Express route definitions
│   │   ├── classRoutes.js
│   │   ├── ...
│   │   └── studentRoutes.js
│
│   └── views/                        # Handlebars templates
│       ├── layouts/
│       │   └── main.hbs
│       ├── partials/
│       │   └── header.hbs
│       ├── Classes/
│       │   ├── AddClass.hbs
│       │   └── AddStudentClass.hbs
│       ├── add.hbs
│       ├── ...
│       └── updateStatus.hbs
 
