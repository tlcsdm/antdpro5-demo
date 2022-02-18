import request from '@/utils/request';
import Qs from "qs";

//查询承揽方收藏
export async function selectPerToContractor(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectPerToContractor', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增个人承揽方收藏
export async function insertPerToContractorBatch(params: any) {
  const res = request('/api/contract-system/insertPerToContractorBatch', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//删除个人承揽方收藏
export async function deletePerToContractorBatch(params: any) {
  const res = request('/api/contract-system/deletePerToContractorBatch', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}
