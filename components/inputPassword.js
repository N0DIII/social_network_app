import { useState } from 'react';
import { StyleSheet, View, TextInput, Image, Pressable } from 'react-native';

export default function InputPassword(props) {
    const { value, setValue, placeholder } = props;

    const [secure, setSecure] = useState(true);

    return(
        <View style={styles.wrapper}>
            <TextInput 
                style={styles.input}
                placeholder={placeholder}
                defaultValue={value}
                onChangeText={text => setValue(text)}
                placeholderTextColor='#949AAF'
                secureTextEntry={secure}
            />
            <Pressable style={styles.icon_wrapper} onPress={() => setSecure(!secure)}>
                <Image
                    style={styles.icon}
                    source={secure ? require('../assets/eye.png') : require('../assets/crossedEye.png')}
                />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        width: '100%',
        borderRadius: 20,
        borderColor: 'white',
        backgroundColor: '#353941',
        paddingLeft: 10,
        justifyContent: 'center',
    },

    input: {
        padding: 8,
        paddingRight: 60,
        fontSize: 20,
        color: 'white',
    },

    icon_wrapper: {
        position: 'absolute',
        right: 15,
    },

    icon: {
        height: 35,
        width: 35,
        resizeMode: 'contain',
    }
})