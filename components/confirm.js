import { useContext } from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';

import { Context } from './context';
import Button from './button';

export default function Confirm() {
    const { confirm, setConfirm } = useContext(Context);

    function conf() {
        confirm[1](...confirm[2]);
        close();
    }

    function close() {
        setConfirm([false]);
    }

    if(confirm[0]) {
        return(
            <View style={styles.wrapper}>
                <Pressable style={styles.cross_wrapper} onPress={close}>
                    <Image style={styles.cross} source={require('../assets/cross.png')} />
                </Pressable>

                <Text style={styles.text}>Вы уверены?</Text>
                <Button title='Продолжить' onClick={conf} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 20,
        paddingRight: 35,
        padding: 20,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#26282E',
        width: '80%',
    },

    text: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 10,
    },

    cross_wrapper: {
        position: 'absolute',
        right: 5,
        top: 5,
    },

    cross: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
    }
})