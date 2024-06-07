import { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { server, serverFile } from '../scripts/server';
import serverUrl from '../scripts/server_url';

import { Context } from '../components/context';
import Background from '../components/background';
import NewMessage from '../components/new_message';

export default function Chat({ route }) {
    const { id } = route.params;
    const { userData, setError, socket } = useContext(Context);

    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [editedMessage, setEditedMessage] = useState();
    const [showChatMenu, setShowChatMenu] = useState({left: '100vw'});
    const [showFullscreenImage, setShowFullscreenImage] = useState(false);
    const [selectImage, setSelectImage] = useState();
    const [showInvite, setShowInvite] = useState(false);

    const [count, setCount] = useState(0);
    const [maxCount, setMaxCount] = useState(1);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        setNewMessage('');
        getChat(id);
        setCount(0);
        setMaxCount(1);
        setFetching(true);
    }, [userData, id])

    useEffect(() => {
        socket.on('getMessage', message => {
            if(id == message.chat) {
                setMessages([message, ...messages]);
                socket.emit('readChat', { chatID: id, userID: userData._id });
            }
        })

        socket.on('deleteMessage', ({ id }) => {
            setMessages(messages.filter(message => message._id != id));
        })

        socket.on('editMessage', editedMessage => {
            let updMessages = messages;
            for(let i = 0; i < messages.length; i++) {
                if(messages[i]._id == editedMessage._id) {
                    updMessages.splice(i, 1, editedMessage);
                    break;
                }
            }

            setMessages([...updMessages]);
        })

        return () => {
            socket.off('getMessage');
            socket.off('deleteMessage');
            socket.off('editMessage');
        }
    }, [messages, id])

    useEffect(() => {
        if(fetching) {
            server('/chat/getMessages', { chatID: id, count })
            .then(result => {
                if(count != 0) setMessages([...messages, ...result.messages]);
                else setMessages(result.messages);

                setCount(prevState => prevState + 1);
                setMaxCount(result.maxCount);
            })

            setFetching(false);
        }
    }, [fetching])

    const scroll = useCallback(() => {
        if(messages == null) return;

        if(messages.length < maxCount) {
            setFetching(true);
        }
    }, [maxCount, messages])

    function getChat(id) {
        server('/chat/getChat', { chatID: id, userID: userData._id })
        .then(result => {
            if(!result.error) {
                setChat(result);
                socket.emit('readChat', { chatID: id, userID: userData._id });
            }
            else setError([true, result.message]);
        })
    }

    function sendMessage() {
        if(newMessage.trim() == '') return;

        if(!isEdit) socket.emit('sendMessage', { user: userData._id, chat: id, text: newMessage });
        else {
            socket.emit('editMessage', { text: newMessage, message: editedMessage, chat: id });
            setIsEdit(false);
        }

        setNewMessage('');
    }

    function sendFile(e, close, url) {
        close(false);

        if(e.target.files && e.target.files[0]) {
            serverFile('/chat/' + url, { user: userData._id, chat: id }, [e.target.files[0]])
            .then(result => {
                if(result.error) setError([true, result.message]);
                else socket.emit('sendFile', result);
            })
        }
    }

    function deleteMessage(message, filename) {
        socket.emit('deleteMessage', { message, chat: id, filename });
    }

    function editMessage(id, text) {
        setIsEdit(true);
        setEditedMessage(id);
        setNewMessage(text);
    }

    return(
        <SafeAreaView style={styles.screen}>
            <Background />

            <NewMessage
                value={newMessage}
                setValue={setNewMessage}
                sendMessage={sendMessage}
                sendFile={sendFile}
                placeholder='Новое сообщение'
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },

    
})