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
        <View>
            <View>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <Image style={styles.icon} source={{ uri: `${serverUrl}/users/${comment.creator._id}/avatar/${comment.creator.avatar}` }} />
                    <Text style={{ color: 'white', fontSize: 18 }}>{comment.creator.username}</Text>
                </View>

                <Text style={{ color: '#949AAF' }}>{comment?.edit != undefined ? 'изм.' : ''} {created(comment.created)}</Text>
            </View>

            <View>
                {files.length != 0 &&
                <View>
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
                        <View>
                            <Image source={require('../assets/file.png')} style={{ height: 35, width: 35, resizeMode: 'contain' }} />
                            <A href={item.src} style={{ color: '#949AAF', fontSize: 20, textOverflow: 'ellipsis' }}>{item.name}</A>
                        </View>
                    }
                />
            </View>

            {comment.text != '' &&
            <View>
                <Text style={{ color: 'white', fontSize: 20 }}>{comment.text}</Text>
            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    
})