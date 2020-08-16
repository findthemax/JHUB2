import React, {useState, useReducer} from 'react';
import {View, Text, Button, Alert, TextInput, ScrollView, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import moment from 'moment'
import DatePickerModal from "../components/DatePickerModal";
import DatePickerAndroid from "../components/DatePickerAndroid";
import ImagePicker from "../components/ImagePicker";
import Colors from "../constants/Colors";
import { useDispatch } from "react-redux";
import {addExpense, DELETE_EXPENSES} from '../store/expenses-actions'
import InputText from '../components/InputText'
import {FontAwesome} from "@expo/vector-icons";
import {checkContent, checkCurrency} from "../helpers/formFieldValidator";
import {checkEmptyParams, setValue} from "../helpers/formActions";

const SET_VALUE = 'SET_VALUE'
const SUBMIT_CHECK = 'SUBMIT_CHECK'
const SET_DATE = 'SET_DATE'
const ADD_IMG = 'ADD_IMG'
const OPEN_DATE_PICK = 'OPEN_DATE_PICK'
const CLOSE_DATE_PICK = 'CLOSE_DATE_PICK'


function reducer(state, action) {
    state = {
        ...state
    }
    switch (action.type) {
        case SET_VALUE:
            state = setValue(action, state)
            break
        case SUBMIT_CHECK:
            state.emptyErrors = checkEmptyParams(state)
            state.showEmptyErrors = true
            if(state.errors.length < 1 && state.emptyErrors.length < 1) {
                Alert.alert('Add an Expense',
                    `You are submitting and expense for £${state.amount.value}, at ${state.supplier.value}, on ${moment(state.date.value).format('Do MMMM YYYY')}`,
                    [
                        {
                            text: 'Okay',
                            onPress: async () => {
                                await action.reduxDispatch(addExpense(state.supplier.value, state.amount.value, state.date.value, state.image.value))
                                state.supplier.value = ''
                                state.amount.value = ''
                                state.date.value = new Date()
                                state.image.value = ''
                                action.navigation.goBack()
                            }
                        },
                        {
                            text: 'Cancel'
                        }
                    ])
            } else {
                Alert.alert('Errors', 'There are errors in your expense form please correct them to proceed', [{text: 'Okay'}])
            }
            break
        case SET_DATE:
            state.date.value = action.value
            break
        case ADD_IMG:
            state.emptyErrors = state.emptyErrors.filter(error => error.param !== 'image' && error)
            state.image.value = action.value
            break
        case OPEN_DATE_PICK:
            state.date.visible = true
            break
        case CLOSE_DATE_PICK:
            state.date.visible = false
            break
        default:
            return state
    }
    return state
}

const initialState = {
    supplier: {
        param: 'supplier',
        label: 'Supplier Name',
        value: '',
        validate: [],
        info: "Please provide the name of the company you spent your expenses with",
        dispatchType: 'setValue',
        required: true,
    },
    amount: {
        param: 'amount',
        label: 'Receipt Amount',
        value: '',
        validate: [
            {check: checkCurrency, checkParams: {}, msg: "Something appears wrong with the amount. It must be an amount between 0.01 and 999.99",}
        ],
        info: "Please provide the total, including tax, you spent. This number must be between £0.01 and £999.99",
        dispatchType: 'setValue',
        required: true,
    },
    date: {
        type: "date",
        param: 'date',
        label: 'Date of Receipt',
        value: new Date(),
        validate: [],
        info: null,
        dispatchType: 'setDate',
        required: true,
        visible: false,
    },
    image: {
        type: "image",
        param: 'image',
        label: 'Receipt Photo',
        value: '',
        validate: [],
        info: null,
        dispatchType: 'setDate',
        required: true,
    },
    errors: [],
    emptyErrors: [],
    showEmptyErrors: false,
    submitError: '',
}

const AddEditExpenses = ({ navigation }) => {

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <FontAwesome
                    name="check"
                    size={24}
                    color="white"
                    style={styles.iconsRight}
                    onPress={() => addExpenseHandler()}
                />
            )
        });
    }, [navigation]);

    const [state, dispatch] = useReducer(reducer, initialState);

    const reduxDispatch = useDispatch()

    const addExpenseHandler = async () => {
        await dispatch({type: SUBMIT_CHECK, reduxDispatch, navigation})
    }

    const updateDateHandler = async (date) => {
        await dispatch({type: SET_DATE, value: date})
    }

    const closeDateHandler = async () => {
        await dispatch({type: CLOSE_DATE_PICK})
    }

    const imageTakenHandler = imagePath => {
        dispatch({type: ADD_IMG, value: imagePath})
    }

    const valueUpdateHandler = (data, value) => {
        dispatch({type: SET_VALUE, data, value})
    }

    const stateErrors = state.showEmptyErrors ? [...state.errors, ...state.emptyErrors] : state.errors

    return (
        <ScrollView contentContainerStyle={{ width: '100%', flex: 1, alignItems: 'center' }}>
            {Platform.OS === 'ios' &&
            <DatePickerModal
                visibility={state.date.visible}
                updateDate={updateDateHandler}
                date={state.date.value}
                close={closeDateHandler}
            />
            }
            <View style={styles.form}>
                <InputText
                    data={state.supplier}
                    spellcheck={false}
                    valueUpdate={valueUpdateHandler}
                    errors={stateErrors}
                />
                <InputText
                    data={state.amount}
                    valueUpdate={valueUpdateHandler}
                    errors={stateErrors}
                    keyboardType="decimal-pad"
                />
                <View style={styles.formInput}>
                    <Text style={styles.inputTitle}>Date of Receipt</Text>
                    <View style={styles.datePick}>
                        <Text>{moment(state.date.value).format('Do MMMM YYYY')}</Text>
                        <TouchableOpacity style={styles.changeBtn} onPress={() => dispatch({type: OPEN_DATE_PICK})}>
                            <Text style={styles.changeBtnText}>Change</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {state.date.visible && Platform.OS === 'android' &&
                    <DatePickerAndroid
                        updateDate={updateDateHandler}
                        date={state.date.value}
                        close={closeDateHandler}
                    />
                }
                <ImagePicker data={state.image}
                             onImageTaken={imageTakenHandler}
                             errors={stateErrors}/>
                <View style={styles.submitBtn}>
                    <Button title="Add Expense" onPress={() => addExpenseHandler(state.values)}/>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    form: {
        marginTop: 20,
        marginBottom: 20,
        width: '100%',
        flex: 1,
        alignItems: 'center'
    },
    datePick: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    submitBtn: {
        marginTop: 20,
    },
    changeBtn: {
        backgroundColor: Colors.orange,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 5,
        shadowColor: 'black',
        shadowOpacity: .3,
        shadowRadius: 3,
        shadowOffset: {
            width: 0,
            height: 0
        }
    },
    inputTitle: {
        color: Colors.orange,
        fontSize: 15,
        width: '100%',
        textAlign: 'left'
    },
    formInput: {
        width: '90%',
        marginBottom: 15,
        alignItems: 'center'
    },
    iconsRight: {
        padding: 10
    },
});

export default AddEditExpenses;