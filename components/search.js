import { StyleSheet, TextInput, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

export default function Search(props) {
    const { setValue, icon = false, onClick = () => {}, asset = 'plus' } = props;

    return(
        <BlurView style={styles.blurView} experimentalBlurMethod='dimezisBlurView' tint='dark' intensity={20}>
            <SafeAreaView style={styles.wrapper}>
                <Image style={styles.icon} source={require('../assets/search.png')} />
                <TextInput style={styles.input} placeholder='Введите запрос' onChangeText={setValue} placeholderTextColor='#949AAF' />
                {icon &&
                <Pressable onPress={onClick}>
                    {asset == 'plus' && <Image style={styles.icon} source={require(`../assets/plus.png`)} />}
                    {asset == 'back' && <Image style={styles.icon} source={require(`../assets/leftArrow1.png`)} />}
                </Pressable>}
            </SafeAreaView>
        </BlurView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },

    blurView: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 80,
    },

    icon: {
        resizeMode: 'contain',
        height: 20,
        width: 20,
        marginHorizontal: 20,
    },

    input: {
        fontSize: 18,
        color: 'white',
        width: '70%',
    }
})