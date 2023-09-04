import {useNavigation} from '@react-navigation/native';
import {KeyboardView} from 'components/basics';
import {useFormik} from 'formik';
import React, {useCallback, useEffect} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Button, Input, Text} from '@ui-kitten/components';

import {TodoService} from 'services';
import * as Yup from 'yup';
import {useUserContext} from 'contexts/UserContext';

export const TodoForm: React.FC = () => {
  const navigation = useNavigation();
  const userContext = useUserContext();

  // TODO登録処理
  const onAdd = useCallback<(values: {todo: string}) => void>(
    async ({todo}) => {
      await TodoService.postTodo(todo);
      if (navigation.isFocused()) {
        navigation.goBack();
      }
    },
    [navigation],
  );

  //
  const formik = useFormik({
    initialValues: {todo: ''},
    validationSchema: Yup.object().shape({
      todo: Yup.string().required('Todoを入力してください'),
    }),
    validateOnChange: false,
    onSubmit: onAdd,
  });

  // 登録破棄時の処理
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', event => {
      if (!formik.dirty | formik.isSubmitting) {
        return;
      }
      event.preventDefault();

      Alert.alert(
        '破棄確認',
        '入力内容が保存されていません。\n入力内容を破棄してよろしいですか？',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => navigation.dispatch(event.data.action),
          },
        ],
      );
    });
    return unsubscribe;
  }, [navigation, formik]);

  return (
    <KeyboardView>
      <View style={styles.form}>
        <Text category="h1">ToDo登録</Text>
        <Input
          placeholder="ToDoを入力してください"
          style={styles.input}
          autoCapitalize="none"
          onChangeText={formik.handleChange('todo')}
          value={formik.values.todo}
        />
        <Button
          disabled={formik.isSubmitting}
          onPress={() => formik.handleSubmit()}
          style={styles.addButton}>
          追加
        </Button>
      </View>
    </KeyboardView>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {marginTop: 20, width: '80%'},
  addButton: {
    marginTop: 30,
  },
});
