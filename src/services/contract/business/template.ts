import Qs from "qs";
import request from '@/utils/request';
import {download, upload} from "@/utils/base";

//加载模板
export async function loadTemplate(params: any) {
  const res = request('/api/contract-system/loadTemplate', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//根据合同模板获取html
export async function loadTemplateHtmlByWord(params: any) {
  const res = request('/api/contract-system/loadTemplateHtmlByWord', {
    method: 'GET',
    params: {...params}
  });
  return res;
}

//加载模板html代码
export async function loadTemplateHtml(params: any) {
  const res = request('/api/contract-system/loadTemplateHtml', {
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

/**
 * 新增模版
 * @param formData
 */
export async function insertTemplate(formData: FormData) {
  return upload('/api/contract-system/insertTemplate', formData);
}

/**
 * 修改模版
 * @param formData
 */
export async function updateTemplate(formData: FormData) {
  return upload('/api/contract-system/updateTemplate', formData);
}

//修改模板类型状态
export async function updateTemplateStatus(params: any) {
  const res = request('/api/contract-system/updateTemplateStatus', {
    method: 'POST',
    data: Qs.stringify(params)
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

/**
 * 下载模版
 * @param params
 */
export async function downloadTemplate(params?: { [key: string]: any }) {
  return download('/api/contract-system/downloadTemplate', params);
}




