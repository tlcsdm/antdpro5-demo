import request from "@/utils/request";
import {upload} from "@/utils/base";

//加载流程定义
export async function loadRole(params: any) {
  const res = request('/api/contract-system/loadRole', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//查询流程定义
export async function selectProcessDefinition(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectProcessDefinition', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增流程定义
export async function insertProcessDefinition(formData: FormData) {
  return upload('/api/contract-system/insertProcessDefinition', formData);
}



