const assert = require("assert/strict");
const test = require("node:test");
const { createServer, resetData } = require("./index");

function startTestServer() {
    return new Promise((resolve) => {
        resetData();
        const server = createServer();
        server.listen(0, "127.0.0.1", () => {
            const { port } = server.address();
            resolve({
                server,
                baseUrl: `http://127.0.0.1:${port}`
            });
        });
    });
}

async function request(baseUrl, path, options = {}) {
    const response = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });
    const body = await response.json();
    return { response, body };
}

test("backend exposes health and book catalog", async () => {
    const { server, baseUrl } = await startTestServer();
    try {
        const health = await request(baseUrl, "/api/health");
        assert.equal(health.response.status, 200);
        assert.equal(health.body.success, true);
        assert.equal(health.body.data.status, "ok");

        const books = await request(baseUrl, "/api/books?search=laskar");
        assert.equal(books.response.status, 200);
        assert.equal(books.body.data.length, 1);
        assert.equal(books.body.data[0].title, "Laskar Pelangi");
    } finally {
        server.close();
    }
});

test("student can request a book and admin can approve it", async () => {
    const { server, baseUrl } = await startTestServer();
    try {
        const studentLogin = await request(baseUrl, "/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email: "siswa@perpustakaan.com",
                password: "siswa123"
            })
        });
        assert.equal(studentLogin.response.status, 200);
        const studentToken = studentLogin.body.data.token;

        const requestLoan = await request(baseUrl, "/api/requests", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${studentToken}`
            },
            body: JSON.stringify({
                bookId: "atomic-habits"
            })
        });
        assert.equal(requestLoan.response.status, 201);
        assert.equal(requestLoan.body.data.status, "waiting");

        const adminLogin = await request(baseUrl, "/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email: "admin@perpustakaan.com",
                password: "admin123"
            })
        });
        assert.equal(adminLogin.response.status, 200);
        const adminToken = adminLogin.body.data.token;

        const approval = await request(baseUrl, `/api/requests/${requestLoan.body.data.id}/approve`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        });
        assert.equal(approval.response.status, 200);
        assert.equal(approval.body.data.request.status, "approved");
        assert.equal(approval.body.data.loan.bookId, "atomic-habits");

        const dashboard = await request(baseUrl, "/api/dashboard/admin", {
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        });
        assert.equal(dashboard.response.status, 200);
        assert.ok(dashboard.body.data.metrics.activeLoans >= 4);
    } finally {
        server.close();
    }
});
