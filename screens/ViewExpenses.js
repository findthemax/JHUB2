import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import ExpenseItem from '../components/ExpenseItem'
import {FontAwesome} from "@expo/vector-icons";
import * as expensesActions from '../store/expenses-actions'

import { useSelector, useDispatch } from "react-redux";
import Colors from "../constants/Colors";


const ViewExpenses = ({navigation}) => {

    const [total, setTotal] = useState(0)

    const expenses = useSelector(state => state.expenses.expenses)
    const dispatch = useDispatch();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <FontAwesome
                    name="plus"
                    size={24}
                    color="white"
                    style={styles.iconsRight}
                    onPress={() => navigation.navigate('AddExpenses')}
                />
            )
        });
    }, [navigation]);


    useEffect(() => {
        dispatch(expensesActions.loadExpenses())
    }, [dispatch])

    useEffect(() => {
        setTotal(0)
        expenses.forEach(expense => setTotal(total + expense.amount))
    }, [expenses])

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{width: '100%'}}>
                <Text style={{textAlign: 'center', paddingHorizontal: 10, marginVertical: 10, color: Colors.orange}}>Welcome to JHUB Expenses! In order to add an expense please click the add button in the top right.</Text>
            </View>
            {expenses.length > 0 && (
                <View style={styles.total}>
                    <Text style={styles.h1}>Total</Text>
                    <Text style={styles.h2}>£{(total/100).toFixed(2)}</Text>
                </View>
            )}

            <FlatList
                data={expenses}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                    <ExpenseItem
                        image={item.image}
                        supplier={item.supplier}
                        amount={item.amount}
                        date={item.date}
                        id={item.id}
                    />
                )}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    iconsRight: {
        padding: 10
    },
    total: {
        width: "100%",
        marginVertical: 10,
        alignItems: 'center'
    },
    h1: {
        color: Colors.orange,
        fontSize: 20,
        fontWeight: '400',
        textAlign: 'center'
    },
    h2: {
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center'
    }

});


export default ViewExpenses;