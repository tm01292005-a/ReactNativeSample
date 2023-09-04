import React from 'react';
import {StyleSheet} from 'react-native';
import {TabView, Tab, Layout, Text} from '@ui-kitten/components';

export enum FilterType {
  ALL = 0,
  INCOMPLETE = 1,
  COMPLETED = 2,
}

interface Props {
  filterType: FilterType;
  setFilterType: (filter: FilterType) => void;
}

export const TodoFilter: React.FC<Props> = ({filterType, setFilterType}) => {
  const buttons = ['全て', '未完了のみ', '完了のみ'];

  return (
    <TabView onSelect={setFilterType} selectedIndex={filterType}>
      <Tab title={buttons[0]}>
        <Layout style={styles.tabContainer}>
          <Text></Text>
        </Layout>
      </Tab>
      <Tab title={buttons[1]}>
        <Layout style={styles.tabContainer}>
          <Text></Text>
        </Layout>
      </Tab>
      <Tab title={buttons[2]}>
        <Layout style={styles.tabContainer}>
          <Text></Text>
        </Layout>
      </Tab>
    </TabView>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    height: 0,
  },
});
