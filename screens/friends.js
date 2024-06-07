import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FriendsList from './friends_list';
import UserProfile from './user_profile';

const Stack = createNativeStackNavigator();

export default function Friends() {
    return(
        <Stack.Navigator initialRouteName='friends_list' screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name='friends_list' component={FriendsList} />
            <Stack.Screen name='user_profile' component={UserProfile} />
        </Stack.Navigator>
    )
}