import { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image, TextInput } from 'react-native';

export default function NewMessage(props) {
    const { value, setValue, sendMessage, sendFile, placeholder } = props;

    const [showFileMenu, setShowFileMenu] = useState(false);

    return(
        <View style={styles.wrapper}>
            <View style={styles.new_message}>
                <Pressable>
                    <Image style={styles.image} source={require('../assets/clip.png')} />
                </Pressable>
                <TextInput style={styles.input} defaultValue={value} onChangeText={setValue} placeholder={placeholder} placeholderTextColor='#949AAF' multiline />
                <Pressable>
                    <Image style={styles.image} source={require('../assets/send.png')} />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 0,
        padding: 10,
        width: '100%',
    },

    new_message: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 40,
        backgroundColor: '#26282E',
        borderRadius: 20,
        paddingHorizontal: 10,
    },

    image: {
        width: 30,
        height: 30,
    },

    input: {
        width: '75%',
        fontSize: 18,
        color: 'white',
    }
})