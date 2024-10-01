const Expense = require('../models/expenses');

//add expenses
const addExpense = async (req, res, next) => {
    const { description, category, income, expense } = req.body;
    console.log("Expense add request received");
    if (!description || !category) {
        console.log('Expense data missing');
        return res.sendStatus(400);
    }

    try {
        const newExpense = await Expense.create({
            description: description,
            category: category,
            income: income,
            expense: expense,
            userId: req.user._id
        });

        console.log('Expense added');
        return res.status(201).json({ newExpense });

    } catch (error) {
        console.log(error, JSON.stringify(error));
        res.status(500).json({ error });
    }
};

// adding expense
const getExpense = async (req, res) => {
    try {
      const expenses = await Expense.find({ userId: req.user._id })
        .select('id description category income expense')

      return res.status(200).json({ expenses });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
    }
  };
  

// Deleting expense
const deleteExpenses = async (req, res, next) => {
    try {
        const id = req.params.id;
        await Expense.deleteOne({ _id: id, userId: req.user._id });
        return res.status(200).json({ message: "Expense deleted" });

    } catch (error) {
        console.log(error);
        return res.status(404).json({ message: "Expense not found" });
    }
}


module.exports = {
    addExpense,
    getExpense,
    deleteExpenses
}



