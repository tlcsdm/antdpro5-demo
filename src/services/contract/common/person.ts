import Qs from "qs";
import request from "@/utils/request";

//加载人员
export async function loadPerson(params: any) {
  const res = request('/api/contract-system/loadPerson', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//查询人员
export async function selectPerson(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectPerson', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增人员
export async function insertPerson(params: any) {
  const res = request('/api/contract-system/insertPerson', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//修改人员
export async function updatePerson(params: any) {
  const res = request('/api/contract-system/updatePerson', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//修改人员状态
export async function updatePersonStatus(params: any) {
  const res = request('/api/contract-system/updatePersonStatus', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//初始化人员密码
export async function initPersonPassWord(params: any) {
  const res = request('/api/contract-system/initPersonPassWord', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//修改人员密码
export async function updatePersonPassWord(params: any) {
  const res = request('/api/contract-system/updatePersonPassWord', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//删除人员
export async function deletePerson(params: any) {
  const res = request('/api/contract-system/deletePerson', {
    method: 'POST',
    data: Qs.stringify(params)
  });
  return res;
}





