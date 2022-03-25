import request from "@/utils/request";
import Qs from "qs";

//查询合同已办
export async function selectInvolvedProcessInstance(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectInvolvedProcessInstance', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//查询流程最后一个待办任务
export async function loadLastTask(params: any) {
  const res = request('/api/contract-system/loadLastTask', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//审批流程
export async function withDrawApprove(params: any) {
  const res = request('/api/contract-system/withDrawApprove', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}
