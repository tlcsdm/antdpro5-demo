import React, {useState} from 'react'
import {message, Switch} from 'antd'

/**
 * 状态组件操作
 */
const StatusSwitch: React.FC<{
  row: { [key: string]: any },
  updateStatus: any
}> = (props: any) => {
  const {row, updateStatus} = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(row.V_STATUS === '1');

  const toggle = async () => {
    try {
      setLoading(true);
      const rep = await updateStatus({I_ID: row.I_ID, V_STATUS: row.V_STATUS === '1' ? '0' : '1'});
      if (rep && rep.success) {
        message.success('操作成功');
      }
      setChecked(!checked)
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      loading={loading}
      onClick={toggle}
      checked={checked}
    />
  )
};
export default StatusSwitch;
