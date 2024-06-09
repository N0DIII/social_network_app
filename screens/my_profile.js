import { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { server } from '../scripts/server';
import serverUrl from '../scripts/server_url';

import { Context } from '../components/context';
import Background from '../components/background';
import Button from '../components/button';
import Input from '../components/input';
import Search from '../components/search';
import Post from '../components/post';
import ChangeUserData from '../components/change_userdata';
import AlbumList from '../components/albumlist';
import CreatePost from '../components/create_post';

export default function MyProfile({ navigation }) {
    const { userData, setError } = useContext(Context);

    const [albums, setAlbums] = useState(null);
    const [showAddAlbum, setShowAddAlbum] = useState(false);
    const [albumName, setAlbumName] = useState('');
    const [showChange, setShowChange] = useState(false);
    
    const [search, setSearch] = useState('');
    const [showAddPost, setShowAddPost] = useState(false);
    const [posts, setPosts] = useState(null);

    const [count, setCount] = useState(0);
    const [maxCount, setMaxCount] = useState(1);
    const [fetching, setFetching] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        getData();
    }, [])

    function getData() {
        server('/getAlbums', { userId: userData._id })
        .then(result => {
            if(result.error) setError([true, result.message]);
            else setAlbums(result.albums);
        })
        .catch(e => setError([true, 'Произошла ошибка']));

        console.log(userData)
    }

    useEffect(() => {
        reset();
    }, [search])

    function reset() {
        setCount(0);
        setMaxCount(1);
        setPosts(null);
        setFetching(true);
    }

    useEffect(() => {
        if(fetching) {
            server('/getPosts', { userId: userData._id, senderId: userData._id, type: 'user', search, count })
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

    function addAlbum() {
        server('/createAlbum', { userId: userData._id, name: albumName })
        .then(result => {
            if(!result.error) {
                setAlbums(prevState => [result.album, ...prevState]);
                setShowAddAlbum(false);
            }
            else setError([true, result.message]);
        })
        .catch(e => setError([true, 'Произошла ошибка']));
    }

    function getAge(date) {
        let nowDate = new Date();
        let birthdayDate = new Date(date);
        let retDate = Math.trunc((nowDate - birthdayDate) / 31622400000);
        let lastNum = Number(String(retDate)[String(retDate).length - 1]);
    
        return retDate + (lastNum == 1 ? ' год' : (retDate > 9 && retDate < 21) ? ' лет' : (lastNum > 0 && lastNum < 4) ? ' года' : ' лет');
    }

    async function signOut() {
        await AsyncStorage.removeItem('token');
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }

    function deleteAcc() {
        server('/deleteUser', { userId: userData._id })
        .then(result => {
            if(result.error) setError([true, result.message]);
            else signOut();
        })
        .catch(e => setError([true, 'Произошла ошибка']))
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
                        <Image style={styles.avatar} source={{ uri: `${serverUrl}/users/${userData._id}/avatar/${userData.avatar}` }} />

                        <Text style={styles.text}>{userData.username}{userData?.sex != undefined ? `, ${userData.sex}` : ''}</Text>
                        {userData?.birthday != undefined && <Text style={styles.text}>{getAge(userData.birthday)}</Text>}

                        <View style={styles.buttons}>
                            <Button title='Изменить' onClick={() => setShowChange(true)} />
                            <Button title='Выйти' onClick={signOut} />
                        </View>

                        <View style={styles.albums}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Text style={styles.title}>Альбомы</Text>
                                <Pressable onPress={() => setShowAddAlbum(!showAddAlbum)}>
                                    <Image style={{ height: 30, width: 30 }} source={require('../assets/plus.png')} />
                                </Pressable>
                            </View>

                            {showAddAlbum &&
                            <View style={styles.addAlbum}>
                                <Input value={albumName} setValue={setAlbumName} placeholder='Без названия' />
                                <Button title='Создать' onClick={addAlbum} />
                            </View>}

                            <AlbumList data={albums} navigation={navigation} />

                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Text style={styles.title}>Посты</Text>
                                <Pressable onPress={() => setShowAddPost(true)}>
                                    <Image style={{ height: 30, width: 30 }} source={require('../assets/plus.png')} />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                }
                renderItem={({ item }) => <Post post={item} navigation={navigation} />}
                ListEmptyComponent={() => <View style={{ alignItems: 'center', marginVertical: 50 }}><Text style={{ color: '#949AAF', fontStyle: 'italic', fontSize: 18 }}>Нет результатов</Text></View>}
                onEndReachedThreshold={0.25}
                onEndReached={scroll}
            />

            <Search setValue={setSearch} />

            {showChange &&
            <ChangeUserData
                close={() => setShowChange(false)}
                deleteAcc={deleteAcc}
            />}

            {showAddPost &&
            <CreatePost
                close={() => setShowAddPost(false)}
                type='user'
                id={userData._id}
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
    },

    addAlbum: {
        gap: 10,
        marginBottom: 20,
    }
})