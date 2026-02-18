const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
    },
    amount: {
        type: Number,
        required: [true, 'Please add a positive number for amount'],
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Food', 'Travel', 'Rent', 'Shopping', 'Other'],
    },
    date: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Expense', expenseSchema);
