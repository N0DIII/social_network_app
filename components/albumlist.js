import { useCallback } from 'react';
import { StyleSheet, FlatList, View, Text, Image, Pressable } from 'react-native';

import serverUrl from '../scripts/server_url';

export default function AlbumList(props) {
    const { data, navigation } = props;

    const keyExtractor = useCallback(item => item._id);

    return(
        <FlatList
            data={data}
            keyExtractor={keyExtractor}
            horizontal={true}
            renderItem={({ item }) => 
                <Pressable onPress={() => navigation.navigate('Album', { id: item._id })}>
                    <View style={styles.album}>
                        {item.cover != null && <Image style={styles.cover} source={{ uri: serverUrl + item.cover }} />}
                        <Text style={styles.name}>{item.name}</Text>
                    </View>
                </Pressable>
            }
            ListEmptyComponent={() => 
                <View style={styles.noAlbums}>
                    <Text style={styles.noAlbums_text}>Нет альбомов</Text>
                </View>
            }
        />
    )
}

const styles = StyleSheet.create({
    album: {
        backgroundColor: '#25282E',
        height: 190,
        width: 140,
        borderRadius: 20,
        marginHorizontal: 10,
        overflow: 'hidden',
    },

    name: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingVertical: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },

    cover: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    noAlbums: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 190,
    },

    noAlbums_text: {
        color: '#949AAF',
        fontSize: 20,
        paddingHorizontal: 100,
        fontStyle: 'italic',
    }
})