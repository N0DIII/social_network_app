import { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import serverUrl from '../scripts/server_url';

import { Context } from '../components/context';
import Background from '../components/background';

export default function Chats({ navigation }) {
    const { userData, socket } = useContext(Context);

    const [chats, setChats] = useState([]);

    useEffect(() => {
        socket.emit('getChats', { senderId: userData._id });
        socket.on('getChats', chats => setChats(chats));

        return () => {
            socket.off('getChats');
        }
    }, [])

    useEffect(() => {
        if(chats == null || chats.length == 0) return;

        socket.on('userOnline', id => {
            setChats(prevState => prevState.map(chat => { 
                if(chat.type == 'personal' && chat.user._id == id) return { ...chat, user: { ...chat.user, online: true } };
                else return chat;
            }))
        })

        socket.on('userOffline', id => {
            setChats(prevState => prevState.map(chat => { 
                if(chat.type == 'personal' && chat.user._id == id) return { ...chat, user: { ...chat.user, online: false } };
                else return chat;
            }))
        })

        return () => {
            socket.off('userOnline');
            socket.off('userOffline');
        }
    }, [chats])

    return(
        <SafeAreaView style={styles.screen}>
            <Background />

            <FlatList
                style={{ width: '100%' }}
                contentContainerStyle={{ paddingVertical: 50 }}
                data={chats}
                ListEmptyComponent={() => <Text style={{ color: '#949AAF', fontSize: 20, fontStyle: 'italic', textAlign: 'center', marginTop: 300 }}>Нет чатов</Text>}
                renderItem={({ item }) =>
                    <Pressable style={styles.chat} onPress={() => navigation.navigate('Chat', { id: item._id })}>
                        {item.type == 'personal' &&
                        <View style={styles.chat}>
                            <Image style={styles.avatar} source={{ uri: `${serverUrl}/users/${item.user._id}/avatar/${item.user.avatar}` }} />
                            {item.user.online && <View style={styles.online}></View>}
                            <Text style={styles.name}>{item.user.username}</Text>
                        </View>}

                        {item.type == 'public' &&
                        <View style={styles.chat}>
                            <Image style={styles.avatar} source={{ uri: `${serverUrl}/chats/${item._id}/avatar/${item.avatar}` }} />
                            <Text style={styles.name}>{item.name}</Text>
                        </View>}
                    </Pressable>
                }
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    chat: {
        position: 'relative',
        flexDirection: 'row',
        gap: 10,
        width: '95%',
        height: 60,
        alignItems: 'center',
        paddingHorizontal: 5,
        backgroundColor: '#26282E',
        borderRadius: 20,
        alignSelf: 'center',
        marginVertical: 5,
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: 200,
    },

    name: {
        color: 'white',
        fontSize: 20,
    },

    online: {
        position: 'absolute',
        left: 50,
        bottom: 10,
        width: 6,
        height: 6,
        backgroundColor: 'green',
        borderRadius: 200,
    }
})