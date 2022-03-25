import request from "@/utils/request";


//查询合同
export async function selectContractPermission(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectContractPermission', {
    method: 'GET',
    params: {...params}
  });
  return res;
}



