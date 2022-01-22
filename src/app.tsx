// @ts-ignore
import {PageLoading, Settings as LayoutSettings} from '@ant-design/pro-layout';
import {history, RunTimeLayoutConfig} from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import {currentUser as queryCurrentUser} from './services/ant-design-pro/api';
import defaultSettings from '../config/defaultSettings';
import React from "react";

// const isDev = process.env.NODE_ENV === 'development';
// const {REACT_APP_ENV} = process.env;
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading/>,
};

/**
 * 获取全局初始化信息
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * 该方法返回的数据最后会被默认注入到一个 namespace 为 @@initialState  的 model 中。可以通过 useModel  这个 hook 来消费它
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({initialState, setInitialState}) => {
  return {
    rightContentRender: () => <RightContent/>,
    disableContentMargin: false,
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name,
    // },
    footerRender: () => <Footer/>,
    onPageChange: () => {
      const {location} = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    // links: isDev
    //   ? [
    //     <Link to="/umi/plugin/openapi" target="_blank">
    //       <LinkOutlined/>
    //       <span>OpenAPI 文档</span>
    //     </Link>,
    //     <Link to="/~docs">
    //       <BookOutlined/>
    //       <span>业务组件文档</span>
    //     </Link>,
    //   ]
    //   : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login')
            //布局开发工具
            // && (
            //   <SettingDrawer
            //     enableDarkTheme
            //     settings={initialState?.settings}
            //     onSettingChange={(settings) => {
            //       setInitialState((preInitialState) => ({
            //         ...preInitialState,
            //         settings,
            //       }));
            //     }}
            //   />
            // )
          }
        </>
      );
    },
    ...initialState?.settings,
  };
};
