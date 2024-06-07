import { useContext, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';

import { Context } from '../components/context';

export default function Success() {
    const { success, setSuccess } = useContext(Context);

    const timer = useRef(null);

    useEffect(() => {
        if(!success[0]) return;
        if(timer.current) clearTimeout(timer.current);

        timer.current = setTimeout(() => {
            setSuccess([false, '']);
        }, 5000)
    }, [success])

    function close() {
        clearTimeout(timer.current);
        setSuccess([false, '']);
    }

    if(success[0]) {
        return(
            <View style={styles.wrapper}>
                <Pressable style={styles.cross_wrapper} onPress={close}>
                    <Image style={styles.cross} source={require('../assets/cross.png')} />
                </Pressable>
                <Text style={styles.text}>{success[1]}</Text>
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
    },

    text: {
        color: 'white',
        fontSize: 20,
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