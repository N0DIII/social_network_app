import { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Image, FlatList, Text } from 'react-native';
import { A } from '@expo/html-elements';

import serverUrl from '../scripts/server_url';

export default function Comment(props) {
    const { comment } = props;

    const [files, setFiles] = useState([]);
    const [apps, setApps] = useState([]);
    const [select, setSelect] = useState(0);

    useEffect(() => {
        setFiles([]);
        setApps([]);

        comment.files.forEach(file => {
            if(file.mimetype == 'application') setApps(prevState => [...prevState, { src: `${serverUrl}/posts/${comment.post}/comments/${comment._id}/${file.src}`, mimetype: file.mimetype, name: file.originalname }]);
            else setFiles(prevState => [...prevState, { src: `${serverUrl}/posts/${comment.post}/comments/${comment._id}/${file.src}`, mimetype: file.mimetype }]);
        })
    }, [comment])

    function created(str) {
        const date = new Date(str);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const hour = date.getHours();
        const minute = date.getMinutes();
        return `${day < 10 ? '0' + day : day}.${month < 9 ? '0' + Number(month + 1) : Number(month + 1)}.${year} ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`;
    }

    return(
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <Image style={styles.avatar} source={{ uri: `${serverUrl}/users/${comment.user}/avatar/${comment.creator.avatar}` }} />
                    <Text style={{ color: 'white', fontSize: 18 }}>{comment.creator.username}</Text>
                </View>

                <Text style={{ color: '#949AAF' }}>{comment?.edit != undefined ? 'изм.' : ''} {created(comment.created)}</Text>
            </View>

            <View>
                {files.length != 0 &&
                <View style={styles.images}>
                    {files[select].mimetype == 'image' && <Image style={{ height: 200, resizeMode: 'contain' }} source={{ uri: files[select].src }} />}
                    {files[select].mimetype == 'video' && <VideoPlayer uri={files[select].src} />}

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
            </View>

            {comment.text != '' &&
            <View style={styles.text}>
                <Text style={{ color: 'white', fontSize: 20 }}>{comment.text}</Text>
            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#26282E',
        marginVertical: 5,
        borderRadius: 20,
        overflow: 'hidden',
    },

    header: {
        width: '100%',
        height: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        backgroundColor: '#353941',
    },

    avatar: {
        width: 20,
        height: 20,
        resizeMode: 'cover',
        borderRadius: 200,
    },

    text: {
        margin: 10,
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
    },

    images: {
        justifyContent: 'center',
    }
})