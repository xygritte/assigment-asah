/**
 * ========================================================
 * Expense Tracker App — main.js
 * ========================================================
 * Tulis seluruh kode JavaScript kamu di sini.
 */

// TODO [Basic] Buat variabel array untuk menyimpan semua data transaksi, contoh: let transactions = []
// TODO [Basic] Buat fungsi untuk menghasilkan ID unik secara otomatis, contoh: gunakan +new Date()


/**
 * ========================================================
 * Kriteria 1: Memanipulasi DOM untuk Form dan Daftar Transaksi
 * ========================================================
 */
// TODO [Basic] Ambil elemen kontainer incomeList dan expenseList dari DOM

/**
 * TODO [Basic]:
 * Buat fungsi untuk menampilkan (render) semua transaksi ke layar:
 *  - Kosongkan kontainer terlebih dahulu sebelum mengisi ulang
 *  - Gunakan perulangan, buat setiap elemen kartu dengan document.createElement()
 *  - Pastikan setiap elemen memiliki atribut data-testid yang sesuai (lihat panduan di rubrik)
 *  - Masukkan kartu ke kontainer yang tepat: income → incomeList, expense → expenseList
 */

// TODO [Basic] Tambahkan event listener 'submit' pada form, panggil e.preventDefault() di dalamnya
// TODO [Basic] Di dalam handler submit, ambil nilai input lalu tambahkan sebagai objek transaksi baru ke array

/**
 * TODO [Skilled]:
 * Tambahkan validasi input sebelum menyimpan data:
 *  - Tampilkan alert() dan hentikan proses jika judul kosong
 *  - Tampilkan alert() dan hentikan proses jika nominal kurang dari 1
 */

/**
 * TODO [Advanced]:
 * Setiap kali data transaksi berubah, perbarui Panel Dasbor:
 *  - Hitung total pemasukan, total pengeluaran, dan saldo (pemasukan - pengeluaran)
 *  - Tampilkan hasilnya ke elemen yang sesuai di HTML
 */


/**
 * ========================================================
 * Kriteria 2: Mengelola Penyimpanan Data (Web Storage API)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Data transaksi disimpan ke localStorage menggunakan JSON.stringify(), dan dimuat kembali saat halaman dibuka menggunakan JSON.parse().
 *  - Tombol "Hapus" berfungsi: transaksi yang dihapus langsung hilang dari layar dan dari localStorage.
 */

/**
 * TODO [Skilled]:
 * Tombol "Edit" berfungsi: saat ditekan, formulir (#transactionForm) secara otomatis terisi dengan data transaksi yang dipilih.
 *  - Pengguna dapat mengubah data lalu menyimpan perubahan.
 *  - Formulir kembali ke mode "Tambah" setelah pembaruan selesai.
 */

/**
 * TODO [Advanced]:
 * Gunakan Custom Event sebagai penghubung antara perubahan data dan pembaruan tampilan:
 *  - Kirim sinyal dengan document.dispatchEvent(new Event('transaction:updated')) setiap kali data berubah
 *  - Pasang satu listener untuk event tersebut yang memanggil fungsi render dan update dasbor
 */


/**
 * ========================================================
 * Kriteria 3: Fitur Interaktif (Pindah Kategori dan Pencarian)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Tambahkan tombol "Ubah Tipe" pada setiap kartu transaksi:
 *  - Saat diklik, ubah tipe transaksi: 'income' → 'expense' atau 'expense' → 'income'
 *  - Simpan perubahan ke localStorage dan perbarui tampilan
 */

/**
 * TODO [Skilled]:
 * Tambahkan event listener 'input' pada kolom pencarian:
 *  - Filter array transaksi berdasarkan kecocokan kata kunci dengan judul transaksi
 *  - Tampilkan hanya transaksi yang judulnya mengandung kata kunci tersebut
 */

/**
 * TODO [Advanced]:
 * Pastikan fitur pencarian berjalan dengan baik di semua kondisi:
 *  - Saat kolom pencarian dikosongkan, tampilkan kembali seluruh daftar transaksi
 */


const STORAGE_KEY = 'expenseTrackerTransactions';

let transactions = [];
let editingTransactionId = null;

const incomeList = document.getElementById('incomeList');
const expenseList = document.getElementById('expenseList');

const transactionForm = document.getElementById('transactionForm');
const titleInput = document.getElementById('transactionFormTitleInput');
const amountInput = document.getElementById('transactionFormAmountInput');
const dateInput = document.getElementById('transactionFormDateInput');
const typeSelect = document.getElementById('transactionFormTypeSelect');
const submitButton = document.querySelector('[data-testid="transactionFormSubmitButton"]');

const searchInput = document.getElementById('searchTransactionFormTitleInput');

const balanceElement = document.querySelector('.tracker-summary__balance-amount');
const incomeTotalElement = document.querySelector('.tracker-summary__stat-amount--income');
const expenseTotalElement = document.querySelector('.tracker-summary__stat-amount--expense');

