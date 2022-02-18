//前台带过期时间的localStorage
/**
 * 存储数据
 * @param key key
 * @param value value
 * @param exp 过期时间，单位秒
 */
export const setLocalStorage = (key: string, value: any, exp: number): void => {
  var curtime = new Date().getTime();//获取当前时间
  var valueDate = JSON.stringify({data: value, time: curtime, exp: exp * 1000});
  try {
    localStorage.setItem(key, valueDate);
  } catch (e) {
    localStorage.clear();
  }
};

/*
 * 获取缓存数据
 */
export const getLocalStorage = (key: string): any => {
  var data = localStorage.getItem(key);//获取存储的元素
  if (!data) return false;
  var dataobj = JSON.parse(data);//解析出json对象
  if (new Date().getTime() - dataobj.time > dataobj.exp)//如果当前时间-减去存储的元素在创建时候设置的时间 > 过期时间
  {
    return false;
  } else {
    return dataobj.data;
  }
};
