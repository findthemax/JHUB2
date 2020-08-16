import React, { useState } from 'react'
import { View, TouchableOpacity, Image, Text, StyleSheet, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

import Colors from "../constants/Colors";
import {MaterialIcons} from "@expo/vector-icons";


const ReceiptPicker = props => {

    const [receipt, setReceipt] = useState()

    const { data, errors, onImageTaken } = props
    const { param } = data

    const errorArray = errors.filter(error => error.param === param && error)

    const verifyPermissions = async () => {
        const { status } = await Permissions.askAsync(
            Permissions.CAMERA,
            Permissions.CAMERA_ROLL
        )
        if(status !== 'granted') {
            Alert.alert('No Camera Access', 'You need to allow camera access in order to use this app', [{text: 'Okay'}])
            return false
        }
        return true
    }

    const takeImageHandler = async () => {

        const permission = await verifyPermissions()
        if(!permission) {
            return;
        }
        const image = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: .5
        })

        await setReceipt(image.uri)
        onImageTaken(image.uri)
    }

    return (
        <View style={{width: '100%', alignItems: 'center', margin: 20}}>
            <View style={styles.imageHolder}>
                {!receipt ?
                    <Text style={styles.placeholder}>Please upload a photo of your receipt</Text>
                    :
                    <Image style={{width: '100%', height: '100%', resizeMode: 'contain'}} source={{uri: receipt}}/>
                }
            </View>
            <TouchableOpacity style={styles.photoBtn} onPress={() => takeImageHandler()}>
                <MaterialIcons name="add-a-photo" size={30} color="black" />
            </TouchableOpacity>
            {errorArray.map((error, index) => <Text key={param+index} style={styles.error}>{error.msg}</Text>)}

        </View>
    )
}

const styles = StyleSheet.create({
    placeholder: {
        color: Colors.grey,
        textAlign: 'center',
        padding: 10
    },
    imageHolder: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 150,
        width: 150,
        borderColor: Colors.orange,
        borderWidth: .5,
        margin: 10,
    },
    photoBtn: {
        backgroundColor: Colors.orange,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
        width: 146,
        paddingBottom: 5,
        borderRadius: 5,
        elevation: 5,
        shadowColor: 'black',
        shadowOpacity: .3,
        shadowRadius: 3,
        shadowOffset: {
            width: 0,
            height: 0
        }
    },
    error: {
        textAlign: 'center',
        color: 'red',
        marginTop: 2,
    },
})

export default ReceiptPicker