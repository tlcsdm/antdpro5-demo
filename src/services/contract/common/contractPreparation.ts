import Qs from "qs";
import request from "@/utils/request";

//加载合同
export async function loadContract(params: any) {
  const res = request('/api/contract-system/loadContract', {
    method: 'GET',
    params: {...params}
  });
  return res;
}


//查询合同
export async function selectContract(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectContract', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增合同
export async function insertContract(params: any) {
  const res = request('/api/contract-system/insertContract', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//修改合同
export async function updateContract(params: any) {
  const res = request('/api/contract-system/updateContract', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//删除合同
export async function deleteContract(params: any) {
  const res = request('/api/contract-system/deleteContract', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}

//上报合同流程
export async function startContractProcess(params: any) {
  const res = request('/api/contract-system/startContractProcess', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}

//获得第一个用户任务节点
export async function selectFirstTaskProcCandidate(params: any) {
  const res = request('/api/contract-system/selectFirstTaskProcCandidate', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//查询合同范本
export async function selectTemplateAndType(params: any) {
  const res = request('/api/contract-system/selectTemplateAndType', {
    method: 'GET',
    params: {...params}
  });
  return res;
}


