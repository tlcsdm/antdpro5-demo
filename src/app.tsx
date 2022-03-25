// @ts-ignore
import {MenuDataItem, PageLoading, Settings as LayoutSettings} from '@ant-design/pro-layout';
import {history, RunTimeLayoutConfig} from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import {currentUser as queryCurrentUser} from './services/contract/common/login';
import defaultSettings from '../config/defaultSettings';
import React from "react";
import Cookies from "js-cookie";
import {selectPersonMenuTree} from "@/services/contract/common/menu";
import {iconMap} from "@/utils/iconMap";
import {getLocalStorage, setLocalStorage} from "@/utils/Storage";
// import {Input} from 'antd';

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
  menuData?: MenuDataItem[];
  menuList: [];//用作权限校验
}> {
  const fetchUserInfo = async () => {
    try {
      if (Cookies.get('V_PERCODE') === undefined) {
        history.push(loginPath);
        return undefined;
      }
      const newFields = {};
      newFields['V_PERCODE'] = Cookies.get('V_PERCODE');
      const person = getLocalStorage("con_person");
      if (person) return person;
      const msg = await queryCurrentUser({...newFields});
      setLocalStorage("con_person", msg.data, 60 * 60 * 24 * 30);
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  const menuDataValue = async () => {
    try {
      const newFields = {};
      newFields['V_PERCODE'] = Cookies.get('V_PERCODE');
      newFields['V_SYSTYPE'] = 'contract';
      const menu = getLocalStorage("con_menu");
      if (menu) return menu;
      const msg = await selectPersonMenuTree({...newFields});
      setLocalStorage("con_menu", msg, 60 * 60 * 24);
      return msg;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    if (currentUser != undefined) {//防止服务器错误时的多次请求
      const menu = await menuDataValue();
      const menuData = menu.data;
      const menuList = menu.menuList;
      return {
        fetchUserInfo,
        menuData,
        menuList,
        currentUser,
        settings: defaultSettings,
      };
    }
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
    menuList: []
  };
}

//菜单树
// @ts-ignore
const menuDataRender = (menuList: MenuDataItem[] | undefined): MenuDataItem[] => {
  if (menuList !== undefined) {
    return menuList.map((item) => {
      const {V_ADDRESS_ICO, children, V_NAME, V_ADDRESS, I_PID} = item;
      const localItem = {
        //...item,
        name: V_NAME,
        path: V_ADDRESS === null || V_ADDRESS === '' ? '' : V_ADDRESS,
        icon: V_ADDRESS_ICO && iconMap[V_ADDRESS_ICO as string],
        children: children ? menuDataRender(children as MenuDataItem[]) : [],
        flatMenu: I_PID === '-1',
      };
      return localItem as MenuDataItem;
    });
  }
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
// @ts-ignore
export const layout: RunTimeLayoutConfig = ({initialState, setInitialState}) => {
  return {
    rightContentRender: () => <RightContent/>,
    disableContentMargin: false,
    waterMarkProps: {
      // @ts-ignore
      content: initialState?.currentUser?.V_PERNAME + initialState?.currentUser?.V_PERCODE,
      zIndex: 5
    },
    disableMobile: false,
    footerRender: () => <Footer/>,
    onPageChange: () => {
      const {location} = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
      if (!Cookies.get('V_PERCODE') && location.pathname !== loginPath) {
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
    menuDataRender: () => menuDataRender(initialState?.menuData), //加载菜单数据
    // menuExtraRender: () => {
    //   return (
    //     <>
    //       <Input.Search
    //         onSearch={() => {
    //           alert(1)
    //         }}
    //       />
    //     </>
    //   );
    // },
    //menuHeaderRender: undefined,
    // 自定义 403 页面
    //unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children: any, props: { location: { pathname: string | string[]; }; }) => {
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
