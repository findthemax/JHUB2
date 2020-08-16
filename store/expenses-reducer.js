import { ADD_EXPENSE, GET_EXPENSES, DELETE_EXPENSES } from "./expenses-actions";
import Expense from '../models/expense'

const initialState = {
    expenses: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_EXPENSE:
            const newExpense = new Expense(action.id, action.supplier, action.amount, action.date, action.image)
            return {
                expenses: state.expenses.concat(newExpense)
            }
        case GET_EXPENSES:
            return {
                expenses: action.expenses.map(ex => new Expense(ex.id, ex.supplier, ex.amount, ex.date, ex.image))
            }
        case DELETE_EXPENSES:
            return {
                expenses: state.expenses.filter(item => item.id !== action.id)
            }
        default:
            return state
    }
    return state;
}