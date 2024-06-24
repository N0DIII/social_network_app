import { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Image, Pressable, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import { server, serverFile } from '../scripts/server';

import { Context } from '../components/context';
import Input from './input';
import Select from './select';
import Button from './button';
import LoadAvatar from './load_avatar';

export default function CreateGroup(props) {
    const { close, navigation } = props;
    const { setError, userData } = useContext(Context);

    const [avatar, setAvatar] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectCategory, setSelectCategory] = useState([]);

    useEffect(() => {
        server('/getGroupCategories').then(result => setCategories(result.categories));
    }, [])

    function create() {
        serverFile('/createGroup', { userId: userData._id, name, category: selectCategory, description }, [avatar])
        .then(result => {
            if(result.error) setError([true, result.message]);
            else navigation.navigate('group_profile', { id: result.id })
        })
        .catch(e => setError([true, 'Произошла ошибка']))
    }

    return(
        <SafeAreaView style={styles.safe}>
        <BlurView style={styles.wrapper} experimentalBlurMethod='dimezisBlurView' tint='systemMaterialDark' intensity={80}>
            <Pressable style={styles.close_wrapper} onPress={close}>
                <Image style={styles.close} source={require('../assets/cross.png')} />
            </Pressable>

            {userData.confirm &&
            <ScrollView style={styles.scroll} contentContainerStyle={{ paddingVertical: '50%' }}>
                <View style={styles.block}>
                <LoadAvatar value={require('../assets/defaultGroup.png')} setValue={setAvatar} />
                </View>

                <View style={styles.block}>
                    <Input value={name} setValue={setName} placeholder='Название группы' />
                </View>

                <View style={styles.block}>
                    <Select
                        data={categories.map(item => { return { value: item.name, text: item.name } })}
                        setValue={setSelectCategory}
                        title='Категория'
                    />
                </View>

                <View style={styles.block}>
                    <Input value={description} setValue={setDescription} placeholder='Описание' multiline={true} />
                </View>

                <View style={styles.block}>
                    <Button title='Сохранить' onClick={create} />
                </View>
            </ScrollView>}

            {!userData.confirm &&
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 28 }}>Подтвердите адрес электронной почты</Text>
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 28, marginVertical: 20 }}>Профиль → Изменить</Text>
            </View>}
            
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
    },
})