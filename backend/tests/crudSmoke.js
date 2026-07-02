const BASE_URL = 'http://localhost:3000/api';

async function testCRUD() {
    console.log('--- Memulai Pengujian CRUD Backend Langsung ke API ---');

    try {
        // 1. Autentikasi Admin
        console.log('\n[1/5] Melakukan login sebagai Admin...');
        const resLogin = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@perpustakaan.com',
                password: 'admin123'
            })
        });

        const loginData = await resLogin.json();
        if (resLogin.status !== 200 || !loginData.success) {
            throw new Error(`Gagal Login: ${JSON.stringify(loginData)}`);
        }

        const token = loginData.data.token;
        console.log('✓ Login Admin berhasil! Token didapatkan.');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // 2. CREATE (Tambah Buku Baru)
        console.log('\n[2/5] Menguji CREATE: Menambahkan buku baru...');
        const newBookPayload = {
            title: 'Buku Test CRUD Mandiri',
            author: 'Penulis Test',
            category: 'Teknologi',
            isbn: '111-222-333',
            publisher: 'Penerbit Test',
            year: '2026',
            total: 10,
            description: 'Buku ini ditambahkan melalui pengujian REST API CRUD langsung.'
        };

        const resCreate = await fetch(`${BASE_URL}/books`, {
            method: 'POST',
            headers,
            body: JSON.stringify(newBookPayload)
        });

        const createData = await resCreate.json();
        if (resCreate.status !== 201 || !createData.success) {
            throw new Error(`Gagal CREATE Buku: ${JSON.stringify(createData)}`);
        }
        const bookId = createData.data.id;
        console.log(`✓ Buku berhasil ditambahkan! ID: ${bookId}`);

        // 3. READ (Ambil Buku Baru)
        console.log('\n[3/5] Menguji READ: Membaca data buku dari database...');
        const resRead = await fetch(`${BASE_URL}/books?search=Buku Test CRUD Mandiri`, {
            method: 'GET',
            headers
        });

        const readData = await resRead.json();
        if (resRead.status !== 200 || !readData.success) {
            throw new Error(`Gagal READ Buku: ${JSON.stringify(readData)}`);
        }

        const foundBook = readData.data.books.find(b => b.id === bookId);
        if (!foundBook) {
            throw new Error('Buku tidak ditemukan di hasil pencarian database!');
        }
        console.log(`✓ Buku ditemukan di database! Judul: "${foundBook.title}", Stok: ${foundBook.total}`);

        // 4. UPDATE (Ubah Buku)
        console.log('\n[4/5] Menguji UPDATE: Mengubah informasi buku...');
        const updatedPayload = {
            title: 'Buku Test CRUD Mandiri (Updated)',
            author: 'Penulis Test (Updated)',
            category: 'Teknologi',
            isbn: '111-222-333',
            publisher: 'Penerbit Test',
            year: '2026',
            total: 15,
            description: 'Deskripsi buku ini telah diperbarui.'
        };

        const resUpdate = await fetch(`${BASE_URL}/books/${bookId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(updatedPayload)
        });

        const updateData = await resUpdate.json();
        if (resUpdate.status !== 200 || !updateData.success) {
            throw new Error(`Gagal UPDATE Buku: ${JSON.stringify(updateData)}`);
        }
        console.log('✓ Buku berhasil di-update!');

        // Verifikasi Update
        const resVerify = await fetch(`${BASE_URL}/books`, { method: 'GET', headers });
        const verifyData = await resVerify.json();
        const updatedBook = verifyData.data.books.find(b => b.id === bookId);
        if (!updatedBook || updatedBook.title !== 'Buku Test CRUD Mandiri (Updated)' || updatedBook.total !== 15) {
            throw new Error('Data buku hasil update tidak cocok di database!');
        }
        console.log('✓ Verifikasi data update berhasil!');

        // 5. DELETE (Hapus Buku)
        console.log('\n[5/5] Menguji DELETE: Menghapus buku dari database...');
        const resDelete = await fetch(`${BASE_URL}/books/${bookId}`, {
            method: 'DELETE',
            headers
        });

        const deleteData = await resDelete.json();
        if (resDelete.status !== 200 || !deleteData.success) {
            throw new Error(`Gagal DELETE Buku: ${JSON.stringify(deleteData)}`);
        }
        console.log('✓ Buku berhasil dihapus dari database!');

        // Verifikasi Delete
        const resVerifyDelete = await fetch(`${BASE_URL}/books`, { method: 'GET', headers });
        const verifyDeleteData = await resVerifyDelete.json();
        const deletedBook = verifyDeleteData.data.books.find(b => b.id === bookId);
        if (deletedBook) {
            throw new Error('Buku masih ditemukan di database setelah perintah hapus!');
        }
        console.log('✓ Verifikasi hapus berhasil! Buku sudah tidak ada.');

        console.log('\n================================================');
        console.log('SEMUA TAHAPAN PENGUJIAN CRUD MANDIRI PASSED!');
        console.log('================================================');
    } catch (err) {
        console.error('\n❌ PENGUJIAN GAGAL:', err.message);
        process.exit(1);
    }
}

testCRUD();
