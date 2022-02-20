import React, {useEffect, useRef, useState} from 'react';
import 'moment/locale/zh-cn'
import Modal from "antd/es/modal/Modal";
import ProList from '@ant-design/pro-list';
import {Button, Tabs} from "antd";
import {selectContractor} from "@/services/contract/business/contractor";
import TabPane from "@ant-design/pro-card/es/components/TabPane";
import {ActionType} from "@ant-design/pro-table";
import {selectPerToContractor} from "@/services/contract/person/perToContractor";

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const PreChooseContractor = (props: any) => {
  const {isContractorModalVisible, isShowContractorModal, setContractor} = props;
  const [tabKey, setTabKey] = useState('PerToContractorTab');
  const contractorActionRef = useRef<ActionType>();
  const perToContractorActionRef = useRef<ActionType>();

  const handleCancel = () => {
    isShowContractorModal(false);
  };

  //useEffect参数为空数组时仅初始化执行一次
  useEffect(() => {

  }, []);

  return (
    // 布局标签
    <Modal
      title={'选择承揽方'}
      width="1000px"
      visible={isContractorModalVisible}
      onCancel={handleCancel}
      footer={[<Button key="close" type="primary" onClick={handleCancel}>关闭</Button>,]}
    >
      <Tabs
        activeKey={tabKey}
        onChange={(key: string) => setTabKey(key)}
        type="card"
      >
        <TabPane key="PerToContractorTab" tab="我的收藏">
          <ProList<any>
            search={{}}
            actionRef={perToContractorActionRef}
            rowKey="I_ID"
            split={true}
            headerTitle={false}
            grid={{column: 3}}
            request={async (params) => {   //调用请求加载表格数据， 默认自动加载 params为Search的查询条件参数
              const newParams = {};
              //可对params传参进行进一步处理后再调用查询
              Object.assign(newParams, params);
              return await selectPerToContractor({...newParams});
            }}
            onItem={(record: any) => {
              return {
                onClick: () => {
                  setContractor(record);
                  handleCancel();
                },
              };
            }}
            pagination={false}
            showActions="hover"
            metas={{
              title: {
                dataIndex: 'V_NAME',
                title: '单位名称',
              }
            }}
          />
        </TabPane>
        <TabPane key="ContractorTab" tab="全部承揽方">
          <ProList<any>
            search={{}}
            actionRef={contractorActionRef}
            rowKey="I_ID"
            split={true}
            headerTitle={false}
            grid={{column: 3}}
            request={async (params) => {   //调用请求加载表格数据， 默认自动加载 params为Search的查询条件参数
              const newParams = {};
              //可对params传参进行进一步处理后再调用查询
              Object.assign(newParams, params);
              return await selectContractor({...newParams, V_STATUS: '1'});
            }}
            onItem={(record: any) => {
              return {
                onClick: () => {
                  setContractor(record);
                  handleCancel();
                },
              };
            }}
            pagination={false}
            showActions="hover"
            metas={{
              title: {
                dataIndex: 'V_NAME',
                title: '单位名称',
              }
            }}
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default PreChooseContractor;
