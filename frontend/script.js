const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const titleInput = document.getElementById('title');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const descriptionInput = document.getElementById('description');
const editIdInput = document.getElementById('edit-id');

// State to store expenses
let expenses = [];

// Check for token
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'login.html';
}

// Global logout function
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// Fetch expenses from API
async function getExpenses() {
    try {
        const res = await fetch('http://localhost:5000/api/expenses', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        // Check for 401
        if (res.status === 401) {
            logout();
            return;
        }

        const data = await res.json();

        expenses = data.data;

        updateDOM();
    } catch (err) {
        console.error(err);
    }
}

// Add transaction
async function addTransaction(e) {
    e.preventDefault();

    if (titleInput.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a title and amount');
        return;
    }

    const transaction = {
        title: titleInput.value,
        amount: +amount.value,
        category: categoryInput.value,
        date: dateInput.value,
        description: descriptionInput.value
    };

    const editId = editIdInput.value;

    if (editId) {
        // Update existing transaction
        try {
            const res = await fetch(`http://localhost:5000/api/expenses/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(transaction)
            });


            if (res.ok) {
                const data = await res.json();
                // Update local state
                expenses = expenses.map(exp => (exp._id === editId ? data.data : exp));
                updateDOM();
                resetForm();
            }
        } catch (err) {
            console.error(err);
        }
    } else {
        // Create new transaction
        try {
            const res = await fetch('http://localhost:5000/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(transaction)
            });

            const data = await res.json();
            expenses.push(data.data);
            updateDOM();
            resetForm();

        } catch (err) {
            console.error(err);
        }
    }
}

// Remove transaction
async function removeTransaction(id) {
    try {
        await fetch(`http://localhost:5000/api/expenses/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        expenses = expenses.filter(expense => expense._id !== id);
        updateDOM();
    } catch (err) {
        console.error(err);
    }
}

// Prepare form for editing
function editTransaction(id) {
    const expense = expenses.find(exp => exp._id === id);
    if (!expense) return;

    titleInput.value = expense.title;
    amount.value = expense.amount;
    categoryInput.value = expense.category;
    // Format date for input type="date"
    dateInput.value = expense.date ? new Date(expense.date).toISOString().split('T')[0] : '';
    descriptionInput.value = expense.description || '';
    editIdInput.value = expense._id;

    document.querySelector('.btn').textContent = 'Update Transaction';
}

// Reset form
function resetForm() {
    titleInput.value = '';
    amount.value = '';
    categoryInput.value = 'Food';
    dateInput.value = '';
    descriptionInput.value = '';
    editIdInput.value = '';
    document.querySelector('.btn').textContent = 'Add Transaction';
}

// Update DOM
function updateDOM() {
    list.innerHTML = '';

    expenses.forEach(expense => {
        const sign = expense.amount < 0 ? '-' : '+';
        const item = document.createElement('li');

        // Add class based on category
        item.classList.add(expense.category.toLowerCase());

        item.innerHTML = `
            <div class="expense-info">
                <strong>${expense.title}</strong>
                <span>${new Date(expense.date).toLocaleDateString()}</span>
                <span>${expense.category}</span>
            </div>
             <span class="expense-amount">$${Math.abs(expense.amount).toFixed(2)}</span>
            <div class="actions">
                <button class="edit-btn" onclick="editTransaction('${expense._id}')">✏️</button>
                <button class="delete-btn" onclick="removeTransaction('${expense._id}')">x</button>
            </div>
        `;

        list.appendChild(item);
    });

    updateValues();
}

// Update balance
function updateValues() {
    const amounts = expenses.map(expense => expense.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    balance.innerText = `$${total}`;
}

// Event listeners
form.addEventListener('submit', addTransaction);

// Initial Load
getExpenses();
