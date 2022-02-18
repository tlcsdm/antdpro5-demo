import Qs from "qs";
import request from "@/utils/request";

//查询人员组织机构
export async function selectPersonToDept(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectPersonToDept', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增人员组织机构
export async function insertPersonToDeptBatch(params: any) {
  const res = request('/api/contract-system/insertPersonToDeptBatch', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//删除人员组织机构
export async function deletePersonToDept(params: any) {
  const res = request('/api/contract-system/deletePersonToDept', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}





