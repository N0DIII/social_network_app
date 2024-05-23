import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Loading from './screens/loading';
import { Provider } from './components/context';
import Error from './components/error';
import Main from './screens/main';
import Login from './screens/login';
import Registration from './screens/registration';

const Stack = createNativeStackNavigator();

export default function App() {
    const [userData, setUserData] = useState(false);

    return (
        <NavigationContainer>
            <Provider>
                <Stack.Navigator initialRouteName='Loading' screenOptions={{ userData, headerShown: false }}>
                    <Stack.Screen name='Loading' component={Loading} options={{ userData, setUserData }}/>
                    <Stack.Screen name='Main' component={Main} />
                    <Stack.Screen name='Login' component={Login} />
                    <Stack.Screen name='Registration' component={Registration} />
                </Stack.Navigator>
                <Error />
            </Provider>
        </NavigationContainer>
    )
}