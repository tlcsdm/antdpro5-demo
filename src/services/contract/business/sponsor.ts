import Qs from "qs";
import request from '@/utils/request';

//加载定作方
export async function loadSponsor(params: any) {
  const res = request('/api/contract-system/loadSponsor', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//查询定作方
export async function selectSponsor(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectSponsor', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增定作方
export async function insertSponsor(params: any) {
  const res = request('/api/contract-system/insertSponsor', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//修改定作方
export async function updateSponsor(params: any) {
  const res = request('/api/contract-system/updateSponsor', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//修改定作方状态
export async function updateSponsorStatus(params: any) {
  const res = request('/api/contract-system/updateSponsorStatus', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}

//删除定作方
export async function deleteSponsor(params: any) {
  const res = request('/api/contract-system/deleteSponsor', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}





