export const categories = ['Semua', 'Fiksi', 'Fiksi Sejarah', 'Sejarah', 'Pengembangan Diri', 'Biografi'];

export const appState = {
    route: 'login',
    authMode: 'login',
    sidebarOpen: false,
    search: '',
    adminSearch: '',
    category: 'Semua',
    selectedBookId: null,
    selectedLoanId: null,
    loanTab: 'active',
    bookFormOpen: false,
    editingBookId: null,
    loading: false,
    books: [],
    loans: [],
    requests: [],
    notifications: [],
    dashboard: null
};

export function setRoute(route) {
    appState.route = route;
    appState.sidebarOpen = false;
    appState.bookFormOpen = false;
    appState.editingBookId = null;
}
