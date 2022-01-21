/**
 * @Author：TangLiang
 * @Description：路由切换时，显示该组件
 * @Data: 2022/1/21 9:53
 */
import React from 'react';
import { Spin } from 'antd';

export default () => {
  return (
    <div style={{textAlign:'center',margin:'auto'}}>
      <Spin size='large'/>
    </div>
  );
};
