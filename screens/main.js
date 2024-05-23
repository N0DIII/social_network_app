import { useState, useEffect, useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { Context } from '../components/context';
import Background from '../components/background';
import Input from '../components/input';

export default function Main() {
    const { userData } = useContext(Context);

    const [input, setInput] = useState('');

    useEffect(() => {
        console.log(userData)
    }, [])

    return(
        <View style={styles.screen}>
            <Background />

            <Input value={input} setValue={setInput} placeholder='text' />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})