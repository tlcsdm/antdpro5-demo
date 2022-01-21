import { useState, useCallback } from 'react';

/**
 * 计数器
 * 使用 当组件只需要消费 model 中的部分参数，而对其他参数的变化并不关心时，可以传入一个函数用于过滤。函数的返回值将取代 model 的返回值，成为 useModel 的最终返回值。
 import { useModel } from 'umi';

 export default () => {
  const { add, minus } = useModel('model', (ret) => ({
    add: ret.increment,
    minus: ret.decrement,
  }));

  return (
    <div>
      <button onClick={add}>add by 1</button>
      <button onClick={minus}>minus by 1</button>
    </div>
  );
};
 */
export default () => {
  const [counter, setCounter] = useState(0);
  const increment = useCallback(() => setCounter((c) => c + 1), []);
  const decrement = useCallback(() => setCounter((c) => c - 1), []);
  return { counter, increment, decrement };
};
