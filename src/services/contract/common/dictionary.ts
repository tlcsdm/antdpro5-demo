import Qs from "qs";
import request from "umi-request";

//加载字典
export async function loadDictionary(params: any) {
  const res = request('/api/contract-system/loadDictionary', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//查询字典
export async function selectDictionary(params: any) {
  /*
  关于组件读取数据-请求后端成功返回的json串，默认data，不叫data，页面看不到数据
  如果是 GET 请求，请将 data 修改成 params
   */
  const res = request('/api/contract-system/selectDictionary', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//新增字典
export async function insertDictionary(params: any) {
  const res = request('/api/contract-system/insertDictionary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    dataType: 'json',
    data: Qs.stringify(params),
  });
  return res;
}

//修改字典
export async function updateDictionary(params: any) {
  const res = request('/api/contract-system/updateDictionary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    dataType: 'json',
    data: Qs.stringify(params),
  });
  return res;
}

//删除字典
export async function deleteDictionary(params: any) {
  const res = request('/api/contract-system/deleteDictionary', {
    method: 'Post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: Qs.stringify(params)
  });
  return res;
}





