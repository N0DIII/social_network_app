import { useState } from 'react';
import { StyleSheet, View, Image, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function LoadAvatar(props) {
    const { value, setValue } = props;

    const [preview, setPreview] = useState(value);

    async function loadAvatar() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        })
      
        if(!result.canceled) {
            const image = result.assets[0];

            setPreview(image);
            setValue(image);
        }
    }

    return(
        <View style={styles.wrapper}>
            <Image style={styles.avatar} source={preview} />

            <Pressable onPress={loadAvatar}>
                <Image style={styles.icon} source={require('../assets/pen.png')} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        height: 250,
        width: '100%',
    },

    avatar: {
        position: 'absolute',
        height: 250,
        width: 250,
        borderRadius: 200,
        alignSelf: 'center',
    },

    icon: {
        position: 'absolute',
        right: 10,
        width: 40,
        height: 40,
    }
})