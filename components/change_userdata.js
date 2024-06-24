import { useState, useContext } from 'react';
import { StyleSheet, View, Image, Pressable, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import { server, serverFile } from '../scripts/server';
import serverUrl from '../scripts/server_url';

import { Context } from '../components/context';
import Input from './input';
import Select from './select';
import DatePicker from './datepicker';
import Button from './button';
import LoadAvatar from './load_avatar';

export default function ChangeUserData(props) {
    const { close, deleteAcc } = props;
    const { userData, setUserData, setError, setConfirm } = useContext(Context);

    const [avatar, setAvatar] = useState('');
    const [username, setUsername] = useState(userData.username);
    const [email, setEmail] = useState(userData.email);
    const [birthday, setBirthday] = useState(userData?.birthday != undefined ? userData.birthday : '3000-01-01');
    const [sex, setSex] = useState(userData?.sex != undefined ? userData.sex : '');
    const [stage, setStage] = useState(0);
    const [code, setCode] = useState('');

    function save() {
        serverFile('/changeUser', { userId: userData._id, username, email, sex, birthday, oldAvatar: userData.avatar }, [avatar])
        .then(result => {
            if(result.error) setError([true, result.message]);
            else {
                setUserData(prevState => { return { ...prevState, username, sex, birthday, avatar: result.avatar != undefined ? result.avatar : prevState.avatar, email, confirm: email == userData.email ? userData.confirm : false } });
                close();
            }
        })
        .catch(e => setError([true, 'Произошла ошибка']))
    }

    function confirmEmail() {
        if(stage == 0) {
            server('/getConfirmCode', { email: userData.email })
            .then(result => {
                if(result.error) setError([true, result.message]);
                else setStage(1);
            })
        }
        else {
            server('/checkConfirmCode', { email: userData.email, code, userId: userData._id })
            .then(result => {
                if(result.error) setError([true, result.message]);
                else setUserData(prevState => { return { ...prevState, confirm: true } });
            })
        }
    }

    return(
        <SafeAreaView style={styles.safe}>
        <BlurView style={styles.wrapper} experimentalBlurMethod='dimezisBlurView' tint='systemMaterialDark' intensity={80}>
            <Pressable style={styles.close_wrapper} onPress={close}>
                <Image style={styles.close} source={require('../assets/cross.png')} />
            </Pressable>

            <ScrollView style={styles.scroll} contentContainerStyle={{ paddingVertical: '50%' }}>
                <View style={styles.block}>
                    <LoadAvatar value={{ uri: `${serverUrl}/users/${userData._id}/avatar/${userData.avatar}` }} setValue={setAvatar} />
                </View>

                <View style={styles.block}>
                    <Input value={username} setValue={setUsername} placeholder='Имя пользователя' />
                </View>

                <View style={styles.block}>
                    <Input value={email} setValue={setEmail} placeholder='Электронная почта' />
                    {!userData.confirm && <Text style={{ color: 'red', textAlign: 'center' }}>Электронная почта не подтверждена</Text>}
                    {userData.confirm && <Text style={{ color: 'green', textAlign: 'center' }}>Электронная почта подтверждена</Text>}
                </View>

                {!userData.confirm && stage == 1 &&
                <View style={styles.block}>
                    <Input value={code} setValue={setCode} placeholder='Введите код' />
                </View>}

                {!userData.confirm &&
                <View style={styles.block}>
                    <Button title={stage == 0 ? 'Получить код подтверждения' : 'Подтвердить'} onClick={confirmEmail} />
                </View>}

                <View style={styles.block}>
                    <Select data={[{ value: 'м', text: 'Мужской' }, { value: 'ж', text: 'Женский' }]} defaultValue={{ value: sex, text: sex == 'м' ? 'Мужской' : 'Женский' }} setValue={setSex} title='Пол' />
                </View>

                <View style={styles.block}>
                    <DatePicker title='Дата рождения' value={new Date(birthday)} setValue={setBirthday} />
                </View>

                <View style={styles.block}>
                    <Button title='Сохранить' onClick={save} />
                </View>

                <View style={styles.block}>
                    <Button title='Удалить аккаунт' onClick={() => setConfirm([true, deleteAcc, []])} />
                </View>
            </ScrollView>
            
        </BlurView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },

    scroll: {
        width: '100%',
        height: '100%',
        paddingHorizontal: 20,
    },
    
    wrapper: {
        height: '106%',
        width: '100%',
    },

    close_wrapper: {
        paddingHorizontal: 8,
        alignSelf: 'flex-end',
    },

    close: {
        height: 35,
        width: 35,
    },

    block: {
        marginVertical: 8,
    }
})