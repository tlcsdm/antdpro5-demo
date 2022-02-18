import Qs from "qs";
import request from "@/utils/request";

//查询角色对应菜单
export async function selectRoleToMenu(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectRoleToMenu', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增角色对应菜单
export async function insertRoleToMenuBatch(params: any) {
  const res = request('/api/contract-system/insertRoleToMenuBatch', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//删除角色对应菜单
export async function deleteRoleToMenu(params: any) {
  const res = request('/api/contract-system/deleteRoleToMenu', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}



