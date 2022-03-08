import Qs from "qs";
import request from "@/utils/request";

//查询人员常用模版
export async function selectPerToTemplate(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectPerToTemplate', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增人员常用模版
export async function insertPerToTemplateBatch(params: any) {
  const res = request('/api/contract-system/insertPerToTemplateBatch', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//删除人员常用模版
export async function deletePerToTemplateBatch(params: any) {
  const res = request('/api/contract-system/deletePerToTemplateBatch', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}





