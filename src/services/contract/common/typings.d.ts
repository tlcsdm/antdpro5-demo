// @ts-ignore
/* eslint-disable */

declare namespace API {

  //用户信息
  type CurrentUser = {
    V_PERCODE?: string;
    V_PERNAME?: string;
    V_DEPTCODE?: string;
    V_DEPTNAME?: string;
    V_ORGCODE?: string;
    V_ORGNAME?: string;
    V_ROLES?: [];
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
    success?: boolean;
    message?: string;
    type?: string;
    data?: CurrentUser;
  };
}
