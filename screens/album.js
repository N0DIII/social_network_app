import { useState, useEffect, useContext } from 'react';
import { StyleSheet, FlatList, View, Text, Image, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';

import { server, serverFile } from '../scripts/server';
import serverUrl from '../scripts/server_url';

import { Context } from '../components/context';
import Background from '../components/background';
import VideoPlayer from '../components/videoplayer';

export default function Album({ route, navigation }) {
    const { id } = route.params;
    const { setError, userData, setConfirm, setSuccess } = useContext(Context);

    const [album, setAlbum] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [changeName, setChangeName] = useState(false);
    const [name, setName] = useState();

    useEffect(() => {
        server('/getAlbum', { albumId: id })
        .then(result => {
            if(result.error) setError([true, result.message]);
            else {
                setName(result.album.name);
                setAlbum(result.album);
                setPhotos(result.album.files);
            }
        })
        .catch(e => setError([true, 'Произошла ошибка']));
    }, [])

    function changeAlbumName() {
        if(!changeName) setChangeName(true);
        else {
            server('/changeAlbum', { albumId: id, name })
            .then(result => {
                if(result.error) setError([true, result.message]);
                else {
                    setChangeName(false);
                    setSuccess([true, 'Название успешно изменено']);
                }
            })
            .catch(e => setError([true, 'Произошла ошибка']));
        }
    }

    async function loadFile() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1,
        })
      
        if(!result.canceled) {
            serverFile('/loadAlbumFile', { albumId: id, userId: userData._id }, [result.assets[0]])
            .then(result => {
                if(result.error) setError([true, result.message]);
                else setPhotos(prevState => [...result.files, ...prevState]);
            })
            .catch(e => setError([true, 'Произошла ошибка']));
        }
    }

    function deleteAlbum() {
        server('/deleteAlbum', { albumId: id, userId: userData._id })
        .then(result => {
            if(!result.error) navigation.navigate('Профиль');
            else setError([true, result.message]);
        })
        .catch(e => setError([true, 'Произошла ошибка']));
    }

    return(
        <SafeAreaView style={styles.screen}>
            <Background />

            <FlatList
                style={styles.photo_wrapper}
                contentContainerStyle={{ paddingVertical: 50, alignItems: 'center', gap: 10 }}
                data={photos}
                keyExtractor={item => item.src}
                numColumns={2}
                renderItem={({ item }) => 
                    <View>
                        {item.mimetype == 'image' && <Image style={styles.photo} source={{ uri: `${serverUrl}/users/${album.user}/albums/${id}/${item.src}` }} />}
                        {item.mimetype == 'video' && 
                        <View style={styles.photo}>
                            <VideoPlayer uri={`${serverUrl}/users/${album.user}/albums/${id}/${item.src}`} />
                        </View>}
                    </View>
                }
            />

            <BlurView style={styles.blurView} experimentalBlurMethod='dimezisBlurView' tint='systemMaterialDark' intensity={80}>
                <SafeAreaView style={styles.header}>
                    {!changeName && <Text style={styles.title}>{name}</Text>}
                    {changeName && <TextInput style={styles.input} value={name} onChangeText={setName} placeholder='Без названия' placeholderTextColor='#949AAF' />}

                    {userData._id == album?.user &&
                    <View style={styles.buttons}>
                        <Pressable onPress={changeAlbumName}>
                            <Image style={styles.icon} source={!changeName ? require('../assets/pen.png') : require('../assets/checkMark.png')} />
                        </Pressable>

                        <Pressable onPress={loadFile}>
                            <Image style={styles.icon} source={require('../assets/plus.png')} />
                        </Pressable>

                        <Pressable onPress={() => setConfirm([true, deleteAlbum, []])}>
                            <Image style={styles.icon} source={require('../assets/delete.png')} />
                        </Pressable>
                    </View>}
                </SafeAreaView>
            </BlurView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },

    blurView: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 80,
    },

    title: {
        color: 'white',
        fontSize: 20,
    },

    input: {
        color: 'white',
        fontSize: 20,
        width: '60%',
    },

    icon: {
        height: 30,
        width: 30
    },

    buttons: {
        flexDirection: 'row',
        gap: 10,
    },

    photo_wrapper: {
        height: '100%',
        width: '100%',
    },

    photo: {
        width: 150,
        height: 200,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginHorizontal: 10,
        backgroundColor: 'rgba(53, 57, 65, 0.5)',
        borderRadius: 20,
        overflow: 'hidden',
    }
})