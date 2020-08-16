import React, { useState } from 'react'
import moment from 'moment'
import { useDispatch } from "react-redux";
import { deleteExpense } from '../store/expenses-actions'

import { View, Text, Image, StyleSheet, TouchableOpacity, Button } from "react-native";

import Colors from "../constants/Colors";


const ExpenseItem = ({ id, supplier, date, amount, image }) => {

    const [viewReceipt, setViewReceipt] = useState(false)

    const dispatch = useDispatch()

    return (
        <TouchableOpacity onPress={() => setViewReceipt(!viewReceipt)} style={styles.expenseItem}>
            <View>
                <Text style={styles.h1}>{supplier}</Text>
                <Text style={styles.h2}>{moment(date).format('Do MMMM YYYY')}</Text>
                <Text style={styles.h3}>£{(parseInt(amount)/100).toFixed(2)}</Text>
                <Text style={styles.hint}>Tap to view Receipt</Text>
            </View>
            {viewReceipt &&
            <View style={{width: '100%', height: "100%", marginVertical: 10, alignItems: 'center'}}>
                <Image style={{width: '100%', height: 200, resizeMode: 'contain'}} source={{uri: image}} />
                <View style={styles.delBtn}>
                    <Button color={'red'} title="Delete" onPress={() => {dispatch(deleteExpense(id))}} />
                </View>
            </View>

            }
        </TouchableOpacity>
    )
}

export default ExpenseItem

const styles = StyleSheet.create({
    expenseItem: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.orange,
        marginVertical: 2
    },
    h1: {
        textAlign: 'center',
        fontSize: 20
    },
    h2: {
        textAlign: 'center',
        fontSize: 12
    },
    h3: {
        textAlign: 'center',
        paddingTop: 4,
        fontSize: 18,
        fontWeight: '600'
    },
    hint: {
        color: Colors.orange,
        fontSize: 10,
        fontWeight: '200',
        textAlign: 'center'
    },
    delBtn: {
        width: '50%',
        marginVertical: 15
    }
})
