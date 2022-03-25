import React, {useCallback} from 'react';
import {LogoutOutlined} from '@ant-design/icons';
import {Menu, message, Spin} from 'antd';
import {history, useModel} from 'umi';
import {stringify} from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import {MenuInfo} from 'rc-menu/lib/interface';
import Cookies from 'js-cookie'
import {ClearOutlined, EditOutlined, ProfileOutlined} from "@ant-design/icons/lib";

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  const {query = {}, search, pathname} = history.location;
  const {redirect} = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    Cookies.remove('V_PERCODE');
    localStorage.removeItem("con_person");
    localStorage.removeItem("con_menu");
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname + search,
      }),
    });
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({menu}) => {
  const {initialState, setInitialState} = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const {key} = event;
      if (key === 'logout' && initialState) {
        setInitialState({...initialState, currentUser: undefined});
        loginOut();
        return;
      } else if (key === 'clearCaches') {
        localStorage.removeItem("con_person");
        localStorage.removeItem("con_menu");
        message.success("已清空缓存");
        return;
      }
      history.push(`/personalcenter/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const {currentUser} = initialState;

  if (!currentUser || !currentUser.V_PERNAME) {
    return loading;
  }

  // @ts-ignore
  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="todo">
          <ProfileOutlined/>
          待办任务
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="updatePass">
          <EditOutlined/>
          修改密码
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="clearCaches">
          <ClearOutlined/>
          清除缓存
        </Menu.Item>
      )}
      {menu && <Menu.Divider/>}

      <Menu.Item key="logout">
        <LogoutOutlined/>
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        {/*<Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />*/}
        <span className={`${styles.name} anticon`}>{currentUser?.V_PERNAME}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
