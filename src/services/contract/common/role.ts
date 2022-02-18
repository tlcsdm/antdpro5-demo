import Qs from "qs";
import request from "@/utils/request";

//加载角色
export async function loadRole(params: any) {
  const res = request('/api/contract-system/loadRole', {
    method: 'GET',
    params: {...params}
  });
  return res;
}


//查询角色
export async function selectRole(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectRole', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增角色
export async function insertRole(params: any) {
  const res = request('/api/contract-system/insertRole', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//修改角色
export async function updateRole(params: any) {
  const res = request('/api/contract-system/updateRole', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//修改角色状态
export async function updateRoleStatus(params: any) {
  const res = request('/api/contract-system/updateRoleStatus', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}

//删除角色
export async function deleteRole(params: any) {
  const res = request('/api/contract-system/deleteRole', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}



