import Qs from "qs";
import request from '@/utils/request';

//登录
export async function login(params: any) {
  const res = request('/api/contract-system/login', {
    method: 'POST',
    data: Qs.stringify(params),
  });
  return res;
}

//加载人员信息
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/contract-system/loadPersonByCode', {
    method: 'GET',
    ...(options || {}),
  });
}
