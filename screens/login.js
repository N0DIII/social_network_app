import { useState, useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { server } from '../scripts/server';
import auth from '../scripts/auth';

import { Context } from '../components/context';
import Background from '../components/background';
import Input from '../components/input';
import InputPassword from '../components/inputPassword';
import Button from '../components/button';

export default function Login({ navigation }) {
    const { setUserData, setError } = useContext(Context);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function sign() {
        server('/login', { email, password })
        .then(result => {
            if(result.error || result?.field != undefined) setError([true, result.message]);
            else {
                AsyncStorage.setItem('token', result.token);
                auth(result.token).then(result => {
                    setUserData(result);
                    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
                })
            }
        })
    }

    return(
        <View style={styles.screen}>
            <Background />

            <View style={styles.form_wrapper}>
                <Text style={styles.title}>Вход</Text>
                <Input value={email} setValue={setEmail} placeholder='Электронная почта' />
                <InputPassword value={password} setValue={setPassword} placeholder='Пароль' />
                <Button title='Войти' onClick={sign} />
                <Text style={styles.text}>Еще нет аккаунта? <Text style={styles.text} onPress={() => navigation.navigate('Registration')}>Создать</Text></Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    form_wrapper: {
        width: '90%',
        alignItems: 'center',
        gap: 15,
    },

    title: {
        color: 'white',
        fontSize: 30,
    },

    text: {
        color: 'white',
        fontSize: 20,
    }
})