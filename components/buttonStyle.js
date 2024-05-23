const { StyleSheet } = require('react-native');

module.exports = buttonStyle = StyleSheet.create({
    wrapper: {
        height: 45,
    },

    title: {
        fontSize: 20,
        color: 'white',
        marginRight: 20,
        marginLeft: 20,
    },

    button: {
        width: '100%',
        height: '100%',
        backgroundColor: '#4b0082',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },

    buttonPressed: {
        transform: 'scale(0.95)',
    }
})