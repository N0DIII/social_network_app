import { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList, Image } from 'react-native';
import { BlurView } from 'expo-blur';

import { server } from '../scripts/server';
import serverUrl from '../scripts/server_url';

import { Context } from '../components/context';
import Background from '../components/background';
import Search from '../components/search';

export default function FriendsList({ navigation }) {
    const { userData, setError } = useContext(Context);

    const [search, setSearch] = useState('');
    const [selectNav, setSelectNav] = useState('friends');

    const [items, setItems] = useState(null);

    const [count, setCount] = useState(0);
    const [maxCount, setMaxCount] = useState(1);
    const [fetching, setFetching] = useState(true);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        setItems(null);
        setFetching(true);
        setCount(0);
        setMaxCount(1);
    }, [search, selectNav])

    useEffect(() => {
        if(fetching) {
            server('/getUsers', { senderId: userData._id, category: selectNav, search, count })
            .then(result => {
                if(!result.error) {
                    if(count == 0) setItems(result.users);
                    else setItems(prevState => [...prevState, ...result.users]);
                    setCount(prevState => prevState + 1);
                    setMaxCount(result.maxCount);
                    setFetching(false);
                }
                else setError([true, result.message]);
            })
        }
    }, [fetching, userData])

    const scroll = useCallback(e => {
        if(items == null) return;

        if(items.length < maxCount) {
            setFetching(true);
        }
    }, [maxCount, items])

    function refreshing() {
        setRefresh(true);
        setCount(0);
        setMaxCount(1);
        setItems(null);
        setFetching(true);
        setRefresh(false);
    }

    return(
        <View style={styles.screen}>
            <Background />

            <FlatList
                contentContainerStyle={{ paddingVertical: 140 }}
                style={styles.users}
                data={items}
                keyExtractor={item => item._id}
                onEndReachedThreshold={0.25}
                onEndReached={scroll}
                refreshing={refresh}
                onRefresh={refreshing}
                renderItem={({ item }) => 
                    <Pressable style={styles.user} onPress={() => navigation.navigate('user_profile', { id: item._id })}>
                        <View style={styles.user}>
                            <Image style={styles.avatar} source={{ uri: `${serverUrl}/users/${item._id}/avatar/${item.avatar}` }} />
                            <Text style={styles.username}>{item.username}</Text>
                        </View>
                    </Pressable>
                }
                ListEmptyComponent={() => 
                    <View>
                        <Text style={styles.noResult}>Нет результатов</Text>
                    </View>
                }
            />

            <BlurView style={styles.navigation} experimentalBlurMethod='dimezisBlurView' tint='systemMaterialDark' intensity={80}>
                <Pressable style={{ height: 45 }} onPress={() => setSelectNav('friends')}>
                    <Text style={[styles.nav_text, selectNav == 'friends' ? { borderBottomWidth: 2 } : {}]}>Друзья</Text>
                </Pressable>
                <Pressable style={{ height: 45 }} onPress={() => setSelectNav('requests')}>
                    <Text style={[styles.nav_text, selectNav == 'requests' ? { borderBottomWidth: 2 } : {}]}>Приглашения</Text>
                </Pressable>
                <Pressable style={{ height: 45 }} onPress={() => setSelectNav('users')}>
                    <Text style={[styles.nav_text, selectNav == 'users' ? { borderBottomWidth: 2 } : {}]}>Все пользователи</Text>
                </Pressable>
            </BlurView>

            <Search setValue={setSearch} />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    navigation: {
        position: 'absolute',
        top: 80,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 45,
        overflow: 'hidden',
    },

    nav_text: {
        color: 'white',
        fontSize: 18,
        padding: 10,
        borderColor: '#8551FF',
    },

    users: {
        width: '100%',
    },

    noResult: {
        color: '#949AAF',
        fontSize: 20,
        fontStyle: 'italic',
        textAlign: 'center',
    },

    user: {
        flexDirection: 'row',
        width: '90%',
        height: 60,
        backgroundColor: '#26282E',
        alignItems: 'center',
        borderRadius: 20,
        marginVertical: 5,
        alignSelf: 'center',
    },

    avatar: {
        width: 50,
        height: 50,
        marginHorizontal: 10,
        borderRadius: 200,
    },

    username: {
        color: 'white',
        fontSize: 20,
    }
})