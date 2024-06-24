import { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Text, Image } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

export default function DatePicker(props) {
    const { title, value, setValue } = props;

    const [text, setText] = useState();

    useEffect(() => {
        setText(value.getTime() == new Date('3000-01-01').getTime() ? title : formatDate(value));
    }, [value])

    const formatDate = (rawDate) => {
        let date = new Date(rawDate);

        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;
        return `${year}-${month}-${day}`;
    }

    const showDate = () => {
        DateTimePickerAndroid.open({
            value,
            onChange,
            mode: 'date',
            maximumDate: new Date(new Date().getFullYear() - 5, 0, 1),
            minimumDate: new Date(1900, 0, 1)
        })
    }

    const onChange = (event, selectedDate) => {
        if(event.type == 'set') {
            const currentDate = formatDate(selectedDate);
            setValue(new Date(currentDate));
            setText(currentDate);
        }
    }

    return(
        <View style={styles.wrapper}>
            <Pressable onPress={showDate}>
                <View style={styles.input}>
                    <Text style={styles.text}>{text}</Text>
                    <Image style={styles.icon} source={require('../assets/calendar.png')} />
                </View>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        height: 45,
        width: '100%',
        borderRadius: 20,
        borderColor: 'white',
        backgroundColor: '#353941',
        paddingLeft: 10,
        justifyContent: 'center',
    },

    input: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
    },

    text: {
        color: '#949AAF',
        fontSize: 20,
    },

    icon: {
        width: 25,
        height: 25,
    }
})