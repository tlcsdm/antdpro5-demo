import {download} from "@/utils/base";
import request from "@/utils/request";
import Qs from "qs";

//查询合同附件
export async function selectContractRider(params: any) {
  const res = request('/api/contract-system/selectContractRider', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增合同附件
export async function insertContractRider(params: any) {
  const res = request('/api/contract-system/insertContractRider', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//删除合同附件
export async function deleteContractRider(params: any) {
  const res = request('/api/contract-system/deleteContractRider', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

/**
 * 根据合同id下载合同附件
 * @param params
 */
export async function downloadContractRiderByGuid(params?: { [key: string]: any }) {
  return download('/api/contract-system/downloadContractRiderByGuid', params);
}

//下载合同附件
export async function downloadContractRider(params?: { [key: string]: any }) {
  return download('/api/contract-system/downloadContractRider', params);
}
