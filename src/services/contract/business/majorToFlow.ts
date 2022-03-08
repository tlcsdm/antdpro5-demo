import Qs from "qs";
import request from "@/utils/request";

//查询流程定义
export async function selectMajorToFlow(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectMajorToFlow', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增专业流程关系
export async function insertMajorToFlow(params: any) {
  const res = request('/api/contract-system/insertMajorToFlow', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//删除专业流程关系
export async function deleteMajorToFlow(params: any) {
  const res = request('/api/contract-system/deleteMajorToFlow', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}





