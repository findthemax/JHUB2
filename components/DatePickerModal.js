import React, {useState, useEffect} from 'react';
import {View, Button, StyleSheet, Modal} from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";

const DatePickerModal = ({visibility, updateDate, date, close}) => {

    const [tempDate, setTempDate] = useState(date)

    useEffect(() => {
        setTempDate(date)
    }, [date])

    return (
        <Modal visible={visibility} animationType="slide">
            <View style={{width: '100%', flex: 1, justifyContent: 'center'}}>
                <DateTimePicker
                    testID="dateTimePicker"
                    value={tempDate}
                    mode='date'
                    display="calendar"
                    onChange={(e, newDate) => {
                        setTempDate(newDate)
                    }}
                    maximumDate={new Date()}
                />
                <View style={styles.btnContainer}>
                    <Button title="Cancel" color="red" onPress={() => close}/>
                    <Button title="Set" onPress={() => {
                        updateDate(tempDate)
                        close()
                    }}/>
                </View>
            </View>

        </Modal>
    );
}


export default DatePickerModal;

const styles = StyleSheet.create({
    btnContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
})
