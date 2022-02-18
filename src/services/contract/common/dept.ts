import request from '@/utils/request';
import Qs from "qs";

//加载组织机构
export async function loadDept(params: any) {
  const res = request('/api/contract-system/loadDept', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//查询组织机构
export async function selectDept(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectDept', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//查询组织机构树
export async function selectDeptTree(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectDeptTree', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增组织机构
export async function insertDept(params: any) {
  const res = request('/api/contract-system/insertDept', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//修改组织机构
export async function updateDept(params: any) {
  const res = request('/api/contract-system/updateDept', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//修改组织机构状态
export async function updateDeptStatus(params: any) {
  const res = request('/api/contract-system/updateDeptStatus', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//删除组织机构
export async function deleteDept(params: any) {
  const res = request('/api/contract-system/deleteDept', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}
