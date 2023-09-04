import {useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {MainTabNav} from 'navigation/MainTabNav';
import React, {useCallback} from 'react';
import {Button, Icon, IconElement} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';

import {TodoForm} from 'screens';

const HomeIcon = (props): IconElement => <Icon name="home-outline" />;

const CloseButton: React.FC = () => {
  const navigation = useNavigation();
  const onClose = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <Button style={styles.button} appearance="ghost" accessoryLeft={HomeIcon} onPress={onClose} />
  );
};

const nav = createStackNavigator();
export const AuthedStackNav: React.FC = () => {
  return (
    <nav.Navigator
      screenOptions={{
        headerShown: false,
        presectation: 'modal',
      }}
      initialRouteName="Main">
      <nav.Screen name="Main" component={MainTabNav} />
      <nav.Screen
        name="TodoForm"
        component={TodoForm}
        options={{
          headerShown: true,
          headerLeft: () => undefined,
          headerRight: () => <CloseButton />,
          headerTransparent: true,
        }}
      />
    </nav.Navigator>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 2,
  },
});
