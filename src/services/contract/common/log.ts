import request from '@/utils/request';

//加载日志
export async function loadLog(params: any) {
  const res = request('/api/contract-system/loadLog', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//查询日志
export async function selectLog(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectLog', {
    method: 'GET',
    params: {...params}
  });
  return res;
}







