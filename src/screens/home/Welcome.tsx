import {useNavigation} from '@react-navigation/native';
import {Logo} from 'components/basics';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from '@ui-kitten/components';

export const Welcome: React.FC = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Logo source={require('assets/logo.png')} />
      <Text category="h1">Welcome</Text>
      <View>
        <Button onPress={() => navigation.navigate('RegistUser')}>
          <Text>登録する</Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
