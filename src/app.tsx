// @ts-ignore
import {PageLoading, Settings as LayoutSettings} from '@ant-design/pro-layout';
// @ts-ignore
import {Context, history, RequestConfig, RequestOptionsInit, RunTimeLayoutConfig} from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import {currentUser as queryCurrentUser} from './services/ant-design-pro/api';
import defaultSettings from '../config/defaultSettings';
import React from "react";
import {ResponseError} from 'umi-request';
import {notification} from 'antd';
import {uuid} from "@/utils/uuid";

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

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/** 异常处理程序
 * @see https://beta-pro.ant.design/docs/request-cn
 */
const errorHandler = (error: ResponseError) => {
  // 两者只会存在一个  response：接口没响应的返回  data：接口响应成功返回的业务数据
  const {response, data} = error;

  let errorText;

  if (response && response.status) {
    console.log('errorHandler response ', response);
    errorText = codeMessage[response.status] || response.statusText;

    const {status, url} = response;

    notification.error({
      message: `请求错误 ${status}: ${url}` || '您的网络发生异常，无法连接服务器',
      description: errorText || '网络异常',
    });
  }

  if (data && data.code) {
    console.log('errorHandler data ', data);
    errorText = data.msg;
    // token无效
    if (data.code === 401) {
      // 移除token
      //removeToken();
      // 跳转到登录页面
      history.push('/login');
    }
  }

  throw errorText;
};

// 将接口的返回映射为统一的接口规范  该配置只是用于错误处理，不会影响最终传递给页面的数据格式 https://umijs.org/plugins/plugin-request
const errorConfig = {
  adaptor: (resData: any) => {
    return {
      ...resData,
    };
  },
};

// 日志输出
const loggerMiddleware = async (ctx: Context, next: () => void) => {
  // if (REACT_APP_ENV === 'dev') {
  // 输出请求信息
  const {req} = ctx;
  console.log('requestConfig：', req.url, ' ', req.options);
  await next();
  // eslint-disable-next-line eqeqeq
  const success = (ctx.res.success ? ctx.res.success : true) && (ctx.res.code ? ctx.res.code == 200 : true);
  // 映射
  ctx.res = {
    success,
    errorMessage: success ? '' : ctx.res.errorMessage || ctx.res.msg,
    ...ctx.res
  };
  // 输出响应信息
  console.log('response：', ctx.res);
  // }
};

// 新增自动添加AccessToken的请求前拦截器
const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  const authHeader = {traceId: uuid()};
  return {
    url: `${url}`,
    options: {...options, interceptors: true, headers: authHeader},
  };
};

// https://umijs.org/zh-CN/plugins/plugin-request
export const request: RequestConfig = {
  errorHandler,
  errorConfig,
  middlewares: [loggerMiddleware],
  requestInterceptors: [authHeaderInterceptor],
};
