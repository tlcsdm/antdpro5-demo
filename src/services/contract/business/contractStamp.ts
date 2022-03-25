import Qs from "qs";
import request from '@/utils/request';

//查询预约签章
export async function selectAppointToStamp(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectAppointToStamp', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增预约签章
export async function insertAppointToStampBatch(params: any) {
  const res = request('/api/contract-system/insertAppointToStampBatch', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//批量盖章
export async function updateStampStatusBatch(params: any) {
  const res = request('/api/contract-system/updateStampStatusBatch', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}

//批量修改预约日期
export async function updateAppointToStampBatch(params: any) {
  const res = request('/api/contract-system/updateAppointToStampBatch', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}

//删除预约签章
export async function deleteAppointToStamp(params: any) {
  const res = request('/api/contract-system/deleteAppointToStamp', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}