function generateTransactionId() {
  return +new Date();
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function loadTransactions() {
  const storedTransactions = localStorage.getItem(STORAGE_KEY);

  if (!storedTransactions) {
    transactions = [];
    return;
  }

  try {
    const parsedTransactions = JSON.parse(storedTransactions);

    transactions = Array.isArray(parsedTransactions)
      ? parsedTransactions.map((transaction) => ({
          id: transaction.id,
          title: String(transaction.title ?? ''),
          amount: Number(transaction.amount),
          date: String(transaction.date ?? ''),
          type: transaction.type === 'expense' ? 'expense' : 'income'
        }))
      : [];
  } catch (error) {
    console.error('Gagal memuat transaksi:', error);
    transactions = [];
  }
}

function dispatchTransactionsUpdated() {
  document.dispatchEvent(new Event('transaction:updated'));
}

function updateDashboard() {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = totalIncome - totalExpense;

  balanceElement.textContent = formatCurrency(balance);
  incomeTotalElement.textContent = formatCurrency(totalIncome);
  expenseTotalElement.textContent = formatCurrency(totalExpense);
}

function getVisibleTransactions() {
  const keyword = searchInput.value.trim().toLowerCase();

  if (keyword === '') {
    return transactions;
  }

  return transactions.filter((transaction) =>
    transaction.title.toLowerCase().includes(keyword)
  );
}

function createTransactionCard(transaction) {
  const item = document.createElement('div');
  item.setAttribute('data-testid', 'transactionItem');

  const title = document.createElement('h3');
  title.setAttribute('data-testid', 'transactionItemTitle');
  title.textContent = transaction.title;

  const amount = document.createElement('p');
  amount.setAttribute('data-testid', 'transactionItemAmount');
  amount.textContent = `Nominal: ${formatCurrency(transaction.amount)}`;

  const date = document.createElement('p');
  date.setAttribute('data-testid', 'transactionItemDate');
  date.textContent = `Tanggal: ${transaction.date}`;

  const type = document.createElement('p');
  type.setAttribute('data-testid', 'transactionItemType');
  type.textContent = `Tipe: ${transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}`;

  const actions = document.createElement('div');

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => {
    startEditing(transaction);
  });

  const editTypeButton = document.createElement('button');
  editTypeButton.type = 'button';
  editTypeButton.setAttribute('data-testid', 'transactionItemEditTypeButton');
  editTypeButton.textContent = 'Ubah Tipe';
  editTypeButton.addEventListener('click', () => {
    toggleTransactionType(transaction.id);
  });

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.setAttribute('data-testid', 'transactionItemDeleteButton');
  deleteButton.textContent = 'Hapus';
  deleteButton.addEventListener('click', () => {
    deleteTransaction(transaction.id);
  });

  actions.append(editButton, editTypeButton, deleteButton);
  item.append(title, amount, date, type, actions);

  return item;
}

function renderTransactions() {
  incomeList.replaceChildren();
  expenseList.replaceChildren();

  getVisibleTransactions().forEach((transaction) => {
    const card = createTransactionCard(transaction);

    if (transaction.type === 'income') {
      incomeList.appendChild(card);
    } else {
      expenseList.appendChild(card);
    }
  });
}

function resetTransactionForm() {
  editingTransactionId = null;
  transactionForm.reset();
  submitButton.textContent = 'Simpan';
}

function startEditing(transaction) {
  editingTransactionId = transaction.id;
  titleInput.value = transaction.title;
  amountInput.value = transaction.amount;
  dateInput.value = transaction.date;
  typeSelect.value = transaction.type;
  submitButton.textContent = 'Perbarui';
  titleInput.focus();
}

function validateTransaction(title, amount) {
  if (title.trim() === '') {
    alert('Judul transaksi tidak boleh kosong.');
    return false;
  }

  if (!Number.isFinite(amount) || amount < 1) {
    alert('Nominal transaksi harus minimal Rp1.');
    return false;
  }

  return true;
}

function addTransaction(title, amount, date, type) {
  transactions.push({
    id: generateTransactionId(),
    title: title.trim(),
    amount,
    date,
    type
  });

  saveTransactions();
  resetTransactionForm();
  dispatchTransactionsUpdated();
}

function updateTransaction(title, amount, date, type) {
  const index = transactions.findIndex(
    (transaction) => String(transaction.id) === String(editingTransactionId)
  );

  if (index === -1) {
    resetTransactionForm();
    return;
  }

  transactions[index] = {
    ...transactions[index],
    title: title.trim(),
    amount,
    date,
    type
  };

  saveTransactions();
  resetTransactionForm();
  dispatchTransactionsUpdated();
}

function deleteTransaction(id) {
  transactions = transactions.filter(
    (transaction) => String(transaction.id) !== String(id)
  );

  if (String(editingTransactionId) === String(id)) {
    resetTransactionForm();
  }

  saveTransactions();
  dispatchTransactionsUpdated();
}

function toggleTransactionType(id) {
  const transaction = transactions.find(
    (item) => String(item.id) === String(id)
  );

  if (!transaction) {
    return;
  }

  transaction.type =
    transaction.type === 'income' ? 'expense' : 'income';

  saveTransactions();
  dispatchTransactionsUpdated();
}

transactionForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = titleInput.value;
  const amount = Number(amountInput.value);
  const date = dateInput.value;
  const type = typeSelect.value;

  if (!validateTransaction(title, amount)) {
    return;
  }

  if (editingTransactionId !== null) {
    updateTransaction(title, amount, date, type);
    return;
  }

  addTransaction(title, amount, date, type);
});

searchInput.addEventListener('input', () => {
  renderTransactions();
});

document.addEventListener('transaction:updated', () => {
  renderTransactions();
  updateDashboard();
});

function initializeApp() {
  const greeting = document.querySelector('.tracker-header__greeting');

  if (greeting) {
    greeting.innerHTML =
      'Halo, <strong>Ahmad Furqon Ramadhani (furqonramadhani)</strong>';
  }

  loadTransactions();
  renderTransactions();
  updateDashboard();
}

initializeApp();
