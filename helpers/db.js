import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('expenses.db')

export const init = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY NOT NULL, supplier TEXT NOT NULL, amount INTEGER NOT NULL, date INTEGER NOT NULL, image TEXT NOT NULL)',
                [],
                () => {
                    resolve()
                },
                (_, error) => {
                    reject(error)
                })
        })
    })
    return promise
}

export const insertExpense = (supplier, amount, date, image) => {

    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('INSERT INTO expenses (supplier, amount, date, image) VALUES (?, ?, ?, ?)',
                [supplier, amount, date, image],
                (_, result) => {
                    resolve(result)
                },
                (_, error) => {
                    reject(error)
                })
        })
    })
    return promise
}

export const fetchExpenses = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM expenses',
                [],
                (_, result) => {
                    resolve(result)
                },
                (_, error) => {
                    reject(error)
                })
        })
    })
    return promise
}

export const deleteExpenses = (id) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('DELETE FROM expenses WHERE id = ?',
                [id],
                (_, result) => {
                    resolve(result)
                },
                (_, error) => {
                    reject(error)
                })
        })
    })
    return promise
}