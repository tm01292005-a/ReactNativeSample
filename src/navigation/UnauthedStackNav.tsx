import {useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {PropsWithChildren} from 'react';
import {Button, Text} from '@ui-kitten/components';
import {Welcome, Instructions, Login, RegistUser} from 'screens';

const CustomText: React.FC<
  PropsWithChildren<{name: string; appearance: string; navidate: string}>
> = ({name, appearance, navidate, children}) => {
  return <>{children}</>;
};

/**
 * ナビゲーションバーのログインボタン
 * @param name ボタンテキスト
 * @param appearance appearance
 * @param navidate 遷移先画面名
 */
const HeaderRight: React.FC<{name: string; appearance: string; navidate: string}> = ({
  name,
  appearance,
  navidate,
}) => {
  const navigation = useNavigation();
  return (
    <Button appearance={appearance} onPress={() => navigation.navigate(navidate)}>
      <CustomText name={name} appearance={appearance} navidate={navidate}>
        <Text>{name}</Text>
      </CustomText>
    </Button>
  );
};

const nav = createStackNavigator();
export const UnauthedStackNav: React.FC = () => {
  return (
    <nav.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerRight: () => <HeaderRight name="ログイン" appearance="ghost" navidate="Login" />,
      }}>
      <nav.Screen
        name="Welcome"
        component={Welcome}
        options={{
          headerTitle: 'Welcome',
        }}
      />
      <nav.Screen
        name="Login"
        component={Login}
        options={{
          headerTitle: 'ログイン',
          headerRight: undefined,
        }}
      />
      <nav.Screen
        name="Instructions"
        component={Instructions}
        options={{
          headerTitle: '初期画面',
          headerRight: undefined,
        }}
      />
      <nav.Screen
        name="RegistUser"
        component={RegistUser}
        options={{
          headerTitle: 'ユーザー登録',
        }}
      />
    </nav.Navigator>
  );
};
