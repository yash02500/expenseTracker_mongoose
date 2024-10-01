const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    income:{
        type: Number
    },
    expense: {
        type: Number
    }
});

expenseSchema.statics.getExpense = async function(userId) {
    const expenses = await this.find({ userId })
      .select('id description category income expense createdAt');
    return expenses;
  };
  
module.exports = mongoose.model('Expense', expenseSchema);
