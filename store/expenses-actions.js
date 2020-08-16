import * as FileSystem from 'expo-file-system';
import { insertExpense, fetchExpenses, deleteExpenses } from "../helpers/db";

export const ADD_EXPENSE = 'ADD_EXPENSE'
export const GET_EXPENSES = 'GET_EXPENSES'
export const DELETE_EXPENSES = 'DELETE_EXPENSES'

export const addExpense = (supplier, amount, date, image) => {

    amount = parseFloat(amount)*100
    date = date.getTime()

    return async dispatch => {
        const fileName = image.split('/').pop();
        const newPath = FileSystem.documentDirectory + fileName;
        try {
            await FileSystem.moveAsync({
                from: image,
                to: newPath
            })
            const dbResult = await insertExpense(supplier, amount, date, newPath)
            dispatch({type: ADD_EXPENSE, id: dbResult.insertId, supplier, amount, date, image: newPath})
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}

export const loadExpenses = () => {
    return async dispatch => {
        try {
            const dbResult = await fetchExpenses();
            dispatch({ type: GET_EXPENSES, expenses: dbResult.rows._array })
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}

export const deleteExpense = id => {
    return async dispatch => {
        try {
            const dbResult = await deleteExpenses(id);
            if(dbResult) {
                dispatch({ type: DELETE_EXPENSES, id})
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}