import {request} from "umi";
import Cookies from "js-cookie";

/**
 * 通用下载方法
 * @param url 地址
 * @param params 参数
 */
export const download = (url: string, params?: { [key: string]: any }) => {
  let downloadUrl = `${url}?V_PERCODE=` + Cookies.get('V_PERCODE');
  for (let param in params) {
    if (params.hasOwnProperty(param))
      downloadUrl += `&${param}=` + encodeURIComponent(params[param] ? params[param] : '');
  }
  downloadUrl += '&random=' + Math.random();
  window.location.href = downloadUrl;
};

/**
 * 通用文件上传
 * @param url 地址
 * @param formData 数据对象 FormData
 */
export const upload = (url: string, formData: FormData) => {
  formData.append('V_PERCODE', (Cookies as any).get('V_PERCODE'));
  return request(`${url}`, {
    method: 'POST',
    requestType: 'form',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': '*/*',
    },
    data: formData,
  })
};

/**
 * 构造树型结构数据
 * @param params
 */
export const makeTree = (params: {
  dataSource: Record<string, any>[],
  id?: string | 'I_ID', //id字段 默认 'I_ID'
  parentId?: string | 'I_PID', //父节点字段 默认 'I_PID'
  children?: string | 'children', //孩子节点字段 默认 'children'
  enhance?: Record<string, string> | {}, //{{ [key: string]: any }} enhance 增强参数，通常用于增强或适配需要的参数
  rootId?: number | false | -1 //rootId 根Id 默认 -1
}) => {
  // 获取默认数据
  const id = params.id || 'I_ID';
  const parentId = params.parentId || 'I_PID';
  const children = params.children || 'children';
  const enhance = params.enhance || [];
  const rootId = params.rootId || -1;
  // 对源数据深克隆
  const cloneData = JSON.parse(JSON.stringify(params.dataSource));
  // 循环所有项
  const treeData = cloneData.filter((father: { [key: string]: any; children: any }) => {
    // 增强参数
    for (const key in enhance) {
      father[key] = father[enhance[key]]
    }
    // 循环找出每个父目录的子目录
    const branchArr = cloneData.filter((child: Record<string, any>) => {
      // 返回每一项的子级数组
      return father[id] === child[parentId]
    });
    // 放进子分类
    if (branchArr.length > 0) {
      father[children] = branchArr
    }
    // 无需判断直接返回
    if (!rootId && rootId != 0) {
      return true
    }
    // 返回第一层
    return father[parentId] === rootId
  });
  if (treeData.length > 0) {
    return treeData
  }
  return cloneData
};
