import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {FilterType, TodoFilter, TodoList} from 'components/parts';
import React, {useCallback, useContext, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Spinner, Layout, Button, Icon, IconElement} from '@ui-kitten/components';
import {Todo, TodoService} from 'services';

const StarIcon = (props): IconElement => <Icon style={styles.icon} name="plus-circle" />;

type ShowFilter = {
  [K in FilterType]: (todo: Todo) => boolean;
};

const showFilter: ShowFilter = {
  [FilterType.ALL]: () => true,
  [FilterType.INCOMPLETE]: todo => !todo.completed,
  [FilterType.COMPLETED]: todo => todo.completed,
};

export const TodoBoard: React.FC = () => {
  const navigation = useNavigation();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [loading, setLoading] = useState(false);
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);

  // 画面フォーカス時に実行される処理
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      setLoading(true);
      TodoService.getTodos()
        .then(response => {
          if (isActive) {
            setTodos(response);
          }
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          if (isActive) {
            setLoading(false);
          }
        });

      return () => {
        isActive = false;
      };
    }, []),
  );

  // Todoリスト更新処理
  const toggleTodoCompletion = (id: number) => {
    const target = todos.find(todo => todo.id === id);
    if (!target) {
      return;
    }
    setProcessingTodos(prevs => [id, ...prevs]);
    TodoService.putTodo(id, !target.completed)
      .then(returnedTodo =>
        setTodos(prevTodos => {
          return prevTodos.map(todo => (todo.id === id ? returnedTodo : todo));
        }),
      )
      .catch(() => {})
      .finally(() => {
        setProcessingTodos(prevs => {
          return prevs.filter(processId => processId !== id);
        });
      });
  };

  const removeTodo = (id: number) => {
    Alert.alert('未実装です');
  };

  const showTodos = todos.filter(showFilter[filterType]);

  return (
    <View style={styles.container} testID="screen/main/home">
      <TodoFilter filterType={filterType} setFilterType={setFilterType} />
      <TodoList
        todos={showTodos}
        contentContainerStyle={styles.todoListContainer}
        toggleTodoCompletion={toggleTodoCompletion}
        removeTodo={removeTodo}
        processingTodos={processingTodos}
      />
      <Button
        style={styles.iconContainerStyle}
        accessoryLeft={StarIcon}
        appearance="ghost"
        onPress={() => {
          navigation.navigate('TodoForm');
        }}
      />
      {loading && (
        <Layout style={styles.indicatorContainer}>
          <Spinner size="giant" />
        </Layout>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  todoListContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 80,
  },
  iconContainerStyle: {
    height: 100,
    width: 100,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  indicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  icon: {
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
