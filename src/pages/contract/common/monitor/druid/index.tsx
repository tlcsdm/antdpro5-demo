import React, {useEffect} from 'react';
import 'moment/locale/zh-cn';

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const Applications: React.FC = () => {

  useEffect(() => {
  }, []);

  return (
    <iframe style={{border: 0, width: "100%", height: 830,}} src="/api/contract-system/druid/index.html"/>
  );
};

export default Applications;
