const { spawn } = require('child_process');
const path = require('path');

// Set a different port for testing to avoid conflicts
const TEST_PORT = 3001;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}/api`;

console.log('Starting backend server for smoke testing on port', TEST_PORT);

const server = spawn('node', [path.join(__dirname, '../src/app.js')], {
    env: { ...process.env, PORT: TEST_PORT, NODE_ENV: 'test' },
    cwd: path.join(__dirname, '../')
});

let serverOutput = '';
server.stdout.on('data', (data) => {
    serverOutput += data.toString();
});

server.stderr.on('data', (data) => {
    console.error('Server stderr:', data.toString());
});

// Wait for server to start
setTimeout(async () => {
    console.log('Server logs during startup:\n', serverOutput);
    
    let passed = true;
    try {
        console.log('--- Running Auth Smoke Tests ---');

        // Test 1: Health Check
        console.log('Testing GET /health...');
        const resHealth = await fetch(`http://127.0.0.1:${TEST_PORT}/api/health`);
        const jsonHealth = await resHealth.json();
        if (resHealth.status === 200 && jsonHealth.success) {
            console.log('✓ Health check passed');
        } else {
            throw new Error(`Health check failed: ${JSON.stringify(jsonHealth)}`);
        }

        // Test 2: Register Student
        console.log('Testing Student Registration...');
        const uniqueEmail = `student_${Date.now()}@test.com`;
        const resRegister = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Student',
                email: uniqueEmail,
                password: 'password123',
                nim: '123456789'
            })
        });
        const jsonRegister = await resRegister.json();
        if (resRegister.status === 201 && jsonRegister.success) {
            console.log('✓ Student registration passed');
        } else {
            throw new Error(`Registration failed: ${JSON.stringify(jsonRegister)}`);
        }

        // Test 3: Login Student
        console.log('Testing Student Login...');
        const resLogin = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: uniqueEmail,
                password: 'password123'
            })
        });
        const jsonLogin = await resLogin.json();
        let studentToken = '';
        if (resLogin.status === 200 && jsonLogin.success) {
            studentToken = jsonLogin.data.token;
            console.log('✓ Student login passed');
        } else {
            throw new Error(`Student login failed: ${JSON.stringify(jsonLogin)}`);
        }

        // Test 4: Access without token
        console.log('Testing Route protection (No Token)...');
        const resNoToken = await fetch(`${BASE_URL}/dashboard`);
        const jsonNoToken = await resNoToken.json();
        if (resNoToken.status === 401 && !jsonNoToken.success) {
            console.log('✓ Access blocked without token (401)');
        } else {
            throw new Error(`Expected 401 for no token, got: ${resNoToken.status}`);
        }

        // Test 5: Access with invalid token
        console.log('Testing Route protection (Invalid Token)...');
        const resInvalidToken = await fetch(`${BASE_URL}/dashboard`, {
            headers: { 'Authorization': 'Bearer invalidtoken123' }
        });
        const jsonInvalidToken = await resInvalidToken.json();
        if (resInvalidToken.status === 401 && !jsonInvalidToken.success) {
            console.log('✓ Access blocked with invalid token (401)');
        } else {
            throw new Error(`Expected 401 for invalid token, got: ${resInvalidToken.status}`);
        }

        // Test 6: Role Access - Student cannot create a book
        console.log('Testing Student Role Authorization (Post book)...');
        const resStudentCreateBook = await fetch(`${BASE_URL}/books`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${studentToken}`
            },
            body: JSON.stringify({
                title: 'Forbidden Book',
                author: 'Author'
            })
        });
        const jsonStudentCreateBook = await resStudentCreateBook.json();
        if (resStudentCreateBook.status === 403 && !jsonStudentCreateBook.success) {
            console.log('✓ Student blocked from admin route (403)');
        } else {
            throw new Error(`Expected 403 for student accessing admin route, got: ${resStudentCreateBook.status}`);
        }

        // Test 7: Admin Login
        console.log('Testing Admin Login...');
        const resAdminLogin = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@perpustakaan.com',
                password: 'admin'
            })
        });
        const jsonAdminLogin = await resAdminLogin.json();
        let adminToken = '';
        if (resAdminLogin.status === 200 && jsonAdminLogin.success) {
            adminToken = jsonAdminLogin.data.token;
            console.log('✓ Admin login passed');
        } else {
            throw new Error(`Admin login failed: ${JSON.stringify(jsonAdminLogin)}`);
        }

        // Test 8: Admin can access dashboard
        console.log('Testing Admin dashboard access...');
        const resAdminDash = await fetch(`${BASE_URL}/dashboard`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const jsonAdminDash = await resAdminDash.json();
        if (resAdminDash.status === 200 && jsonAdminDash.success) {
            console.log('✓ Admin dashboard metrics returned successfully');
        } else {
            throw new Error(`Admin dashboard failed: ${JSON.stringify(jsonAdminDash)}`);
        }

        console.log('\nAll Auth Smoke Tests PASSED successfully!');
    } catch (e) {
        console.error('\n❌ Auth Smoke Test FAILED:');
        console.error(e);
        passed = false;
    } finally {
        console.log('Stopping test backend server...');
        server.kill();
        process.exit(passed ? 0 : 1);
    }
}, 3000);
