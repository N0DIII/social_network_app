import { useState, useContext } from 'react';
import { StyleSheet, View, Image, Pressable, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import { serverFile } from '../scripts/server';

import { Context } from '../components/context';
import Input from './input';
import Button from './button';
import ImageInput from './image_input';

export default function CreatePost(props) {
    const { close, type, id } = props;
    const { setError, userData } = useContext(Context);

    const [text, setText] = useState('');
    const [images, setImages] = useState([]);

    function create() {
        serverFile('/createPost', { creator: id, text, type }, images)
        .then(result => {
            if(result.error) setError([true, result.message]);
            else close();
        })
        .catch(e => setError([true, 'Произошла ошибка']))
    }

    return(
        <SafeAreaView style={styles.safe}>
        <BlurView style={styles.wrapper} experimentalBlurMethod='dimezisBlurView' tint='systemMaterialDark' intensity={80}>
            <Pressable style={styles.close_wrapper} onPress={close}>
                <Image style={styles.close} source={require('../assets/cross.png')} />
            </Pressable>

            {userData.confirm &&
            <ScrollView style={styles.scroll} contentContainerStyle={{ paddingVertical: '50%' }}>
                <View style={styles.block}>
                    <ImageInput setValue={setImages} />
                </View>

                <View style={styles.block}>
                    <Input value={text} setValue={setText} multiline={true} />
                </View>

                <View style={styles.block}>
                    <Button title='Сохранить' onClick={create} />
                </View>
            </ScrollView>}

            {!userData.confirm &&
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 28 }}>Подтвердите адрес электронной почты</Text>
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 28, marginVertical: 20 }}>Профиль → Изменить</Text>
            </View>}
            
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

    scroll: {
        width: '100%',
        height: '100%',
        paddingHorizontal: 20,
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

    block: {
        marginVertical: 8,
    },
})