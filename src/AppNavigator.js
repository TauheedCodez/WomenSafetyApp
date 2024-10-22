import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Splash from './screens/Splash';
import Register from './screens/Register';
import TabNavigator from './TabNavigator';
import Map from './screens/Map'
import Contacts from './screens/Contacts'

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Map"
          component={Map}
        />
        <Stack.Screen
          name="Contacts"
          component={Contacts}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;