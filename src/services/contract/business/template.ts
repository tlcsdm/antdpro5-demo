import Qs from "qs";
import request from '@/utils/request';

//加载模板
export async function loadTemplate(params: any) {
  const res = request('/api/contract-system/loadTemplate', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//查询模板
export async function selectTemplate(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectTemplate', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//删除模板
export async function deleteTemplate(params: any) {
  const res = request('/api/contract-system/deleteTemplate', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//修改模板类型状态
export async function updateTemplateStatus(params: any) {
  const res = request('/api/contract-system/updateTemplateStatus', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}





