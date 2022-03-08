import React, {useEffect} from 'react';
import 'antd/dist/antd.min.css';
import Modal from 'antd/es/modal/Modal';
import {Button} from 'antd';
import {loadLog} from '@/services/contract/common/log';
import ProDescriptions from "@ant-design/pro-descriptions";
import {successEnum} from "@/utils/enum";

const ViewLog = (props: any) => {
  const {isModalVisible, isShowModal, logId} = props; // 模态框是否显示

  const handleCancel = () => {
    isShowModal(false);
  };

  //初始化
  useEffect(() => {

  }, []);

  return (
    <Modal
      title={'查看日志'}
      width="1200px"
      visible={isModalVisible}
      footer={[<Button key="close" type="primary" onClick={handleCancel}>关闭</Button>,]}
      onCancel={handleCancel}
    >
      <ProDescriptions
        title="日志详情信息"
        column={2}
        bordered
        request={async (params) => {   //调用请求加载表格数据， 默认自动加载 params为Search的查询条件参数
          return await loadLog({I_ID: logId});
        }}
        columns={[
          {
            title: '服务名',
            dataIndex: 'V_SERVICE',
          }, {
            title: '模块名',
            dataIndex: 'V_TITLE',
            copyable: true
          }, {
            title: '主机名',
            dataIndex: 'V_HOSTNAME',
          }, {
            title: '操作人',
            dataIndex: 'V_OPERATEPER',
            copyable: true
          }, {
            title: '客户端IP',
            dataIndex: 'V_IP',
            copyable: true
          }, {
            title: '浏览器信息',
            dataIndex: 'V_BROWSER',
          }, {
            title: '浏览器版本',
            dataIndex: 'V_VERSION',
          }, {
            title: '操作系统信息',
            dataIndex: 'V_OS',
          }, {
            title: '操作类型',
            dataIndex: 'V_OPERATETYPE',
          }, {
            title: '请求方法名',
            dataIndex: 'V_SIGNATURE',
          }, {
            title: '操作时间',
            dataIndex: 'V_CREATETIME',
            valueType: 'dateTime'
          }, {
            title: '状态',
            dataIndex: 'V_SUCCESS',
            valueType: 'select',
            valueEnum: successEnum
          }, {
            title: 'traceid',
            dataIndex: 'I_TRACEID',
            copyable: true
          }, {
            title: '项目版本',
            dataIndex: 'V_PROVERSION',
          }
        ]}
      >
        <ProDescriptions.Item dataIndex="V_URL" span={2} label="请求路径"/>
        <ProDescriptions.Item dataIndex="V_PARAMS" span={2} label="请求参数"/>
        <ProDescriptions.Item dataIndex="V_ERRMESSAGE" span={2} label="错误信息"/>
      </ProDescriptions>
    </Modal>
  );
};
export default ViewLog;
