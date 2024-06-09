import { useState, useEffect, useCallback, useContext } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';

import { server } from '../scripts/server';

import { Context } from '../components/context';
import Background from '../components/background';
import Search from '../components/search';
import Post from '../components/post';
import Comments from '../components/comments';

export default function Posts({ navigation }) {
    const { userData, setError } = useContext(Context);

    const [search, setSearch] = useState('');
    const [posts, setPosts] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [postId, setPostId] = useState();

    const [count, setCount] = useState(0);
    const [maxCount, setMaxCount] = useState(1);
    const [fetching, setFetching] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        setCount(0);
        setMaxCount(1);
        setPosts(null);
        setFetching(true);
    }, [userData, search])

    useEffect(() => {
        if(fetching) {
            server('/getPosts', { senderId: userData._id, type: '', search, count })
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

    function refreshing() {
        setRefresh(true);
        setCount(0);
        setMaxCount(1);
        setPosts(null);
        setFetching(true);
        setRefresh(false);
    }

    return(
        <View style={styles.screen}>
            <Background />

            <FlatList
                contentContainerStyle={{ paddingVertical: 100 }}
                data={posts}
                keyExtractor={item => item._id}
                refreshing={refresh}
                onRefresh={refreshing}
                renderItem={({ item }) => <Post post={item} setShowComments={setShowComments} setPostId={setPostId} />}
                ListEmptyComponent={() => <View style={{ alignItems: 'center', marginVertical: 50 }}><Text style={{ color: '#949AAF', fontStyle: 'italic', fontSize: 18 }}>Нет результатов</Text></View>}
                onEndReachedThreshold={0.25}
                onEndReached={scroll}
            />
            
            <Search setValue={setSearch} />

            {showComments &&
            <Comments
                close={() => setShowComments(false)}
                postId={postId}
            />}
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
    }
})