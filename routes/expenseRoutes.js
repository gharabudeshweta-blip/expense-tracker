const express = require('express');
const router = express.Router();
const {
    getAllExpenses,
    getExpenseById,
    addExpense,
    updateExpense,
    deleteExpense
} = require('../controllers/expenseController');

const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getAllExpenses)
    .post(protect, addExpense);

router.route('/:id')
    .get(protect, getExpenseById)
    .put(protect, updateExpense)
    .delete(protect, deleteExpense);

module.exports = router;
