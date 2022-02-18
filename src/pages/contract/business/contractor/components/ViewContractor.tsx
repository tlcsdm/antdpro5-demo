import React, {useEffect} from 'react';
import 'antd/dist/antd.min.css';
import Modal from 'antd/es/modal/Modal';
import {Button} from 'antd';
import {loadContractor} from '@/services/contract/business/contractor';
import ProDescriptions from '@ant-design/pro-descriptions';

const ViewContractor = (props: any) => {
  const {isViewContractorModalVisible} = props; // 模态框是否显示
  const {isContractorShowModal} = props; // 操作模态框显示隐藏的方法
  const {contractorId} = props;

  const handleCancel = () => {
    isContractorShowModal(false);
  };

  //初始化
  useEffect(() => {

  }, []);

  return (
    <Modal
      title={'查看承揽方'}
      width="1000px"
      visible={isViewContractorModalVisible}
      onCancel={handleCancel}
      footer={[<Button key="close" type="primary" onClick={handleCancel}>关闭</Button>,]}
    >
      <ProDescriptions
        title="承揽方详情信息"
        column={1}
        request={async (params) => {   //调用请求加载表格数据， 默认自动加载 params为Search的查询条件参数
          return await loadContractor({I_ID: contractorId});
        }}
        columns={[
          {
            title: '单位名称',
            dataIndex: 'V_NAME',
          }, {
            title: '单位法人',
            dataIndex: 'V_LEGAL',
          }, {
            title: '单位委托人',
            dataIndex: 'V_REPRESENTITIVE',
          }, {
            title: '单位地址',
            dataIndex: 'V_ADDRESS',
          }, {
            title: '企业性质',
            dataIndex: 'V_NATURE',
          }, {
            title: '注册资金(元)',
            dataIndex: 'I_REGEREDCAPITAL',
            valueType: 'money',
          }, {
            title: '经营许可',
            dataIndex: 'V_LICENSE',
            ellipsis: true,
          }, {
            title: '开户银行',
            dataIndex: 'V_BANK',
          }, {
            title: '银行帐号',
            dataIndex: 'V_ACCOUNT',
          }, {
            title: '联系电话',
            dataIndex: 'V_PHONE',
          }, {
            title: '信用等级',
            dataIndex: 'V_CREDIT',
          },
        ]}
      >
      </ProDescriptions>
    </Modal>
  );
};
export default ViewContractor;
