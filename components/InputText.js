import React, { useState } from 'react'

import {View, Text, StyleSheet, TextInput} from "react-native";

import Colors from "../constants/Colors";

const InputText = props => {

    const { data, errors, valueUpdate } = props
    const { param, label, value, info } = data

    const errorArray = errors.filter(error => error.param === param && error)

    const [ infoShow, setShowInfo ] = useState(false)

    return (
        <View style={styles.formInput}>
            <Text style={styles.inputTitle}>{label}</Text>
            <TextInput
                style={styles.textInput}
                value={value}
                placeholder={label}
                onChangeText={text => valueUpdate(data, text)}
                {...props}
            />
            {errorArray.map((error, index) => <Text key={param+index} style={styles.error}>{error.msg}</Text>)}
        </View>
    )
}

export default InputText

const styles = StyleSheet.create({
    formInput: {
        width: '90%',
        marginBottom: 15,
        alignItems: 'center'
    },
    textInput: {
        borderBottomColor: Colors.orange,
        borderBottomWidth: .5,
        textAlign: 'center',
        width: '90%',
        padding: 10,
        fontSize: 20
    },
    inputTitle: {
        color: Colors.orange,
        fontSize: 15,
        width: '100%',
        textAlign: 'left'
    },
    error: {
        textAlign: 'center',
        color: 'red',
        marginTop: 2,
    },
})
