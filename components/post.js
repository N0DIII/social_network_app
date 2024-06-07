import { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, Image, Pressable, FlatList } from 'react-native';
import { A } from '@expo/html-elements';

import { server } from '../scripts/server';
import serverUrl from '../scripts/server_url';

import { Context } from '../components/context';
import VideoPlayer from '../components/videoplayer';
import Comments from './comments';

export default function Post(props) {
    const { post, navigation } = props;
    const { userData } = useContext(Context);

    const [files, setFiles] = useState([]);
    const [apps, setApps] = useState([]);
    const [select, setSelect] = useState(0);
    const [textShow, setTextShow] = useState(false);
    const [showChange, setShowChange] = useState(false);
    const [text, setText] = useState(post.text);
    const [newFiles, setNewFiles] = useState([]);
    const [deletedFiles, setDeletedFiles] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [like, setLike] = useState(post.like);
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [commCount, setCommCount] = useState(post.commentCount);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        setFiles([]);
        setApps([]);

        post.files.forEach(file => {
            if(file.mimetype == 'application') setApps(prevState => [...prevState, { src: `${serverUrl}/posts/${post._id}/${file.src}`, mimetype: file.mimetype, name: file.src }]);
            else setFiles(prevState => [...prevState, { src: `${serverUrl}/posts/${post._id}/${file.src}`, mimetype: file.mimetype }]);
        })
    }, [post])

    function created(str) {
        const date = new Date(str);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const hour = date.getHours();
        const minute = date.getMinutes();
        return `${day < 10 ? '0' + day : day}.${month < 9 ? '0' + Number(month + 1) : Number(month + 1)}.${year} ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`;
    }

    function numberRound(num) {
        if(num < 1000) return num;
        else if(num < 1000000) return Number(Math.trunc(num / 1000)) + 'k';
        else return Number(Math.trunc(num / 1000000)) + 'M';
    }

    function likePost() {
        if(!like) server('/likePost', { postId: post._id, senderId: userData._id })
        .then(result => {
            if(result.error) setError([true, result.message]);
            else {
                setLike(true);
                setLikeCount(prevState => prevState + 1);
            }
        })
        else server('/unlikePost', { postId: post._id, senderId: userData._id })
        .then(result => {
            if(result.error) setError([true, result.message]);
            else {
                setLike(false);
                setLikeCount(prevState => prevState - 1);
            }
        })
    }

    function openComments() {
        server('/getComments', { postId: post._id })
        .then(result => {
            if(result.error) setError([true, result.message]);
            else setComments(result.comments);
        })

        setShowComments(true);
    }

    return(
        <View style={[styles.post, showComments ? { height: 600 } : {}]}>
            <View style={styles.post_header}>
                {post.type == 'user' &&
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <Image style={styles.icon} source={{ uri: `${serverUrl}/users/${post.creator._id}/avatar/${post.creator.avatar}` }} />
                    <Text style={{ color: 'white', fontSize: 18 }}>{post.creator.name}</Text>
                </View>}

                {post.type == 'group' &&
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <Image style={styles.icon} source={{ uri: `${serverUrl}/groups/${post.creator._id}/avatar/${post.creator.avatar}` }} />
                    <Text style={{ color: 'white', fontSize: 18 }}>{post.creator.name}</Text>
                </View>}

                <Text style={{ color: '#949AAF' }}>{post?.edit != undefined ? 'изм.' : ''} {created(post.created)}</Text>
            </View>

            <View style={styles.post_main}>
                <View style={styles.post_files}>
                    {files.length != 0 &&
                    <View style={styles.post_images}>
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
                            <View style={styles.app}>
                                <Image source={require('../assets/file.png')} style={{ height: 35, width: 35, resizeMode: 'contain' }} />
                                <A href={item.src} style={{ color: '#949AAF', fontSize: 20, textOverflow: 'ellipsis' }}>{item.name}</A>
                            </View>
                        }
                    />
                </View>

                {post.text != '' && !textShow &&
                <View style={styles.text_wrapper}>
                    {post.text.split('\n').length == 1 && post.text.length > 100 ? <Text style={{ color: 'white', fontSize: 20 }}>{post.text.slice(0, 100)}</Text> : <Text style={{ color: 'white', fontSize: 20 }}>{post.text.split('\n')[0]}</Text>}
                    {(post.text.split('\n').length > 1 || post.text.length > 100) &&
                    <Pressable style={{ flexDirection: 'row', marginTop: 15 }} onPress={() => setTextShow(true)}>
                        <Text style={{ color: '#8551FF' }}>Показать полностью</Text><Image style={{ width: 20, height: 20 }} source={require('../assets/arrowDown.png')} />
                    </Pressable>}
                </View>}

                {post.text != '' && textShow &&
                <View style={styles.text_wrapper}>
                    <Text style={{ color: 'white', fontSize: 20 }}>{post.text}</Text>
                    <Pressable style={{ flexDirection: 'row', marginTop: 15 }} onPress={() => setTextShow(false)}>
                        <Text style={{ color: '#8551FF' }}>Скрыть</Text><Image style={{ transform: 'rotate(180deg)', width: 20, height: 20 }} source={require('../assets/arrowDown.png')} />
                    </Pressable>
                </View>}

                <View style={styles.post_footer}>
                    <Pressable style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }} onPress={likePost}>
                        <Image style={styles.icon} source={!like ? require('../assets/whiteLike.png') : require('../assets/redLike.png')} />
                        <Text style={{ color: 'white', fontSize: 18 }}>{numberRound(likeCount)}</Text>
                    </Pressable>
                    <Pressable style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }} onPress={openComments}>
                        <Image style={styles.icon} source={require('../assets/comments.png')} />
                        <Text style={{ color: 'white', fontSize: 18 }}>{numberRound(commCount)}</Text>
                    </Pressable>
                </View>
            </View>

            {showComments &&
            <Comments
                close={() => setShowComments(false)}
                comments={comments}
                setComments={setComments}
                openComments={openComments}
            />}
        </View>
    )
}

const styles = StyleSheet.create({
    post: {
        backgroundColor: '#25282E',
        borderRadius: 20,
        overflow: 'hidden',
        marginVertical: 10,
        width: '100%',
    },

    post_header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 40,
        backgroundColor: '#353941',
    },

    icon: {
        width: 30,
        height: 30,
        borderRadius: 200,
    },

    text_wrapper: {
        margin: 20,
    },

    post_footer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 40,
        backgroundColor: '#353941',
        gap: 10,
    },

    post_images: {
        position: 'relative',
        justifyContent: 'center',
        width: '100%',
        height: 200,
    },

    app: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: '#353941',
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 5,
        alignItems: 'center',
        paddingHorizontal: 10,
        gap: 5,
    }
})