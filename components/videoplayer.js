import { StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

export default function VideoPlayer(props) {
    const { uri } = props;

    return (
        <Video
            style={styles.video}
            source={{ uri }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
        />
    )
}

const styles = StyleSheet.create({
    video: {
        width: '100%',
        height: '100%',
    }
})