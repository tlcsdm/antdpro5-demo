import React, {useEffect} from 'react';
import 'antd/dist/antd.min.css';
import Modal from "antd/es/modal/Modal";
import {Button} from "antd";
import {loadPerson} from "@/services/contract/common/person";
import ProDescriptions from "@ant-design/pro-descriptions";
import {statusEnum} from "@/utils/enum";

const ViewPerson = (props: any) => {
  const {isViewPersonModalVisible, isPersonShowModal, personId} = props;

  const handleCancel = () => {
    isPersonShowModal(false);
  };

  //初始化
  useEffect(() => {

  }, []);

  return (
    <Modal
      title={"查看人员"}
      width="800px"
      visible={isViewPersonModalVisible}
      footer={[<Button key="close" type="primary" onClick={handleCancel}>关闭</Button>]}
      onCancel={handleCancel}
    >
      <ProDescriptions
        title="人员详情信息"
        column={2}
        bordered
        request={async (params) => {   //调用请求加载表格数据， 默认自动加载 params为Search的查询条件参数
          return await loadPerson({I_ID: personId});
        }}
        columns={[
          {
            title: '人员编码',
            dataIndex: 'V_PERCODE',
            copyable: true
          }, {
            title: '人员姓名',
            dataIndex: 'V_PERNAME',
          }, {
            title: '人员登陆名',
            dataIndex: 'V_LOGINNAME',
          }, {
            title: '状态',
            dataIndex: 'V_STATUS',
            valueType: 'select',
            valueEnum: statusEnum
          }, {
            title: '单位电话',
            dataIndex: 'V_TEL',
          }, {
            title: '联系电话',
            dataIndex: 'V_LXDH_CLF',
          }, {
            title: '身份证号码',
            dataIndex: 'V_SFZH',
          }, {
            title: 'sap账号',
            dataIndex: 'V_SAPPER',
          }, {
            title: '员工号',
            dataIndex: 'V_YGCODE',
          }, {
            title: '是否接收即时通',
            dataIndex: 'V_TOAM',
          }, {
            title: '即时通号',
            dataIndex: 'V_AM',
          }, {
            title: '职级',
            dataIndex: 'V_ZJ',
          }, {
            title: '职务',
            dataIndex: 'V_ZW',
          }, {
            title: '显示排序',
            dataIndex: 'I_ORDER',
          }, {
            title: '最后登录时间',
            dataIndex: 'D_DATE_LOGIN',
            valueType: 'dateTime'
          }, {
            title: '创建时间',
            dataIndex: 'D_DATE_CREATE',
            valueType: 'dateTime'
          }, {
            title: '最后修改时间',
            dataIndex: 'D_DATE_EDIT',
            valueType: 'dateTime'
          }, {
            title: '最后修改人',
            dataIndex: 'V_PER_EDIT',
            copyable: true
          }
        ]}
      >
      </ProDescriptions>
    </Modal>
  );
};
export default ViewPerson;
