import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

export default function Background() {
    return(
        <View style={styles.wrapper}>
            <StatusBar style='light' />
            <LinearGradient start={[0, 1]} end={[1, 0]} colors={['#2D2722', '#191C24']} style={styles.background} />
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '120%',
    },

    background: {
        width: '100%',
        height: '100%',
    }
})