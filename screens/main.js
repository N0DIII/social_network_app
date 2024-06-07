import { StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MyProfile from './my_profile';
import Chats from './chats';
import Friends from './friends';
import Groups from './groups';
import Posts from './posts';

const Tab = createBottomTabNavigator();

export default function Main() {
    function tabIcon(name) {
        if(name == 'Posts') return <Image style={styles.icon} source={require('../assets/home.png')} />
        if(name == 'Groups') return <Image style={styles.icon} source={require('../assets/groups.png')} />
        if(name == 'Chats') return <Image style={styles.icon} source={require('../assets/chat.png')} />
        if(name == 'Friends') return <Image style={styles.icon} source={require('../assets/friend.png')} />
        if(name == 'Profile') return <Image style={styles.icon} source={require('../assets/defaultAvatar.png')} />
    }

    return(
        <Tab.Navigator initialRouteName='Главная' backBehavior='history' screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar }}>
            <Tab.Screen name='Главная' component={Posts} options={{ tabBarIcon: () => tabIcon('Posts') }} />
            <Tab.Screen name='Группы' component={Groups} options={{ tabBarIcon: () => tabIcon('Groups') }} />
            <Tab.Screen name='Чаты' component={Chats} options={{ tabBarIcon: () => tabIcon('Chats') }} />
            <Tab.Screen name='Друзья' component={Friends} options={{ tabBarIcon: () => tabIcon('Friends') }} />
            <Tab.Screen name='Профиль' component={MyProfile} options={{ tabBarIcon: () => tabIcon('Profile') }} />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    icon: {
        resizeMode: 'contain',
        height: '80%',
        width: '80%',
    },

    tabBar: {
        backgroundColor: '#26282E',
    }
})