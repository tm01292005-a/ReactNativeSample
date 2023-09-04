import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {Spinner, Layout, CheckBox} from '@ui-kitten/components';

interface Props {
  id: number;
  text: string;
  completed: boolean;
  processing: boolean;
  toggleTodoCompletion: (id: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  id,
  text,
  completed,
  processing,
  toggleTodoCompletion,
}) => {
  const onToggle = useCallback(() => toggleTodoCompletion(id), [id, toggleTodoCompletion]);

  return (
    <Layout style={styles.item}>
      <Layout style={styles.todo}>
        <CheckBox checked={completed} style={styles.checkbox} onChange={onToggle}>
          {text}
        </CheckBox>
      </Layout>
      {processing && (
        <Layout style={styles.indicatorContainer}>
          <Spinner size="giant" />
        </Layout>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
  },
  todo: {
    flexGrow: 1,
    flexShrink: 1,
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    height: 50,
    width: '100%',
    marginLeft: 10,
  },
  indicatorContainer: {
    flex: 1,
    position: 'absolute',
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    zIndex: 2,
  },
});
