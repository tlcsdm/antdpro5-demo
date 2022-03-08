import {upload} from "@/utils/base";

/**
 * 系统文件上传
 * @param formData
 */
export async function insertSystemRider(formData: FormData) {
  return upload('/api/contract-system/insertSystemRider', formData);
}
