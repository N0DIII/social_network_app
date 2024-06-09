import { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Pressable, Image, FlatList, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import { server, serverFile } from '../scripts/server';

import { Context } from './context';
import Comment from './comment';
import ImageInput from './image_input';

export default function Comments(props) {
    const { userData } = useContext(Context);
    const { close, postId } = props;

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commFiles, setCommFiles] = useState([]);
    const [showFiles, setShowFiles] = useState(false);

    useEffect(() => {
        server('/getComments', { postId })
        .then(result => {
            if(result.error) setError([true, result.message]);
            else setComments(result.comments);
        })
    }, [postId])

    function sendComment() {
        if(newComment.trim() == '' && commFiles.length == 0) return;

        serverFile('/createComment', { senderId: userData._id, postId, text: newComment }, commFiles)
        .then(result => {
            if(result.error) setError([true, result.message]);
            else {
                setComments(prevState => [...prevState, result.comment]);
                setNewComment('');
                setShowFiles(false);
                setCommFiles([]);
            }
        })
    }

    return(
        <SafeAreaView style={styles.safe}>
        <BlurView style={styles.wrapper} experimentalBlurMethod='dimezisBlurView' tint='dark' intensity={20}>
            <Pressable style={styles.close_wrapper} onPress={close}>
                <Image style={styles.close} source={require('../assets/cross.png')} />
            </Pressable>

            <FlatList
                contentContainerStyle={{ paddingVertical: '25%' }}
                data={comments}
                keyExtractor={item => item._id}
                renderItem={({ item }) => <Comment comment={item} />}
                ListEmptyComponent={() => <Text style={styles.noComments}>Нет комментариев</Text>}
            />
            
            <View style={styles.newComment}>
                <Pressable onPress={() => setShowFiles(!showFiles)}>
                    <Image style={styles.icon} source={require('../assets/clip.png')} />
                </Pressable>
                <TextInput style={styles.input} value={newComment} onChangeText={setNewComment} placeholder='Новый комментарий' placeholderTextColor='#949AAF' />
                <Pressable onPress={sendComment}>
                    <Image style={styles.icon} source={require('../assets/send.png')} />
                </Pressable>
            </View>

            {showFiles &&
            <BlurView style={styles.files} experimentalBlurMethod='dimezisBlurView' tint='dark' intensity={20}>
                <ImageInput setValue={setCommFiles} />
            </BlurView>}
        </BlurView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    
    wrapper: {
        position: 'relative',
        height: '106%',
        width: '100%',
    },

    close_wrapper: {
        paddingHorizontal: 8,
        alignSelf: 'flex-end',
    },

    close: {
        height: 35,
        width: 35,
    },

    newComment: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#26282E',
    },

    input: {
        width: '80%',
        height: 45,
        fontSize: 16,
        color: 'white',
    },

    icon: {
        width: 25,
        height: 25,
    },

    files: {
        position: 'absolute',
        bottom: 85,
        width: '100%',
    },

    noComments: {
        width: '100%',
        textAlign: 'center',
        fontSize: 20,
        color: '#949AAF',
    }
})