import request from "../../../utils/request";
import Qs from "qs";

//查询合同待办
export async function selectAllInContractTask(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectAllInContractTask', {
    method: 'GET',
    params: {...params}
  });
  return res;
}


//查询常用审批用语
export async function selectApprovalOpinions(params: any) {
  const res = request('/api/contract-system/selectApprovalOpinions', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//查询常用审批用语
export async function selectApprovalMemo(params: any) {
  const res = request('/api/contract-system/selectApprovalMemo', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//获得下一个用户任务节点
export async function loadNextUserTaskDefinition(params: any) {
  const res = request('/api/contract-system/loadNextUserTaskDefinition', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//审批流程
export async function completeApprove(params: any) {
  const res = request('/api/contract-system/completeApprove', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//批量审批流程
export async function completeApproveBatch(params: any) {
  const res = request('/api/contract-system/completeApproveBatch', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}
