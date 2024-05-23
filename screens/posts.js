import { useState, useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { server } from '../scripts/server';

import { Context } from '../components/context';
import Background from '../components/background';

export default function Posts({ navigation }) {
    const { userData, setError } = useContext(Context);

    return(
        <View style={styles.screen}>
            <Background />

            <Text>Posts</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    
})