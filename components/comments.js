import { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Pressable, Image, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import { Context } from './context';
import Comment from './comment';

export default function Comments(props) {
    const { userData } = useContext(Context);
    const { close, comments, setComments } = props;

    const [newComment, setNewComment] = useState('');
    const [commFiles, setCommFiles] = useState([]);
    const [commNewFiles, setCommNewFiles] = useState([]);
    const [commDeletedFiles, setCommDeletedFiles] = useState([]);
    const [isEditComm, setIsEditComm] = useState([false]);
    const [showFiles, setShowFiles] = useState(false);

    function changeFiles() {
        setShowFiles(!showFiles);
        setCommNewFiles([]);
    }

    function cancelChange() {
        setNewComment('');
        setShowFiles(false);
        setCommDeletedFiles([]);
        setIsEditComm([false]);
    }

    function sendComment() {
        if(newComment.trim() == '' && commNewFiles.length == 0) return;

        if(!isEditComm[0]) {
            serverFile('/createComment', { senderId: userData._id, postId: post._id, text: newComment }, commNewFiles)
            .then(result => {
                if(result.error) setError([true, result.message]);
                else {
                    setComments(prevState => [...prevState, result.comment]);
                    setNewComment('');
                    setShowFiles(false);
                    setCommNewFiles([]);
                    setCommCount(prevState => prevState + 1);
                }
            })
        }
        else {
            serverFile('/changeComment', { commentId: isEditComm[1], postId: post._id, text: newComment, deletedFiles: commDeletedFiles }, commNewFiles)
            .then(result => {
                if(result.error) setError([true, result.message]);
                else {
                    setComments(prevState => prevState.map(item => {
                        if(item._id == result.comment._id) return result.comment;
                        else return item;
                    }))
                    setCommNewFiles([]);
                    cancelChange();
                }
            })
        }
    }

    function closeComments() {
        setComments([]);
        setShowComments(false);
    }

    function changeComment(files, text, commentId) {
        setIsEditComm([true, commentId]);
        setNewComment(text);

        if(files.length != 0) {
            setCommFiles(files);
            setShowFiles(true);
        }
    }

    function deleteComment(commentId) {
        server('/deleteComment', { postId: post._id, commentId })
        .then(result => {
            if(result.error) setError([true, result.message]);
            else {
                setComments(prevState => prevState.filter(item => item._id != commentId));
                setCommCount(prevState => prevState - 1);
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
                data={comments}
                keyExtractor={item => item._id}
                renderItem={({ item }) => <Comment comment={item} />}
            />
            
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
})