import Qs from "qs";
import request from "@/utils/request";

//查询专业
export async function selectMajor(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectMajor', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增专业
export async function insertMajorBatch(params: any) {
  const res = request('/api/contract-system/insertMajorBatch', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//删除专业
export async function deleteMajor(params: any) {
  const res = request('/api/contract-system/deleteMajor', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}





