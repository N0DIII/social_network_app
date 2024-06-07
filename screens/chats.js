import { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { server } from '../scripts/server';
import serverUrl from '../scripts/server_url';

import { Context } from '../components/context';
import Background from '../components/background';

export default function Chats({ navigation }) {
    const { userData, setError, socket } = useContext(Context);

    const [chats, setChats] = useState([]);
    const [showButton, setShowButton] = useState(false);
    const [startCreate, setStartCreate] = useState(false);
    const [newChatName, setNewChatName] = useState('');

    useEffect(() => {
        server('/chat/getChats', { id: userData._id }).then(result => setChats([...result.filter(chat => chat.notify != 0), ...result.filter(chat => chat.notify == 0)]));
    }, [])

    useEffect(() => {
        function chatOnline(id, bool) {
            let chat = chats.find(item => item._id == id && item.type == 'personal');
            if(chat == undefined) return;
            let index = chats.indexOf(chat);
            chat.online = bool;
            setChats([...chats.slice(0, index), chat, ...chats.slice(index + 1, chats.length)]);
        }

        socket.on('userOnline', id => chatOnline(id, true));
        socket.on('userOffline', id => chatOnline(id, false));

        socket.on('newMessage', notify => {
            const updChats = chats.map(chat => {
                if(chat._id == notify.chat) {
                    let updChat = chat;
                    updChat.notify = notify.count;
                    return updChat;
                }
                else return chat;
            })
            setChats([...updChats.filter(chat => chat.notify != 0), ...updChats.filter(chat => chat.notify == 0)]);
        })

        socket.on('createdChat', chat => {
            server('/chat/getChat', { chatID: chat, userID: id }).then(result => setChats([...chats, result]));
            socket.emit('joinChat', chat);
        })

        return () => {
            socket.off('userOnline');
            socket.off('userOffline');
            socket.off('newMessage');
            socket.off('createdChat');
        }
    }, [chats])

    function createPublicChat() {
        socket.emit('createPublicChat', { user: id, name: newChatName.value });
        socket.on('createPublicChat', result => {
            if(result.error) setError([true, result.message]);
            else {
                setShowButton(false);
                setStartCreate(false);
                navigate(`/chat/${result.id}`);
            }
        })
    }

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
                        <View>
                            <Image style={styles.avatar} source={{ uri: serverUrl + item.avatar }} />
                            {item.online && <View style={styles.status}></View>}
                        </View>
                        <Text style={styles.name}>{item.name}</Text>
                        {item.notify != undefined && item.notify != 0 && <Text style={styles.notify}>{item.notify}</Text>}
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
        flexDirection: 'row',
        gap: 10,
        width: '95%',
        height: 80,
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#26282E',
        borderRadius: 20,
        alignSelf: 'center',
        marginVertical: 10,
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

    status: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        borderRadius: 200,
        width: 6,
        height: 6,
        backgroundColor: 'green',
    },

    notify: {

    }
})