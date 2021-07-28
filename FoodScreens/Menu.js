import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import FoodList from './FoodList';
import AddFood from './AddFood';

const Drawer = createDrawerNavigator();

export default function Menu() {
  return (
      <Drawer.Navigator>
        <Drawer.Screen name="FoodList" component={FoodList} options={{ drawerLabel: 'FoodList' }}/>
        <Drawer.Screen name="AddFood" component={AddFood} options={{ drawerLabel: 'AddFood' }}/>
      </Drawer.Navigator>
  );
}