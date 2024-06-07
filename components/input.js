import { StyleSheet, View, TextInput } from 'react-native';

export default function Input(props) {
    const { value, setValue, placeholder = '', multiline = false } = props;

    return(
        <View style={styles.wrapper}>
            <TextInput 
                style={styles.input}
                placeholder={placeholder}
                defaultValue={value}
                onChangeText={text => setValue(text)}
                placeholderTextColor='#949AAF'
                multiline={multiline}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        minHeight: 45,
        width: '100%',
        borderRadius: 20,
        borderColor: 'white',
        backgroundColor: '#353941',
        paddingLeft: 10,
        justifyContent: 'center',
    },

    input: {
        padding: 8,
        fontSize: 20,
        color: 'white',
    },
})