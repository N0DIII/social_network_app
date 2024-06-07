import { createNativeStackNavigator } from '@react-navigation/native-stack';

import GroupList from './group_list';
import GroupProfile from './group_profile';

const Stack = createNativeStackNavigator();

export default function Groups() {
    return(
        <Stack.Navigator initialRouteName='group_list' screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name='group_list' component={GroupList} />
            <Stack.Screen name='group_profile' component={GroupProfile} />
        </Stack.Navigator>
    )
}