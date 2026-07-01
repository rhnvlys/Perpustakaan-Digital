# Perpustakaan Digital - Frontend

Frontend SPA untuk aplikasi Perpustakaan Digital dengan Vanilla JS + Vite.

## Struktur Proyek

```
frontend/
├── src/
│   ├── api/
│   │   ├── client.js           # HTTP client with auth
│   │   ├── authApi.js          # Auth API calls
│   │   ├── bookApi.js          # Book API calls
│   │   ├── loanApi.js          # Loan API calls
│   │   ├── dashboardApi.js     # Dashboard API calls
│   │   └── notificationApi.js  # Notification API calls
│   ├── state/
│   │   ├── authStore.js        # Auth state with localStorage
│   │   └── appState.js         # App state (route, search, etc.)
│   ├── views/
│   │   ├── authView.js         # Login/register views
│   │   ├── studentDashboardView.js  # Student dashboard
│   │   ├── adminDashboardView.js    # Admin dashboard
│   │   ├── catalogView.js      # Book catalog
│   │   ├── adminBooksView.js   # Book management
│   │   ├── loansView.js        # Loan management
│   │   ├── profileView.js      # User profiles
│   │   └── notificationView.js # Notification list
│   ├── components/
│   │   ├── topbar.js           # Header component
│   │   ├── sidebar.js          # Navigation menu
│   │   ├── toast.js            # Toast notifications
│   │   ├── modal.js            # Confirmation modals
│   │   └── emptyState.js       # Empty state placeholders
│   ├── utils/
│   │   ├── icons.js            # SVG icons
│   │   ├── formatter.js        # Formatters (currency, dates, etc.)
│   │   ├── sanitizer.js        # HTML escaping
│   │   └── date.js             # Date utilities
│   └── main.js                 # Entry point, event delegation, routing
├── index.html
├── style.css                   # Global styles
├── .env                        # Environment variables
├── .env.example
├── package.json
└── README.md
```

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Configure environment variables in `.env`:
```
VITE_API_BASE_URL=http://127.0.0.1:3000
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Features

- Single Page Application (SPA)
- Role-based views (student/admin)
- Book catalog with search and filters
- Loan request and management
- Dashboard with metrics
- Notification system
- Responsive design (mobile-first)
- Persistent auth session with localStorage
- Automatic logout on token expiry

## Views

### Auth
- Login form
- Registration form with NIM field

### Student Views
- Dashboard: active loans, metrics, latest books
- Catalog: search, category filter, book details, loan requests
- Loans: active/history tabs, return/extend actions
- Profile: user info, loan statistics

### Admin Views
- Dashboard: metrics, popular books
- Books: CRUD operations, stock management
- Loans: view all loans, approve/reject requests
- Profile: admin info, system stats
- Notifications: all notifications

## Components

- **Topbar**: Header with notification bell and user menu
- **Sidebar**: Navigation menu with role-based items
- **Toast**: Animated notification messages
- **Modal**: Confirmation dialogs
- **Empty State**: Placeholder for no data

## Utilities

- **Formatter**: Currency (IDR), dates, status badges, book covers, metric cards
- **Sanitizer**: HTML escaping
- **Date**: Indonesian date formatting, date math
- **Icons**: SVG icon library

## State Management

- **authStore**: User authentication state with localStorage persistence
- **appState**: UI state for routing, search, forms, and data arrays

## API Integration

All API calls go through a centralized `apiClient` with:
- Automatic token injection
- 401 error handling → auto logout
- Error messages
- Standardized response handling

## Technologies

- Vanilla JavaScript (ES6+)
- Vite (build tool)
- CSS (custom, no frameworks)

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Mahasiswa | siswa@perpustakaan.com | siswa123 |
| Admin | admin@perpustakaan.com | admin123 |