# Perpustakaan Digital - Backend API

Sistem backend untuk aplikasi Perpustakaan Digital dengan Express + MySQL.

## Struktur Proyek

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MySQL connection pool
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── validate.js          # Joi validation
│   │   └── errorHandler.js      # Error handling
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication endpoints
│   │   ├── bookRoutes.js        # Book CRUD endpoints
│   │   ├── loanRoutes.js        # Loan management endpoints
│   │   ├── dashboardRoutes.js   # Dashboard endpoints
│   │   └── notificationRoutes.js # Notification endpoints
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── bookController.js    # Book logic
│   │   ├── loanController.js    # Loan logic
│   │   ├── dashboardController.js # Dashboard logic
│   │   └── notificationController.js # Notification logic
│   ├── utils/
│   │   └── response.js          # Standard response helpers
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
├── database/
│   ├── schema.sql               # Database schema
│   └── seed.js                  # Seed data script
├── index.test.js                # Jest tests
├── .env                         # Environment variables
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Books
- `GET /api/books` - List books (with search, category, available filters, pagination)
- `GET /api/books/categories` - Get all categories
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create book (admin only)
- `PUT /api/books/:id` - Update book (admin only)
- `DELETE /api/books/:id` - Delete book (admin only)

### Loans
- `GET /api/loans` - List loans (all for admin, own for student)
- `GET /api/loans/:id` - Get loan by ID
- `POST /api/loans` - Request loan (student only)
- `PATCH /api/loans/:id/approve` - Approve loan (admin only)
- `PATCH /api/loans/:id/reject` - Reject loan (admin only)
- `PATCH /api/loans/:id/return` - Return loan
- `PATCH /api/loans/:id/extend` - Extend loan by 7 days

### Dashboard
- `GET /api/dashboard` - Get dashboard stats (role-based)

### Notifications
- `GET /api/notifications` - Get notifications (all for admin, own for student)

### Health
- `GET /api/health` - Health check

## Response Format

**Success:**
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables in `.env`:
```
PORT=3000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=
DB_NAME=perpus_db
JWT_SECRET=your_secret_key_here
FRONTEND_ORIGIN=http://127.0.0.1:5173
```

3. Create database and run schema:
```bash
mysql -u root -p
CREATE DATABASE perpus_db;
EXIT;
```

4. Run seed script to populate database:
```bash
npm run seed
```

5. Start development server:
```bash
npm run dev
```

## Run Tests

```bash
npm test
```

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Mahasiswa | siswa@perpustakaan.com | siswa123 |
| Admin | admin@perpustakaan.com | admin123 |

## Technologies

- Node.js
- Express
- MySQL (mysql2)
- JWT (jsonwebtoken)
- bcrypt
- Joi (validation)
- Jest (testing)
- Supertest (testing)

## Features

- RESTful API
- JWT authentication
- Role-based authorization (admin/student)
- Input validation with Joi
- CORS configuration
- Rate limiting
- Error handling middleware
- Transaction support for loan approval
- Pagination for book listings