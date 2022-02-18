import Qs from "qs";
import request from '@/utils/request';

//加载模板类型
export async function loadTemplateType(params: any) {
  const res = request('/api/contract-system/loadTemplateType', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//查询模板类型
export async function selectTemplateType(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectTemplateType', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增模板类型
export async function insertTemplateType(params: any) {
  const res = request('/api/contract-system/insertTemplateType', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//修改模板类型
export async function updateTemplateType(params: any) {
  const res = request('/api/contract-system/updateTemplateType', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//修改模板类型状态
export async function updateTemplateTypeStatus(params: any) {
  const res = request('/api/contract-system/updateTemplateTypeStatus', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}

//删除模板类型
export async function deleteTemplateType(params: any) {
  const res = request('/api/contract-system/deleteTemplateType', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}





