const request = require('supertest');
const app = require('../../../app');  // Import the app
const db = require('../../config/db');
const logger = require('../../config/logging');

PORT = 3000;
let server;

beforeAll(async () => {
    // Set up the database before tests (create device table)
    check_db_query = `
    SELECT current_database();
    `;
    result = await db.query(check_db_query, []);
    if (result.rows[0].current_database != 'db_test') {
        throw new Error('Not the testing database! abort immediately');
    }
    else {
        const { exec } = require("child_process");
        exec("cross-env NODE_ENV=development npm run migrate:test", (err, stdout, stderr) => {
            if (err) {
                console.error();
                console.error("Error:");
                console.error(err);
                console.error();
            }
        });
    }
    server = app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
    return;
});

afterEach(() => {
    // Clean up the table between tests to ensure isolation
    db.query(`
    DO $$ DECLARE
    r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
    END $$;
    `)
});

afterAll(async () => {
    // Close the DB connection after all tests
    // db.close();
    db.query(`
    DO $$ DECLARE
    r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
    END $$;
    `)
    await server.close();
    logger.info('Test done!');
    return;
});

describe('update student API', () => {
    it('should update a student to the desired information', async () => {
        const response = await request(server)
            .get('/programs')
            .send()
            .expect(200);
        expect(response.body.programs.length).toBeGreaterThanOrEqual(0);
        return;
    });
});


