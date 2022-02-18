import Qs from "qs";
import request from '@/utils/request';

//加载承揽方
export async function loadContractor(params: any) {
  const res = request('/api/contract-system/loadContractor', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//查询承揽方
export async function selectContractor(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectContractor', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增承揽方
export async function insertContractor(params: any) {
  const res = request('/api/contract-system/insertContractor', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//修改承揽方
export async function updateContractor(params: any) {
  const res = request('/api/contract-system/updateContractor', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//修改承揽方状态
export async function updateContractorStatus(params: any) {
  const res = request('/api/contract-system/updateContractorStatus', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}

//删除承揽方
export async function deleteContractor(params: any) {
  const res = request('/api/contract-system/deleteContractor', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}





