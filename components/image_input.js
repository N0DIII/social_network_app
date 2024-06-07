import { useState } from 'react';
import { StyleSheet, Image, FlatList, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImageInput(props) {
    const { setValue } = props;

    const [images, setImages] = useState([]);

    async function loadImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            quality: 1,
        })
      
        if(!result.canceled) {
            const images = result.assets;
            console.log(images)

            setImages(images);
            setValue(images);
        }
    }

    return(
        <FlatList
            data={images}
            horizontal={true}
            keyExtractor={item => item.uri}
            ListEmptyComponent={() =>
                <Pressable style={styles.add} onPress={loadImage}>
                    <Image style={{ width: 40, height: 40 }} source={require('../assets/plus.png')} />
                </Pressable>
            }
            renderItem={({ item }) =>
                <Image style={styles.image} source={{ uri: item.uri }} />
            }
        />
    )
}

const styles = StyleSheet.create({
    add: {
        width: 120,
        height: 160,
        backgroundColor: '#353941',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    image: {
        width: 120,
        height: 160,
        resizeMode: 'contain',
        backgroundColor: '#353941',
        borderRadius: 20,
        marginHorizontal: 10,
    }
})