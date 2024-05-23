const { StyleSheet, Pressable, View, Text } = require('react-native');
import { LinearGradient } from 'expo-linear-gradient';

export default function Button(props) {
    const { title, onClick } = props;

    return(
        <Pressable style={styles.wrapper} onPress={onClick}>
            {({ pressed }) => (
                <View style={pressed ? [styles.buttonPressed, styles.button] : styles.button}>
                    <LinearGradient start={[0, 1]} end={[1, 0]} colors={['#8551FF', '#4753FF']} style={styles.background} />
                    <Text style={styles.title}>{title}</Text>
                </View>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        height: 45,
        overflow: 'hidden',
        borderRadius: 20,
    },

    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },

    title: {
        fontSize: 20,
        color: 'white',
        marginRight: 30,
        marginLeft: 30,
    },

    button: {
        width: '100%',
        height: '100%',
        backgroundColor: '#4b0082',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonPressed: {
        transform: 'scale(0.95)',
    }
})