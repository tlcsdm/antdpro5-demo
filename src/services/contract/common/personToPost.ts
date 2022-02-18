import Qs from "qs";
import request from "@/utils/request";

//查询人员岗位
export async function selectPersonToPost(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectPersonToPost', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增人员岗位
export async function insertPersonToPostBatch(params: any) {
  const res = request('/api/contract-system/insertPersonToPostBatch', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//删除人员岗位
export async function deletePersonToPost(params: any) {
  const res = request('/api/contract-system/deletePersonToPost', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}





