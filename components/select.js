import SelectDropdown from 'react-native-select-dropdown';
import { StyleSheet, View, Text, Image } from 'react-native';

export default function Select(props) {
    const { data, setValue, title, defaultValue = '', params = [] } = props;

    function onChange(selectedItem) {
        setValue(selectedItem.value, ...params);
    }

    return(
        <View style={styles.wrapper}>
            <SelectDropdown
                data={data}
                defaultValue={defaultValue}
                onSelect={onChange}
                renderButton={(selectedItem) => 
                    <View style={styles.button}>
                        <Text style={styles.text}>{selectedItem == null ? title : selectedItem.text}</Text>
                        <Image style={styles.icon} source={require('../assets/arrowDown1.png')} />
                    </View>
                }
                renderItem={(item) => 
                    <View style={styles.item}>
                        <Text style={styles.text}>{item.text}</Text>
                    </View>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        height: 45,
        width: '100%',
        borderRadius: 20,
        borderColor: 'white',
        backgroundColor: '#353941',
        paddingLeft: 10,
        justifyContent: 'center',
    },

    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
    },

    text: {
        color: '#949AAF',
        fontSize: 20,
    },

    icon: {
        width: 25,
        height: 25,
    },

    item: {
        backgroundColor: '#353941',
        padding: 10,
    }
})