import Qs from "qs";
import request from "@/utils/request";

//加载审批常用语
export async function loadApprovalOpinions(params: any) {
  const res = request('/api/contract-system/loadApprovalOpinions', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//查询审批常用语
export async function selectApprovalOpinions(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectApprovalOpinions', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增审批常用语
export async function insertApprovalOpinions(params: any) {
  const res = request('/api/contract-system/insertApprovalOpinions', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//修改审批常用语
export async function updateApprovalOpinions(params: any) {
  const res = request('/api/contract-system/updateApprovalOpinions', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//删除审批常用语
export async function deleteApprovalOpinions(params: any) {
  const res = request('/api/contract-system/deleteApprovalOpinions', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}





