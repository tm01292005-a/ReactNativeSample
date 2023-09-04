import {NavigationContainer} from '@react-navigation/native';
import {UserContextProvider} from 'contexts/UserContext';
import {StatusBar} from 'expo-status-bar';
import {RootStackNav} from 'navigation';
import React from 'react';
import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';

export const App = () => {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <GestureHandlerRootView style={StyleSheet.absoluteFill}>
          <UserContextProvider>
            <StatusBar style="auto" />
            <NavigationContainer>
              <RootStackNav />
            </NavigationContainer>
          </UserContextProvider>
        </GestureHandlerRootView>
      </ApplicationProvider>
    </>
  );
};
