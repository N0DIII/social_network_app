import { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { server } from '../scripts/server';
import serverUrl from '../scripts/server_url';

import { Context } from '../components/context';
import Background from '../components/background';
import Button from '../components/button';
import Search from '../components/search';
import Post from '../components/post';
import ChangeGroupData from '../components/change_groupdata';
import GroupMembers from '../components/group_members';
import CreatePost from '../components/create_post';

export default function GroupProfile({ route, navigation }) {
    const { id } = route.params;
    const { userData, setUserData, setError, setConfirm } = useContext(Context);

    const [group, setGroup] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [showMembers, setShowMembers] = useState(false);

    const [search, setSearch] = useState('');
    const [showAddPost, setShowAddPost] = useState(false);
    const [posts, setPosts] = useState(null);

    const [count, setCount] = useState(0);
    const [maxCount, setMaxCount] = useState(1);
    const [fetching, setFetching] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        server('/getGroup', { groupId: id }).then(result => setGroup(result.group))
    }, [userData, id])

    useEffect(() => {
        reset();
    }, [userData, search])

    function reset() {
        setCount(0);
        setMaxCount(1);
        setPosts(null);
        setFetching(true);
    }

    useEffect(() => {
        if(fetching) {
            server('/getPosts', { groupId: id, senderId: userData._id, type: 'group', search, count })
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

    function joinGroup() {
        server('/joinGroup', { userId: userData._id, groupId: id })
        .then(result => {
            if(result.error) setError([true, result.message]);
            else setUserData(prevState => { return { ...prevState, groups: [...prevState.groups, id] } });
        })
        .catch(e => setError([true, 'Произошла ошибка']))
    }

    function leaveGroup() {
        server('/leaveGroup', { userId: userData._id, groupId: id })
        .then(result => {
            if(result.error) setError([true, result.message]);
            else setUserData(prevState => { return { ...prevState, groups: prevState.groups.filter(item => item != id) } });
        })
        .catch(e => setError([true, 'Произошла ошибка']))
    }

    function deleteGroup() {
        server('/deleteGroup', { groupId: id })
        .then(result => {
            if(result.error) setError([true, result.message]);
            else navigation.navigate('group_list');
        })
        .catch(e => setError([true, 'Произошла ошибка']))
    }

    function refreshing() {
        setRefresh(true);
        server('/getGroup', { groupId: id }).then(result => setGroup(result.group));
        reset();
        setRefresh(false);
    }

    return(
        <SafeAreaView style={styles.screen}>
            <Background />
            
            {group != null &&
            <FlatList
                data={posts}
                keyExtractor={item => item._id}
                refreshing={refresh}
                onRefresh={refreshing}
                ListHeaderComponent={() =>
                    <View style={styles.header}>
                        <Image style={styles.avatar} source={{ uri: `${serverUrl}/groups/${group._id}/avatar/${group.avatar}` }} />

                        <Text style={styles.text}>{group.name}</Text>
                        <Text style={styles.title}>Участников: <Text style={styles.text}>{group.userCount}</Text></Text>

                        {group.category != '' &&
                        <View>
                            <Text style={styles.title}>Категория: {group.category}</Text>
                        </View>}

                        {group.description != '' && <Text style={styles.title}>Описание: </Text>}
                        {group.description != '' && <Text style={styles.description}>{group.description}</Text>}

                        <View style={styles.buttons}>
                            {!userData.groups.includes(id) && group.creator != userData._id && <Button title='Присоединится' onClick={joinGroup} />}
                            {userData.groups.includes(id) && group.creator != userData._id && <Button title='Выйти' onClick={() => setConfirm([true, leaveGroup, []])} />}
                            {group.creator == userData._id && <Button title='Изменить' onClick={() => setIsEdit(true)} />}
                            {group.creator == userData._id && <Button title='Участники' onClick={() => setShowMembers(true)} />}
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Text style={styles.title}>Посты</Text>
                            {(group.admins.includes(userData._id) || group.creator == userData._id) &&
                            <Pressable onPress={() => setShowAddPost(true)}>
                                <Image style={{ height: 30, width: 30 }} source={require('../assets/plus.png')} />
                            </Pressable>}
                        </View>
                    </View>
                }
                renderItem={({ item }) => <Post post={item} navigation={navigation} />}
                ListEmptyComponent={() => <View style={{ alignItems: 'center', marginVertical: 50 }}><Text style={{ color: '#949AAF', fontStyle: 'italic', fontSize: 18 }}>Нет результатов</Text></View>}
                onEndReachedThreshold={0.25}
                onEndReached={scroll}
            />}

            <Search setValue={setSearch} icon={true} asset='back' onClick={() => navigation.navigate('group_list')} />

            {isEdit &&
            <ChangeGroupData
                close={() => setIsEdit(false)}
                group={group}
                setGroup={setGroup}
                deleteGroup={deleteGroup}
            />}

            {showMembers &&
            <GroupMembers
                close={() => setShowMembers(false)}
                id={group._id}
            />}

            {showAddPost &&
            <CreatePost
                close={() => setShowAddPost(false)}
                type='group'
                id={id}
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

    text_list: {
        color: 'white',
        fontSize: 20,
        marginLeft: 20,
    },

    description: {
        color: 'white',
        fontSize: 20,
        marginBottom: 20,
    }
})