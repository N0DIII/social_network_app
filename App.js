import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Loading from './screens/loading';
import { Provider } from './components/context';
import Error from './components/error';
import Confirm from './components/confirm';
import Success from './components/success';
import Main from './screens/main';
import Login from './screens/login';
import Registration from './screens/registration';
import Album from './screens/album';
import Chat from './screens/chat';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Provider>
                <Stack.Navigator initialRouteName='Loading' screenOptions={{ headerShown: false, animation: 'none' }}>
                    <Stack.Screen name='Loading' component={Loading} />
                    <Stack.Screen name='Main' component={Main} />
                    <Stack.Screen name='Login' component={Login} />
                    <Stack.Screen name='Registration' component={Registration} />
                    <Stack.Screen name='Album' component={Album} />
                    <Stack.Screen name='Chat' component={Chat} />
                </Stack.Navigator>
                <Error />
                <Confirm />
                <Success />
            </Provider>
        </NavigationContainer>
    )
}