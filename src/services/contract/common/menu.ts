import request from '@/utils/request';
import Qs from "qs";

//加载系统菜单
export async function loadMenu(params: any) {
  const res = request('/api/contract-system/loadMenu', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//查询系统菜单
export async function selectMenu(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectMenu', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//查询系统菜单树
export async function selectMenuTree(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectMenuTree', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//加载人员菜单树
export async function selectPersonMenuTree(params: any) {
  const res = request('/api/contract-system/selectPersonMenuTree', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增系统菜单
export async function insertMenu(params: any) {
  const res = request('/api/contract-system/insertMenu', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//修改系统菜单
export async function updateMenu(params: any) {
  const res = request('/api/contract-system/updateMenu', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//删除系统菜单
export async function deleteMenu(params: any) {
  const res = request('/api/contract-system/deleteMenu', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}
