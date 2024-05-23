import { useState, useContext } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { server } from '../scripts/server';
import serverUrl from '../scripts/server_url';

import { Context } from '../components/context';
import Background from '../components/background';
import Input from '../components/input';
import InputPassword from '../components/inputPassword';
import Button from '../components/button';
import Search from '../components/search';

export default function Profile({ navigation }) {
    const { userData, setError } = useContext(Context);
    console.log(userData)

    const [search, setSearch] = useState('');

    function getAge(date) {
        let nowDate = new Date();
        let birthdayDate = new Date(date);
        let retDate = Math.trunc((nowDate - birthdayDate) / 31622400000);
        let lastNum = Number(String(retDate)[String(retDate).length - 1]);

        return retDate + (lastNum > 0 && lastNum < 4 ? ' года' : ' лет');
    }

    async function signOut() {
        await AsyncStorage.removeItem('token');
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }

    return(
        <SafeAreaView style={styles.screen}>
            <Background />

            <Search setValue={setSearch} />

            <View>
                <Image style={styles.avatar} source={{ uri: `${serverUrl}/users/${userData._id}/avatar.png?time=${new Date().getMinutes()}` }} />

                <Text style={styles.text}>{userData.username}{userData?.sex != undefined ? `, ${userData.sex}` : ''}</Text>
                {userData?.birthday != undefined && <Text style={styles.text}>{getAge(userData.birthday)}</Text>}

                <View style={styles.buttons}>
                    <Button title='Изменить' />
                    <Button title='Выйти' onClick={signOut} />
                </View>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 60,
    },

    avatar: {
        height: 250,
        width: 250,
        borderRadius: 200,
    },

    text: {
        color: 'white',
        fontSize: 30,
        marginVertical: 20,
    },

    buttons: {
        gap: 15,
    }
})