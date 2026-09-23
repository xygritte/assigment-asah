/**
 * ========================================================
 * Expense Tracker App — main.js
 * ========================================================
 * Pure JavaScript implementation for the submission rubric.
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
const submitButton = document.querySelector(
  '[data-testid="transactionFormSubmitButton"]'
);

const searchForm = document.getElementById('searchTransactionForm');
const searchInput = document.getElementById('searchTransactionFormTitleInput');

const balanceElement = document.querySelector('.tracker-summary__balance-amount');
const incomeTotalElement = document.querySelector(
  '.tracker-summary__stat-amount--income'
);
const expenseTotalElement = document.querySelector(
  '.tracker-summary__stat-amount--expense'
);

function generateId() {
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
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      transactions = [];
      return;
    }

    const parsed = JSON.parse(saved);

    transactions = Array.isArray(parsed)
      ? parsed.map((item) => ({
          id: item.id,
          title: String(item.title ?? ''),
          amount: Number(item.amount),
          date: String(item.date ?? ''),
          type: item.type === 'expense' ? 'expense' : 'income'
        }))
      : [];
  } catch (error) {
    console.error('Gagal membaca localStorage:', error);
    transactions = [];
  }
}

function notifyTransactionsChanged() {
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

  if (!keyword) {
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

  const editTypeButton = document.createElement('button');
  editTypeButton.type = 'button';
  editTypeButton.setAttribute(
    'data-testid',
    'transactionItemEditTypeButton'
  );
  editTypeButton.textContent = 'Ubah Tipe';
  editTypeButton.addEventListener('click', () => {
    const target = transactions.find(
      (item) => String(item.id) === String(transaction.id)
    );

    if (!target) {
      return;
    }

    target.type = target.type === 'income' ? 'expense' : 'income';

    saveTransactions();
    notifyTransactionsChanged();
  });

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.setAttribute('data-testid', 'transactionItemEditButton');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => {
    startEditing(transaction);
  });

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.setAttribute(
    'data-testid',
    'transactionItemDeleteButton'
  );
  deleteButton.textContent = 'Hapus';
  deleteButton.addEventListener('click', () => {
    transactions = transactions.filter(
      (item) => String(item.id) !== String(transaction.id)
    );

    if (String(editingTransactionId) === String(transaction.id)) {
      resetForm();
    }

    saveTransactions();
    notifyTransactionsChanged();
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

function resetForm() {
  editingTransactionId = null;
  transactionForm.reset();
  submitButton.textContent = 'Simpan';
}

function validateTransaction(title, amount) {
  if (!title.trim()) {
    alert('Judul transaksi tidak boleh kosong.');
    return false;
  }

  if (!Number.isFinite(amount) || amount < 1) {
    alert('Nominal transaksi harus minimal Rp1.');
    return false;
  }

  return true;
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

transactionForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = titleInput.value;
  const amount = Number(amountInput.value);
  const date = dateInput.value;
  const type = typeSelect.value;

  if (!validateTransaction(title, amount)) {
    return;
  }

  if (!date) {
    alert('Tanggal transaksi wajib diisi.');
    return;
  }

  if (editingTransactionId !== null) {
    const index = transactions.findIndex(
      (transaction) =>
        String(transaction.id) === String(editingTransactionId)
    );

    if (index === -1) {
      resetForm();
      return;
    }

    transactions[index] = {
      ...transactions[index],
      title: title.trim(),
      amount,
      date,
      type
    };
  } else {
    transactions.push({
      id: generateId(),
      title: title.trim(),
      amount,
      date,
      type
    });
  }

  saveTransactions();
  resetForm();
  notifyTransactionsChanged();
});

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  renderTransactions();
});

searchInput.addEventListener('input', renderTransactions);

document.addEventListener('transaction:updated', () => {
  renderTransactions();
  updateDashboard();
});

function initialize() {
  loadTransactions();

  const greeting = document.querySelector('.tracker-header__greeting');
  if (greeting) {
    greeting.innerHTML =
      'Halo, <strong>furqonramadhani</strong>';
  }

  renderTransactions();
  updateDashboard();
}

initialize();
