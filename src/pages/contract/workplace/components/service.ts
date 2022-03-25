import request from "@/utils/request";

export async function queryWorkitems(payload: {
  name: string,
  type: number
}) {
  // eslint-disable-next-line no-console
  console.log(payload.name, payload.type);
  // 待办 可办 已办
  return request('/api/v1/workspace/workitems/');
}
