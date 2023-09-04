//import {useUserContext} from 'contexts/UserContext';
import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Button, Card, Modal, Text, Layout} from '@ui-kitten/components';

export const UserSettingOrg: React.FC = () => {
  //const userContext = useUserContext();
  const navigation = useNavigation();
  // モーダル表示フラグ
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // ユーザー名
  const [userName, setUserName] = useState<string>('');

  /**
   * 初回画面レンダー時に実行
   */
  useEffect(() => {
    setUserName('ユーザー１'); // TODO ログイン画面から渡ってきたユーザー名を設定する
    console.log('画面更新');
  }, []);

  /**
   * [利用規約]ボタンイベント
   */
  const onTermsOfService = () => {
    console.log('利用規約規約へ画面遷移');
    navigation.navigate('TermsOfService');
  };

  // モーダルウィンドウ(フッタ部分)
  /*
  const ModalFooter = (): React.ReactElement => (
    <Layout style={styles.modalBtnContainer}>
      <Button style={styles.modalBtn} onPress={onLogout}>
        OK
      </Button>
      <Button style={styles.modalBtn} onPress={onCancel}>
        Cancel
      </Button>
    </Layout>
  );
  */
  const ModalFooter: React.FC = () => {
    /**
     * ログアウト([OK]ボタン)イベント
     */
    const onLogout = () => {
      // TODO 認証方式に合わせてログアウト処理を実装
      setModalVisible(false);
      console.log('ログアウト');
      navigation.navigate('Login');
    };

    /**
     * [キャンセル]ボタンイベント
     */
    const onCancel = () => {
      setModalVisible(false);
      console.log('キャンセル');
    };

    return (
      <Layout style={styles.modalBtnContainer}>
        <Button style={styles.modalBtn} onPress={onLogout}>
          OK
        </Button>
        <Button style={styles.modalBtn} onPress={onCancel}>
          Cancel
        </Button>
      </Layout>
    );
  };

  // モーダルウィンドウ
  const ModalDialog = (): React.ReactElement => (
    <Modal
      style={styles.modalContainer}
      visible={modalVisible}
      backdropStyle={styles.modalBackdrop}
      animationType="fade">
      <Card disabled={true} footer={ModalFooter}>
        <Layout style={styles.modalHeder}>
          <Text category="h6">ZConnect</Text>
          <Text category="s1">ログアウトします。よろしいですか？</Text>
        </Layout>
      </Card>
    </Modal>
  );

  return (
    <Layout style={styles.container}>
      <Text style={styles.textlabel} category="h6">
        ユーザー名
      </Text>
      <Layout style={styles.userNameContainer}>
        <Text style={styles.userName} category="h6" status="info">
          {userName}
        </Text>
      </Layout>
      <Button size="large" style={styles.button} onPress={() => setModalVisible(true)}>
        ログアウト
      </Button>
      <Text style={styles.textlabel} category="h6">
        情報
      </Text>
      <Button size="large" style={styles.button} onPress={onTermsOfService}>
        <Text>利用規約</Text>
      </Button>
      <ModalDialog />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textlabel: {
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
  },
  userNameContainer: {
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {},
  button: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 30,
  },
  modalContainer: {},
  modalBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalHeder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 10,
  },
  modalBtn: {
    flex: 1,
    margin: 2,
  },
});
