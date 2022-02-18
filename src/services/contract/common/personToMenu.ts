import Qs from "qs";
import request from "@/utils/request";

//查询人员专有菜单
export async function selectPersonToMenu(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectPersonToMenu', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增人员专有菜单
export async function insertPersonToMenuBatch(params: any) {
  const res = request('/api/contract-system/insertPersonToMenuBatch', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//删除人员专有菜单
export async function deletePersonToMenu(params: any) {
  const res = request('/api/contract-system/deletePersonToMenu', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}





