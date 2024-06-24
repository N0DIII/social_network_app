import { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Pressable, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { A } from '@expo/html-elements';

import serverUrl from '../scripts/server_url';
import { server } from '../scripts/server';

export default function ChatMenu(props) {
    const { chatId, close } = props;

    const [menuSelect, setMenuSelect] = useState('media');
    const [allFiles, setAllFiles] = useState([]);
    const [allApps, setAllApps] = useState([]);

    useEffect(() => {
        server('/getChatFiles', { chatId })
        .then(result => {
            if(result.error) setError([true, result.message]);
            else {
                setAllApps(result.apps);
                setAllFiles(result.files);
            }
        })
    }, [chatId])

    return(
        <SafeAreaView style={styles.safe}>
        <BlurView style={styles.wrapper} experimentalBlurMethod='dimezisBlurView' tint='systemMaterialDark' intensity={80}>
            <Pressable style={styles.close_wrapper} onPress={close}>
                <Image style={styles.close} source={require('../assets/cross.png')} />
            </Pressable>

            <View style={styles.navigation}>
                <Pressable style={{ height: 45 }} onPress={() => setMenuSelect('media')}>
                    <Text style={[styles.nav_text, menuSelect == 'media' ? { borderBottomWidth: 2 } : {}]}>Медиа</Text>
                </Pressable>
                <Pressable style={{ height: 45 }} onPress={() => setMenuSelect('files')}>
                    <Text style={[styles.nav_text, menuSelect == 'files' ? { borderBottomWidth: 2 } : {}]}>Файлы</Text>
                </Pressable>
            </View>

            {menuSelect == 'media' &&
            <FlatList
                style={{ marginTop: 60 }}
                data={allFiles}
                keyExtractor={item => item.src}
                renderItem={({ item }) => 
                    <View style={{ alignItems: 'center', width: '100%', height: 200, margin: 5, }}>
                        {item.mimetype == 'image' && <Image style={styles.image} source={{ uri: `${serverUrl}/chats/${chatId}/${item.src}` }} />}
                    </View>
                }
                ListEmptyComponent={() => <Text style={styles.noResult}>Нет файлов</Text>}
            />}

            {menuSelect == 'files' &&
            <FlatList
                style={{ marginTop: 60 }}
                data={allApps}
                keyExtractor={item => item.src}
                renderItem={({ item }) => 
                    <View style={styles.file}>
                        <Image source={require('../assets/file.png')} style={{ height: 25, width: 25, resizeMode: 'contain' }} />
                        <A href={item.src} style={{ color: '#949AAF', fontSize: 20, textOverflow: 'ellipsis' }}>{item.originalname}</A>
                    </View>
                }
                ListEmptyComponent={() => <Text style={styles.noResult}>Нет файлов</Text>}
            />}
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

    navigation: {
        position: 'absolute',
        top: 40,
        flex: 1,
        flexDirection: 'row',
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

    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },

    file: {
        width: '80%',
        marginHorizontal: '10%',
        marginVertical: 5,
        padding: 10,
        flexDirection: 'row',
        gap: 5,
        backgroundColor: '#353941',
        borderRadius: 20,
    },

    noResult: {
        textAlign: 'center',
        color: '#949AAF',
    }
})