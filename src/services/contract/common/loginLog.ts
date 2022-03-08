import request from '@/utils/request';
import {download} from "@/utils/base";

//查询登录日志
export async function selectLoginLog(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectLoginLog', {
    method: 'GET',
    params: {...params},
  });
  return res;
}

/**
 * 导出登陆日志
 * @param params
 */
export async function exportLoginLog(params?: { [key: string]: any }) {
  return download('/api/contract-system/exportLoginLog', params);
}
