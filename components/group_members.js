import { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Pressable, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import { server } from '../scripts/server';
import serverUrl from '../scripts/server_url';

import Select from './select';

export default function GroupMembers(props) {
    const { id, close } = props;

    const [users, setUsers] = useState(null);

    useEffect(() => {
        server('/getGroupMembers', { groupId: id }).then(result => setUsers(result.members))
    }, [id])

    function changeStatus(value, userId, groupId) {
        server('/changeMemberStatus', { groupId, userId, status: value })
        .then(result => {
            if(result.error) setError([true, result.message]);
            else setUsers(prevState => prevState.map(user => { return { ...user, admin: userId == user._id && value == 'admin' ? true : false } }));
        })
    }

    return(
        <SafeAreaView style={styles.safe}>
        <BlurView style={styles.wrapper} experimentalBlurMethod='dimezisBlurView' tint='systemMaterialDark' intensity={80}>
            <Pressable style={styles.close_wrapper} onPress={close}>
                <Image style={styles.close} source={require('../assets/cross.png')} />
            </Pressable>

            <FlatList
                style={styles.users}
                data={users}
                keyExtractor={item => item._id}
                renderItem={({ item }) => 
                    <View style={styles.user}>
                        <Image style={styles.avatar} source={{ uri: `${serverUrl}/users/${item._id}/avatar/${item.avatar}` }} />
                        <Text style={styles.username}>{item.username}</Text>
                        <View style={styles.select}>
                            <Select
                                data={[{ value: 'member', text: 'Участник' }, { value: 'admin', text: 'Админ' }]}
                                title='Статус'
                                setValue={changeStatus}
                                defaultValue={item.admin ? { value: 'admin', text: 'Админ' } : { value: 'member', text: 'Участник' }}
                                params={[item._id, id]}
                            />
                        </View>
                    </View>
                }
                ListEmptyComponent={() => 
                    <View>
                        <Text style={styles.noResult}>Нет результатов</Text>
                    </View>
                }
            />
            
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

    users: {
        position: 'absolute',
        left: 0,
        top: 160,
        width: '100%',
    },

    noResult: {
        color: '#949AAF',
        fontSize: 20,
        fontStyle: 'italic',
        textAlign: 'center',
    },

    user: {
        flexDirection: 'row',
        width: '90%',
        height: 80,
        backgroundColor: '#26282E',
        alignItems: 'center',
        borderRadius: 20,
        marginVertical: 10,
        alignSelf: 'center',
    },

    avatar: {
        width: 50,
        height: 50,
        marginHorizontal: 10,
        borderRadius: 200,
    },

    username: {
        color: 'white',
        fontSize: 20,
    },

    select: {
        position: 'absolute',
        right: 10,
        width: '51%',
    }
})