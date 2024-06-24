import { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, View, Text, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { server } from '../scripts/server';
import serverUrl from '../scripts/server_url';

import { Context } from '../components/context';
import Background from '../components/background';
import Button from '../components/button';
import Search from '../components/search';
import Post from '../components/post';
import AlbumList from '../components/albumlist';
import Comments from '../components/comments';

export default function UserProfile({ route, navigation }) {
    const { id } = route.params;
    const { userData, setError, setConfirm, socket } = useContext(Context);

    const [user, setUser] = useState(null);
    const [albums, setAlbums] = useState(null);
    const [friendStatus, setFriendStatus] = useState(0);
    
    const [search, setSearch] = useState('');
    const [posts, setPosts] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [postId, setPostId] = useState();

    const [count, setCount] = useState(0);
    const [maxCount, setMaxCount] = useState(1);
    const [fetching, setFetching] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        getData();
    }, [userData, id])

    function getData() {
        server('/getUser', { userId: id })
        .then(result => {
            if(result.error) navigation('Друзья');
            else {
                setUser(result.user);

                if(result.user.friends.includes(userData._id)) setFriendStatus(3);
                else if(result.user.friend_requests.includes(userData._id)) setFriendStatus(1);
                else if(userData.friend_requests.includes(result.user._id)) setFriendStatus(2);
            }
        })

        server('/getAlbums', { userId: id })
        .then(result => {
            if(result.error) setError([true, result.message]);
            else setAlbums(result.albums);
        })
    }

    useEffect(() => {
        reset();
    }, [search, id])

    function reset() {
        setCount(0);
        setMaxCount(1);
        setPosts(null);
        setFetching(true);
    }

    useEffect(() => {
        if(fetching) {
            server('/getPosts', { userId: id, senderId: userData._id, type: 'user', search, count })
            .then(result => {
                if(!result.error) {
                    if(count != 0) setPosts([...posts, ...result.posts]);
                    else setPosts(result.posts);

                    setCount(prevState => prevState + 1);
                    setMaxCount(result.maxCount);
                    setFetching(false);
                }
            })
        }
    }, [fetching])

    const scroll = useCallback(() => {
        if(posts == null) return;

        if(posts.length < maxCount) {
            setFetching(true);
        }
    }, [maxCount, posts])

    function reqFriend(req) {
        server(req, { userId: id, senderId: userData._id })
        .then(result => {
            if(!result.error) setFriendStatus(result.status);
            else setError([true, result.message]);
        })
    }

    function createChat() {
        socket.emit('createChat', { type: 'personal', senderId: userData._id, userId: id });
        socket.on('createChat', result => {
            navigation.navigate('Chat', { id: result.id });
            socket.off('createChat');
        })
    }

    function getAge(date) {
        let nowDate = new Date();
        let birthdayDate = new Date(date);
        let retDate = Math.trunc((nowDate - birthdayDate) / 31622400000);
        let lastNum = Number(String(retDate)[String(retDate).length - 1]);
    
        return retDate + (lastNum > 0 && lastNum < 4 ? ' года' : ' лет');
    }

    function refreshing() {
        setRefresh(true);
        getData();
        reset();
        setRefresh(false);
    }

    return(
        <SafeAreaView style={styles.screen}>
            <Background />

            <FlatList
                data={posts}
                keyExtractor={item => item._id}
                refreshing={refresh}
                onRefresh={refreshing}
                ListHeaderComponent={() =>
                    <View style={styles.header}>
                        <Image style={styles.avatar} source={{ uri: `${serverUrl}/users/${id}/avatar/${user?.avatar}` }} />

                        <Text style={styles.text}>{user?.username}{user?.sex != undefined ? `, ${user.sex}` : ''}</Text>
                        {user?.birthday != undefined && <Text style={styles.text}>{getAge(user.birthday)}</Text>}

                        <View style={styles.buttons}>
                            {friendStatus == 0 && <Button title='Добавить в друзья' onClick={() => reqFriend('/friendRequest')} />}
                            {friendStatus == 1 && <Button title='Приглашение отправлено' />}
                            {friendStatus == 2 && <Button title='Принять приглашение' onClick={() => reqFriend('/friendAccept')} />}
                            {friendStatus == 3 && <Button title='Удалить из друзей' onClick={() => setConfirm([true, reqFriend, ['/friendDelete']])} />}
                            <Button title='Написать' onClick={createChat} />
                        </View>

                        <View style={styles.albums}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Text style={styles.title}>Альбомы</Text>
                            </View>

                            <AlbumList data={albums} navigation={navigation} />
                        </View>

                        <Text style={styles.title}>Посты</Text>
                    </View>
                }
                renderItem={({ item }) => <Post post={item} setShowComments={setShowComments} setPostId={setPostId} />}
                ListEmptyComponent={() => <View style={{ alignItems: 'center', marginVertical: 50 }}><Text style={{ color: '#949AAF', fontStyle: 'italic', fontSize: 18 }}>Нет результатов</Text></View>}
                onEndReachedThreshold={0.25}
                onEndReached={scroll}
            />

            <Search setValue={setSearch} icon={true} asset='back' onClick={() => navigation.navigate('friends_list')} />

            {showComments &&
            <Comments
                close={() => setShowComments(false)}
                postId={postId}
            />}

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },

    header: {
        marginTop: 60,
        alignContent: 'center',
        paddingHorizontal: 20,
    },

    avatar: {
        height: 250,
        width: 250,
        borderRadius: 200,
        alignSelf: 'center',
    },

    text: {
        color: 'white',
        fontSize: 30,
        marginBottom: 5,
    },

    buttons: {
        gap: 15,
        marginVertical: 10,
    },

    title: {
        color: '#949AAF',
        fontSize: 26,
        marginVertical: 20,
    }
})