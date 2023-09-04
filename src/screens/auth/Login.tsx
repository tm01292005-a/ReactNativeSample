import {KeyboardView} from 'components/basics';
import {useUserContext} from 'contexts/UserContext';
import {useFormik} from 'formik';
import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Input} from '@ui-kitten/components';
import * as Yup from 'yup';

export const Login: React.FC = () => {
  const userContext = useUserContext();
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  const login = useCallback(
    (values: {name: string; password: string}) => {
      userContext.login(values.name, values.password).then(
        () => {},
        () => {},
      );
    },
    [userContext],
  );

  const formik = useFormik({
    initialValues: {name: '', password: ''},
    validationSchema: Yup.object().shape({
      name: Yup.string().required('名前を入力してください'),
      password: Yup.string().required('パスワードを入力してください'),
    }),
    validateOnChange: false,
    onSubmit: login,
  });

  return (
    <KeyboardView>
      <View style={styles.form}>
        <Input
          style={styles.input}
          label="名前"
          placeholder="名前を入力"
          containerStyle={styles.input}
          autoCapitalize="none"
          errorMessage={formik.errors.name}
          onChangeText={formik.handleChange('name')}
          value={formik.values.name}
        />
        <Input
          style={styles.input}
          label="パスワード"
          placeholder="パスワードを入力"
          containerStyle={styles.input}
          errorMessage={formik.errors.password}
          secureTextEntry={secureTextEntry}
          onChangeText={formik.handleChange('password')}
          value={formik.values.password}
        />
        <Button
          onPress={() => formik.handleSubmit()}
          disabled={formik.isSubmitting}
          style={styles.button}>
          ログインする
        </Button>
      </View>
    </KeyboardView>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    marginTop: 20,
    width: '80%',
  },
  button: {
    marginTop: 30,
  },
});
