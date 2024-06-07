import { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image, TextInput } from 'react-native';

export default function ChatHeader(props) {
    const { value, setValue, sendMessage, sendFile, placeholder } = props;

    return(
        <View style={styles.wrapper}>
            
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 0,
        padding: 10,
        width: '100%',
    },

    
})