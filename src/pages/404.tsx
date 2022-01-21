import {Button, Result} from 'antd';
import React from 'react';
import {history} from 'umi';

const NoFoundPage: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="当前页不存在."
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        返回上一页
      </Button>
    }
  />
);

export default NoFoundPage;
