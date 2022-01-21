import request from "umi-request";

export async function selectContractMenu(params: any) {
  return request('/api/contract-system/selectContractMenu', {
    method: 'GET',
    params: {...params}
  });
}
