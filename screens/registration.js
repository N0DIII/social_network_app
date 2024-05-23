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

export default function Registration({ navigation }) {
    const { setUserData, setError } = useContext(Context);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    function reg() {
        server('/auth/registration', { username, password, repeatPassword })
        .then(result => {
            if(result.error) setError([true, result.message]);
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
                <Text style={styles.title}>Регистрация</Text>
                <Input value={username} setValue={setUsername} placeholder='Имя пользователя' />
                <InputPassword value={password} setValue={setPassword} placeholder='Пароль' />
                <InputPassword value={repeatPassword} setValue={setRepeatPassword} placeholder='Повторите пароль' />
                <Button title='Зарегистрироваться' onClick={reg} />
                <Text style={styles.text}>Уже есть аккаунт? <Text style={styles.text} onPress={() => navigation.navigate('Login')}>Войти</Text></Text>
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