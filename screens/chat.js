import { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, FlatList, View, Text, Image, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import { server, serverFile } from '../scripts/server';
import serverUrl from '../scripts/server_url';

import { Context } from '../components/context';
import Background from '../components/background';
import ImageInput from '../components/image_input';
import Message from '../components/message';
import TimeAgo from '../components/timeago';
import ChatMenu from '../components/chat_menu';

export default function Chat({ route }) {
    const { id } = route.params;
    const { userData, setError, socket } = useContext(Context);

    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [newFiles, setNewFiles] = useState([]);
    const [showFiles, setShowFiles] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [blockSend, setBlockSend] = useState(false);

    const [count, setCount] = useState(0);
    const [maxCount, setMaxCount] = useState(1);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        setNewMessage('');
        setCount(0);
        setMaxCount(1);
        setFetching(true);

        socket.emit('joinChat', { chatId: id });

        socket.emit('getChat', { senderId: userData._id, chatId: id });
        socket.on('getChat', chat => {
            setChat(chat);
            socket.off('getChat');
        })

        socket.on('getMessage', message => {
            setMessages(prevState => [message, ...prevState]);
        })

        socket.on('changeMessage', message => {
            setMessages(prevState => prevState.map(item => {
                if(item._id == message._id) return message;
                else return item;
            }))
        })

        socket.on('deleteMessage', id => {
            setMessages(prevState => prevState.filter(item => item._id != id));
        })

        return () => {
            socket.off('getMessage');
            socket.off('changeMessage');
            socket.off('deleteMessage');
        }
    }, [id])

    useEffect(() => {
        if(chat == null || chat.type == 'public') return;

        socket.on('userOnline', id => { 
            if(chat.user._id == id) setChat(prevState => { return { ...prevState, user: { ...prevState.user, online: true } } });
        })

        socket.on('userOffline', id => { 
            if(chat.user._id == id) setChat(prevState => { return { ...prevState, user: { ...prevState.user, online: false, last_online: new Date() } } });
        })

        return () => {
            socket.off('userOnline');
            socket.off('userOffline');
        }
    }, [chat])

    useEffect(() => {
        if(fetching) {
            server('/getMessages', { chatId: id, count })
            .then(result => {
                if(count != 0) setMessages([...messages, ...result.messages]);
                else setMessages(result.messages);

                setCount(prevState => prevState + 1);
                setMaxCount(result.maxCount);
                setFetching(false);
            })
        }
    }, [fetching])

    const scroll = useCallback(() => {
        if(messages == null) return;

        if(messages.length < maxCount) {
            setFetching(true);
        }
    }, [maxCount, messages])

    function sendMessage() {
        if((newMessage.trim() == '' && newFiles.length == 0) || blockSend) return;
        setBlockSend(true);

        serverFile('/createMessage', { senderId: userData._id, chatId: id, text: newMessage }, newFiles)
        .then(result => {
            if(result.error) setError([true, result.message]);
            else {
                socket.emit('sendMessage', { messageId: result.id, chatId: id });
                setNewMessage('');
                setShowFiles(false);
                setNewFiles([]);
                setBlockSend(false);
            }
        })
    }

    return(
        <SafeAreaView style={styles.screen}>
            <Background />

            <FlatList
                contentContainerStyle={{ paddingVertical: 50 }}
                inverted={true}
                data={messages}
                keyExtractor={item => item._id}
                renderItem={({ item }) => <Message message={item} chatId={id} />}
                onStartReachedThreshold={0.25}
                onStartReached={scroll}
            />

            {chat != null &&
            <BlurView style={styles.header} experimentalBlurMethod='dimezisBlurView' tint='systemMaterialDark' intensity={80}>
                {chat.type == 'personal' &&
                <View style={styles.info}>
                    <Image style={styles.avatar} source={{ uri: `${serverUrl}/users/${chat.user._id}/avatar/${chat.user.avatar}` }} />
                    <Text style={[styles.name, { position: 'absolute', left: 45, top: 5 }]}>{chat.user.username}</Text>
                    {chat.user.online && <Text style={styles.time}>В сети</Text>}
                    {!chat.user.online && <TimeAgo style={styles.time} date={chat.user.last_online} />}
                </View>}

                {chat.type == 'public' &&
                <View style={styles.info}>
                    <Image style={styles.avatar} source={{ uri: `${serverUrl}/chats/${chat._id}/avatar/${chat.avatar}` }} />
                    <Text style={styles.name}>{chat.name}</Text>
                </View>}

                <Pressable onPress={() => setShowMenu(true)}>
                    <Image style={styles.icon} source={require('../assets/menu.png')} />
                </Pressable>
            </BlurView>}

            <BlurView style={styles.newMessage} experimentalBlurMethod='dimezisBlurView' tint='systemMaterialDark' intensity={80}>
                <Pressable onPress={() => setShowFiles(!showFiles)}>
                    <Image style={styles.icon} source={require('../assets/clip.png')} />
                </Pressable>
                <TextInput style={styles.input} value={newMessage} onChangeText={setNewMessage} placeholder='Новое сообщение' placeholderTextColor='#949AAF' />
                <Pressable onPress={sendMessage}>
                    <Image style={styles.icon} source={require('../assets/send.png')} />
                </Pressable>
            </BlurView>

            {showFiles &&
            <BlurView style={styles.files} experimentalBlurMethod='dimezisBlurView' tint='systemMaterialDark' intensity={80}>
                <ImageInput setValue={setNewFiles} />
            </BlurView>}

            {showMenu && <ChatMenu chatId={id} close={() => setShowMenu(false)} />}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },

    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 90,
        paddingTop: 45,
        paddingHorizontal: 5,
    },

    info: {
        position: 'relative',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },

    avatar: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
        borderRadius: 200,
    },

    name: {
        color: 'white',
        fontSize: 18,
    },

    time: {
        color: '#949AAF',
        position: 'absolute',
        bottom: 5,
        left: 45,
    },

    icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },

    newMessage: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 10,
    },

    input: {
        width: '75%',
        height: 45,
        fontSize: 16,
        color: 'white',
    },

    files: {
        position: 'absolute',
        bottom: 45,
        width: '100%',
    }
})