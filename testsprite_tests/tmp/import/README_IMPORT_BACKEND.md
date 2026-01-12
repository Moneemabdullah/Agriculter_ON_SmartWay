Backend import instructions for Testsprite

1) Web UI
   - Sign in to Testsprite and open or create the project for this repository.
   - In the Test Plan / Test Cases area, choose Import (JSON) if available.
   - Upload `backend_testcases_testsprite_import.json` from `testsprite_tests/tmp/import/`.
   - Attach additional docs: `testsprite_tests/tmp/prd_files/readme.md`, `testsprite_tests/tmp/code_summary.json`, `Server/API_DOCUMENTATION.md`.

2) Manual creation
   - If import not supported, create Test Suites (Auth API, Users, Sensors, Telemetry, Error Handling) and add test cases following the JSON file.

3) Automated tests (optional)
   - If you want runnable integration tests, I can add Jest + Supertest tests in `Server/src/tests/` and add `supertest` as a dev dependency.
   - Tell me whether to proceed with that change and whether you want Dockerized DB for CI or an in-memory DB (mongodb-memory-server).

Notes
   - Ensure the Server is running (e.g., `npm run dev` in `Server/`) and environment variables for DB are configured before running tests.

If you want, I can now scaffold Jest+Supertest test files and add them to `Server/src/tests/` (will modify `package.json` devDependencies). Do you want me to proceed?