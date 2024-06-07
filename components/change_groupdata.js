import { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Image, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import { server, serverFile } from '../scripts/server';
import serverUrl from '../scripts/server_url';

import { Context } from '../components/context';
import Input from './input';
import Select from './select';
import Button from './button';
import LoadAvatar from './load_avatar';

export default function ChangeGroupData(props) {
    const { close, group, setGroup, deleteGroup } = props;
    const { setError, setConfirm } = useContext(Context);

    const [avatar, setAvatar] = useState('');
    const [name, setName] = useState(group.name);
    const [description, setDescription] = useState(group.description);
    const [categories, setCategories] = useState([]);
    const [selectCategory, setSelectCategory] = useState(group.categories);

    useEffect(() => {
        server('/getGroupCategories').then(result => setCategories(result.categories));
    }, [])

    function save() {
        serverFile('/changeGroup', { groupId: group._id, name, category: selectCategory, description, oldAvatar: group.avatar }, [avatar])
        .then(result => {
            if(result.error) setError([true, result.message]);
            else {
                setGroup(prevState => { return { ...prevState, name, category: selectCategory, description, avatar: result.avatar != undefined ? result.avatar : prevState.avatar } });
                close();
            }
        })
        .catch(e => setError([true, 'Произошла ошибка']))
    }

    return(
        <SafeAreaView style={styles.safe}>
        <BlurView style={styles.wrapper} experimentalBlurMethod='dimezisBlurView' tint='dark' intensity={20}>
            <Pressable style={styles.close_wrapper} onPress={close}>
                <Image style={styles.close} source={require('../assets/cross.png')} />
            </Pressable>

            <ScrollView style={styles.scroll} contentContainerStyle={{ paddingVertical: '50%' }}>
                <View style={styles.block}>
                    <LoadAvatar value={{ uri: `${serverUrl}/groups/${group._id}/avatar/${group.avatar}` }} setValue={setAvatar} />
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
                    <Button title='Сохранить' onClick={save} />
                </View>

                <View style={styles.block}>
                    <Button title='Удалить группу' onClick={() => setConfirm([true, deleteGroup, []])} />
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
    },
})