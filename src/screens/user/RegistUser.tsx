import {KeyboardView} from 'components/basics';
import {useFormik} from 'formik';
import {useUserContext} from 'contexts/UserContext';
import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {Layout, Input, Button, Text, Modal, Card} from '@ui-kitten/components';
import * as Yup from 'yup';

export const RegistUser: React.FC = () => {
  const userContext = useUserContext();
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  // エラーモーダル
  const [visible, setVisible] = React.useState(false);

  const addUser = useCallback(
    (values: {name: string; password: string; error: string}) => {
      userContext.addUser(values.name, values.password).then(
        () => {},
        () => {},
      );
    },
    [userContext],
  );

  //validate関数を定義
  const validate = (values: any) => {
    const errors = {};

    if (values.password.length < 4) {
      errors.error = 'パスワードは4文字以上で入力してください';
      setVisible(true);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {name: '', password: '', error: ''},
    validationSchema: Yup.object().shape({
      name: Yup.string().required('名前を入力してください'),
      password: Yup.string().required('パスワードを入力してください'),
    }),
    validateOnChange: false,
    onSubmit: addUser,
    validate: validate,
  });

  return (
    <KeyboardView>
      <Layout style={styles.form}>
        <Input
          style={styles.input}
          label="名前"
          autoCapitalize="none"
          onChangeText={formik.handleChange('name')}
          value={formik.values.name}
        />
        <Input
          style={styles.input}
          label="パスワード"
          placeholder="4桁以上のパスワード"
          secureTextEntry={secureTextEntry}
          onChangeText={formik.handleChange('password')}
          value={formik.values.password}
        />
        <Button
          onPress={() => formik.handleSubmit()}
          disabled={formik.isSubmitting}
          style={styles.button}>
          登録する
        </Button>
        {formik.errors.error && (
          <Modal visible={visible}>
            <Card disabled={true}>
              <Text>{formik.errors.error}</Text>
              <Button onPress={() => setVisible(false)}>OK</Button>
            </Card>
          </Modal>
        )}
      </Layout>
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
