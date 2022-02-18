import Qs from "qs";
import request from "@/utils/request";

//查询专业对应角色
export async function selectMajorToRole(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectMajorToRole', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增专业对应角色
export async function insertMajorToRoleBatch(params: any) {
  const res = request('/api/contract-system/insertMajorToRoleBatch', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//删除专业对应角色
export async function deleteMajorToRole(params: any) {
  const res = request('/api/contract-system/deleteMajorToRole', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}





