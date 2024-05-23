import { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import auth from '../scripts/auth';

import Background from '../components/background';
import { Context } from '../components/context';

export default function Loading({ navigation }) {
    const { setUserData } = useContext(Context);

    const timer = useRef(null);
    const [load, setLoad] = useState({ left: '-20%' });

    useEffect(() => {
        getToken().then(token => {
            if(token == null) navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            else {
                auth(token).then(result => {
                    if(result._id == undefined) navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    else {
                        setUserData(result);
                        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
                    }
                })
            }
        })
    }, [])

    useEffect(() => {
        if(timer.current) return;

        timer.current = setTimeout(() => {
            const left = Number(load.left.split('%')[0]);
            if(left < 100) setLoad({ left: `${left + 4}%` });
            else setLoad({ left: '-20%' });

            clearTimeout(timer.current);
            timer.current = null;
        }, 20)
    }, [load])

    async function getToken() {
        return AsyncStorage.getItem('token');
    }

    return(
        <View style={styles.screen}>
            <Background />

            <Image style={styles.image} source={require('../assets/comments.png')} />
            <View style={styles.loading}>
                <View style={[styles.loading_block, load]}></View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    text: {
        color: 'white',
    },

    loading: {
        width: '80%',
        height: 10,
        marginTop: 20,
        overflow: 'hidden',
    },

    loading_block: {
        position: 'absolute',
        width: 30,
        height: 10,
        backgroundColor: '#4753FF',
        borderRadius: 20,
    }
})