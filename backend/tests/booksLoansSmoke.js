const { spawn } = require('child_process');
const path = require('path');

const TEST_PORT = 3002;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}/api`;

console.log('Starting backend server for book/loan smoke testing on port', TEST_PORT);

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

setTimeout(async () => {
    let passed = true;
    try {
        console.log('--- Running Books and Loans Smoke Tests ---');

        // 1. Admin Login
        console.log('Logging in as Admin...');
        const resAdminLogin = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@perpustakaan.com', password: 'admin' })
        });
        const jsonAdminLogin = await resAdminLogin.json();
        if (resAdminLogin.status !== 200 || !jsonAdminLogin.success) {
            throw new Error('Admin login failed');
        }
        const adminToken = jsonAdminLogin.data.token;
        console.log('✓ Admin login successful');

        // 2. Create Book
        console.log('Creating a new book...');
        const bookPayload = {
            title: 'Refactoring',
            author: 'Martin Fowler',
            category: 'Teknologi',
            isbn: '9780134757',
            publisher: 'Addison-Wesley',
            year: '2018',
            total: 3,
            description: 'Improving the design of existing code.'
        };
        const resCreateBook = await fetch(`${BASE_URL}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(bookPayload)
        });
        const jsonCreateBook = await resCreateBook.json();
        if (resCreateBook.status !== 201 || !jsonCreateBook.success) {
            throw new Error(`Create book failed: ${JSON.stringify(jsonCreateBook)}`);
        }
        const bookId = jsonCreateBook.data.id;
        console.log(`✓ Book created successfully, ID: ${bookId}`);

        // Verify stock is set correctly
        const resGetBook = await fetch(`${BASE_URL}/books/${bookId}`);
        const jsonGetBook = await resGetBook.json();
        if (jsonGetBook.data.total !== 3 || jsonGetBook.data.available !== 3) {
            throw new Error(`Initial stock mismatch: total=${jsonGetBook.data.total}, available=${jsonGetBook.data.available}`);
        }
        console.log('✓ Initial stock values validated (total: 3, available: 3)');

        // 3. Update Book
        console.log('Updating book details...');
        const resUpdateBook = await fetch(`${BASE_URL}/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                ...bookPayload,
                title: 'Refactoring (2nd Edition)',
                total: 5 // Stock increased to 5, available should become 5
            })
        });
        const jsonUpdateBook = await resUpdateBook.json();
        if (resUpdateBook.status !== 200 || !jsonUpdateBook.success) {
            throw new Error(`Update book failed: ${JSON.stringify(jsonUpdateBook)}`);
        }
        console.log('✓ Book updated successfully');

        const resGetUpdatedBook = await fetch(`${BASE_URL}/books/${bookId}`);
        const jsonGetUpdatedBook = await resGetUpdatedBook.json();
        if (jsonGetUpdatedBook.data.title !== 'Refactoring (2nd Edition)' || jsonGetUpdatedBook.data.available !== 5) {
            throw new Error(`Updated book mismatch: title="${jsonGetUpdatedBook.data.title}", available=${jsonGetUpdatedBook.data.available}`);
        }
        console.log('✓ Updated details and adjusted stock validated (available: 5)');

        // 4. Student Register & Login
        console.log('Registering a student...');
        const studentEmail = `student_bl_${Date.now()}@test.com`;
        const resRegister = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Catalog Student',
                email: studentEmail,
                password: 'password123',
                nim: '555555'
            })
        });
        if (resRegister.status !== 201) throw new Error('Student registration failed');

        const resStudentLogin = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: studentEmail, password: 'password123' })
        });
        const jsonStudentLogin = await resStudentLogin.json();
        const studentToken = jsonStudentLogin.data.token;
        console.log('✓ Student login successful');

        // 5. Request Loan
        console.log('Student requesting loan...');
        const resRequestLoan = await fetch(`${BASE_URL}/loans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${studentToken}`
            },
            body: JSON.stringify({ bookId })
        });
        const jsonRequestLoan = await resRequestLoan.json();
        if (resRequestLoan.status !== 201 || !jsonRequestLoan.success) {
            throw new Error(`Loan request failed: ${JSON.stringify(jsonRequestLoan)}`);
        }
        const loanId = jsonRequestLoan.data.id;
        console.log(`✓ Loan requested successfully, ID: ${loanId}`);

        // Verify status is waiting and stock is still 5
        const resGetLoanBefore = await fetch(`${BASE_URL}/loans/${loanId}`, {
            headers: { 'Authorization': `Bearer ${studentToken}` }
        });
        const jsonGetLoanBefore = await resGetLoanBefore.json();
        if (jsonGetLoanBefore.data.status !== 'waiting') {
            throw new Error(`Expected waiting status, got: ${jsonGetLoanBefore.data.status}`);
        }
        
        const resBookBeforeApprove = await fetch(`${BASE_URL}/books/${bookId}`);
        const jsonBookBeforeApprove = await resBookBeforeApprove.json();
        if (jsonBookBeforeApprove.data.available !== 5) {
            throw new Error(`Available stock should be 5, got: ${jsonBookBeforeApprove.data.available}`);
        }
        console.log('✓ Loan status is waiting and book availability is intact');

        // 6. Admin Approves Loan
        console.log('Admin approving loan...');
        const resApprove = await fetch(`${BASE_URL}/loans/${loanId}/approve`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (resApprove.status !== 200) {
            const errJson = await resApprove.json();
            throw new Error(`Approve loan failed: ${JSON.stringify(errJson)}`);
        }
        console.log('✓ Loan approved by Admin');

        // Verify status becomes active and stock decreases by 1
        const resGetLoanAfter = await fetch(`${BASE_URL}/loans/${loanId}`, {
            headers: { 'Authorization': `Bearer ${studentToken}` }
        });
        const jsonGetLoanAfter = await resGetLoanAfter.json();
        if (jsonGetLoanAfter.data.status !== 'active') {
            throw new Error(`Expected active status, got: ${jsonGetLoanAfter.data.status}`);
        }

        const resBookAfterApprove = await fetch(`${BASE_URL}/books/${bookId}`);
        const jsonBookAfterApprove = await resBookAfterApprove.json();
        if (jsonBookAfterApprove.data.available !== 4) {
            throw new Error(`Available stock should be 4, got: ${jsonBookAfterApprove.data.available}`);
        }
        console.log('✓ Loan status updated to active and book availability correctly decremented to 4');

        // 7. Student Extends Loan
        console.log('Student extending loan...');
        const resExtend = await fetch(`${BASE_URL}/loans/${loanId}/extend`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${studentToken}` }
        });
        if (resExtend.status !== 200) {
            const errJson = await resExtend.json();
            throw new Error(`Extend loan failed: ${JSON.stringify(errJson)}`);
        }
        console.log('✓ Loan extended successfully');

        // 8. Student Returns Book
        console.log('Student returning book...');
        const resReturn = await fetch(`${BASE_URL}/loans/${loanId}/return`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${studentToken}` }
        });
        if (resReturn.status !== 200) {
            const errJson = await resReturn.json();
            throw new Error(`Return book failed: ${JSON.stringify(errJson)}`);
        }
        console.log('✓ Book returned successfully');

        // Verify status is returned and stock goes back to 5
        const resGetLoanFinal = await fetch(`${BASE_URL}/loans/${loanId}`, {
            headers: { 'Authorization': `Bearer ${studentToken}` }
        });
        const jsonGetLoanFinal = await resGetLoanFinal.json();
        if (jsonGetLoanFinal.data.status !== 'returned' || !jsonGetLoanFinal.data.returnedAt) {
            throw new Error(`Expected returned status and populated returnedAt, got status: ${jsonGetLoanFinal.data.status}, returnedAt: ${jsonGetLoanFinal.data.returnedAt}`);
        }

        const resBookFinal = await fetch(`${BASE_URL}/books/${bookId}`);
        const jsonBookFinal = await resBookFinal.json();
        if (jsonBookFinal.data.available !== 5) {
            throw new Error(`Available stock should return to 5, got: ${jsonBookFinal.data.available}`);
        }
        console.log('✓ Loan status updated to returned, returnedAt populated, and stock incremented back to 5');

        // 9. Admin Delete Book
        console.log('Admin deleting book...');
        const resDelete = await fetch(`${BASE_URL}/books/${bookId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (resDelete.status !== 200) throw new Error('Delete book failed');
        console.log('✓ Book deleted successfully');

        console.log('\nAll Books and Loans Smoke Tests PASSED successfully!');
    } catch (e) {
        console.error('\n❌ Books and Loans Smoke Test FAILED:');
        console.error(e);
        passed = false;
    } finally {
        console.log('Stopping test backend server...');
        server.kill();
        process.exit(passed ? 0 : 1);
    }
}, 3000);
