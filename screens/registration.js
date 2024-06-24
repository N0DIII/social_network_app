import { useState, useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { serverFile } from '../scripts/server';
import auth from '../scripts/auth';

import { Context } from '../components/context';
import Background from '../components/background';
import Input from '../components/input';
import InputPassword from '../components/inputPassword';
import Button from '../components/button';
import LoadAvatar from '../components/load_avatar';

export default function Registration({ navigation }) {
    const { setUserData, setError } = useContext(Context);

    const [avatar, setAvatar] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    function reg() {
        serverFile('/registration', { username, email, password, repeatPassword }, [avatar])
        .then(result => {
            if(result.errors) setError([true, result.errors[0].message]);
            else if(result.error) setError([true, result.message]);
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
                <LoadAvatar value={require('../assets/defaultAvatar.png')} setValue={setAvatar} />
                <Input value={username} setValue={setUsername} placeholder='Имя пользователя' />
                <Input value={email} setValue={setEmail} placeholder='Электронная почта' />
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