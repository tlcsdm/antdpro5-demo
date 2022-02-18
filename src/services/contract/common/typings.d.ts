// @ts-ignore
/* eslint-disable */

declare namespace API {

  //用户信息
  type CurrentUser = {
    V_PERCODE?: string;
    V_PERNAME?: string;
    // userid?: string;
    // email?: string;
    // signature?: string;
    // title?: string;
    // group?: string;
    // tags?: { key?: string; label?: string }[];
    // notifyCount?: number;
    // unreadCount?: number;
    // country?: string;
    //access?: string;
    // geographic?: {
    //   province?: { label?: string; key?: string };
    //   city?: { label?: string; key?: string };
    // };
    // address?: string;
    // phone?: string;
  };

  //登录请求参数
  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  //登录请求结果
  type LoginResult = {
    success?: string;
    message?: string;
    type?: string;
    data?: { label?: string; key?: string };
  };
}
