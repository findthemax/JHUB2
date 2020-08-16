import React from 'react';
import DateTimePicker from "@react-native-community/datetimepicker";

const DatePickerAndroid = ({updateDate, date, close}) => {

    return (
        <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode='date'
            display="calendar"
            onChange={async (e, newDate) => {
                if(e.type === 'set') {
                    await updateDate(newDate)
                }
                await close()
            }}
            maximumDate={new Date()}
        />
    );
}


export default DatePickerAndroid;

