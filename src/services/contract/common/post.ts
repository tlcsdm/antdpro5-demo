import Qs from "qs";
import request from "@/utils/request";

//加载岗位
export async function loadPost(params: any) {
  const res = request('/api/contract-system/loadPost', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//查询岗位
export async function selectPost(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectPost', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//查询岗位树
export async function selectPostTree(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectPostTree', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增岗位
export async function insertPost(params: any) {
  const res = request('/api/contract-system/insertPost', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//修改岗位
export async function updatePost(params: any) {
  const res = request('/api/contract-system/updatePost', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//修改岗位状态
export async function updatePostStatus(params: any) {
  const res = request('/api/contract-system/updatePostStatus', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//删除岗位
export async function deletePost(params: any) {
  const res = request('/api/contract-system/deletePost', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}





