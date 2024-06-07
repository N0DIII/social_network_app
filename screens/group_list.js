import { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList, Image } from 'react-native';

import { server } from '../scripts/server';
import serverUrl from '../scripts/server_url';

import { Context } from '../components/context';
import Background from '../components/background';
import Search from '../components/search';
import CreateGroup from '../components/create_group';

export default function GroupList({ navigation }) {
    const { userData } = useContext(Context);

    const [search, setSearch] = useState('');
    const [selectNav, setSelectNav] = useState('subscribe');
    const [showCreate, setShowCreate] = useState(false);

    const [groups, setGroups] = useState(null);

    const [count, setCount] = useState(0);
    const [maxCount, setMaxCount] = useState(1);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        setGroups(null);
        setCount(0);
        setFetching(true);
    }, [search, selectNav])

    useEffect(() => {
        if(fetching) {
            server('/getGroups', { userId: userData._id, category: selectNav, search, count })
            .then(result => {
                if(!result.error) {
                    if(count == 0) setGroups(result.groups);
                    else setGroups(prevState => [...prevState, ...result.groups]);
                    setCount(prevState => prevState + 1);
                    setMaxCount(result.maxCount);
                    setFetching(false);
                }
                else setError([true, result.message]);
            })
        }
    }, [fetching, userData])

    const scroll = useCallback(e => {
        if(groups == null) return;

        if(groups.length < maxCount) {
            setFetching(true);
        }
    }, [maxCount, groups])

    return(
        <View style={styles.screen}>
            <Background />

            <View style={styles.navigation}>
                <Pressable style={{ height: 45 }} onPress={() => setSelectNav('subscribe')}>
                    <Text style={[styles.nav_text, selectNav == 'subscribe' ? { borderBottomWidth: 2 } : {}]}>Подписки</Text>
                </Pressable>
                <Pressable style={{ height: 45 }} onPress={() => setSelectNav('own')}>
                    <Text style={[styles.nav_text, selectNav == 'own' ? { borderBottomWidth: 2 } : {}]}>Мои группы</Text>
                </Pressable>
                <Pressable style={{ height: 45 }} onPress={() => setSelectNav('all')}>
                    <Text style={[styles.nav_text, selectNav == 'all' ? { borderBottomWidth: 2 } : {}]}>Все группы</Text>
                </Pressable>
            </View>

            <FlatList
                style={styles.groups}
                data={groups}
                keyExtractor={item => item._id}
                onEndReachedThreshold={0.25}
                onEndReached={scroll}
                renderItem={({ item }) => 
                    <Pressable style={styles.group} onPress={() => navigation.navigate('group_profile', { id: item._id })}>
                        <View style={styles.group}>
                            <Image style={styles.avatar} source={{ uri: `${serverUrl}/groups/${item._id}/avatar/${item.avatar}` }} />
                            <Text style={styles.groupname}>{item.name}</Text>
                        </View>
                    </Pressable>
                }
                ListEmptyComponent={() => 
                    <View>
                        <Text style={styles.noResult}>Нет результатов</Text>
                    </View>
                }
            />

            <Search setValue={setSearch} icon={true} onClick={() => setShowCreate(true)} />

            {showCreate && <CreateGroup close={() => setShowCreate(false)} navigation={navigation} />}
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
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 90,
        width: '100%',
        height: 35,
        overflow: 'hidden',
    },

    nav_text: {
        color: 'white',
        fontSize: 18,
        padding: 10,
        borderColor: '#8551FF',
    },

    groups: {
        position: 'absolute',
        left: 0,
        top: 160,
        width: '100%',
    },

    noResult: {
        color: '#949AAF',
        fontSize: 20,
        fontStyle: 'italic',
        textAlign: 'center',
    },

    group: {
        flexDirection: 'row',
        width: '90%',
        height: 80,
        backgroundColor: '#26282E',
        alignItems: 'center',
        borderRadius: 20,
        marginVertical: 10,
        alignSelf: 'center',
    },

    avatar: {
        width: 50,
        height: 50,
        marginHorizontal: 10,
        borderRadius: 200,
    },

    groupname: {
        color: 'white',
        fontSize: 20,
    }
})