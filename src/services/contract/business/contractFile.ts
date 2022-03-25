import {download} from "@/utils/base";
import request from "@/utils/request";
import Qs from "qs";

//加载合同文件json信息
export async function loadContractFileJson(params: any) {
  const res = request('/api/contract-system/loadContractFileJson', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//查询合同文件
export async function selectContractFile(params: any) {
  const res = request('/api/contract-system/selectContractFile', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//修改合同文件
export async function updateContractFile(params: any) {
  const res = request('/api/contract-system/updateContractFile', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

/**
 * 导出合同文件
 * @param params
 */
export async function downloadContractFile(params?: { [key: string]: any }) {
  return download('/api/contract-system/downloadContractFile', params);
}
