import { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image, Pressable, Text } from 'react-native';
import { A } from '@expo/html-elements';

import serverUrl from '../scripts/server_url';

import { Context } from './context';
import VideoPlayer from './videoplayer';

export default function Message(props) {
    const { userData } = useContext(Context);
    const { message, chatId } = props;

    const [apps, setApps] = useState([]);
    const [files, setFiles] = useState([]);
    const [select, setSelect] = useState(0);

    useEffect(() => {
        setFiles([]);
        setApps([]);

        message.files.forEach(file => {
            if(file.mimetype == 'application') setApps(prevState => [...prevState, { src: `${serverUrl}/chats/${chatId}/${file.src}`, mimetype: file.mimetype, name: file.originalname }]);
            else setFiles(prevState => [...prevState, { src: `${serverUrl}/chats/${chatId}/${file.src}`, mimetype: file.mimetype }]);
        })
    }, [message])

    function getTime(str) {
        const date = new Date(str);

        let hours = date.getHours();
        let minutes = date.getMinutes();

        return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
    }

    return(
        <View style={styles.message_wrapper}>
            <View style={[styles.message, message.user == userData._id ? styles.myMessage : {}]}>
                {files.length != 0 &&
                <View style={styles.images}>
                    {files[select].mimetype == 'image' && <Image style={{ width: 350, height: 200, resizeMode: 'contain' }} source={{ uri: files[select].src }} />}
                    {files[select].mimetype == 'video' &&
                    <View style={{ width: 350, height: 200 }}>
                        <VideoPlayer uri={files[select].src} />
                    </View>}

                    {select > 0 &&
                    <Pressable onPress={() => setSelect(prevState => prevState - 1)} style={{ position: 'absolute', left: 0 }}>
                        <Image source={require('../assets/leftArrow.png')} style={{ width: 40, height: 40 }} />
                    </Pressable>}

                    {select < files.length - 1 &&
                    <Pressable onPress={() => setSelect(prevState => prevState + 1)} style={{ position: 'absolute', right: 0 }}>
                        <Image source={require('../assets/rightArrow.png')} style={{ width: 40, height: 40 }} />
                    </Pressable>}
                </View>}

                <FlatList
                    data={apps}
                    keyExtractor={item => item.src}
                    renderItem={({ item }) => 
                        <View style={styles.file}>
                            <Image source={require('../assets/file.png')} style={{ height: 25, width: 25, resizeMode: 'contain' }} />
                            <A href={item.src} style={{ color: '#949AAF', fontSize: 20, textOverflow: 'ellipsis' }}>{item.name}</A>
                        </View>
                    }
                />

                {message.text != '' && <Text style={styles.text}>{message.text}</Text>}
                <Text style={styles.created}>{message?.edit != undefined && message.edit ? 'изм. ' : ''}{getTime(message.created)}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    images: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    message_wrapper: {
        width: '100%',
    },

    message: {
        maxWidth: '80%',
        minWidth: 100,
        alignSelf: 'flex-start',
        width: 'min-content',
        backgroundColor: '#26282E',
        borderRadius: 10,
        margin: 5,
        overflow: 'hidden',
    },

    myMessage: {
        alignSelf: 'flex-end',
    },

    created: {
        textAlign: 'right',
        paddingRight: 10,
        color: '#949AAF',
        fontSize: 12,
    },

    text: {
        color: 'white',
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 18,
    },

    file: {
        width: '80%',
        marginHorizontal: '10%',
        marginVertical: 5,
        padding: 10,
        flexDirection: 'row',
        gap: 5,
        backgroundColor: '#353941',
        borderRadius: 20,
    }
})