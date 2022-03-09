import React, {useEffect, useRef, useState} from 'react';
import 'moment/locale/zh-cn'
import Modal from "antd/es/modal/Modal";
import ProList from '@ant-design/pro-list';
import {Button, Tabs} from "antd";
import TabPane from "@ant-design/pro-card/es/components/TabPane";
import {ActionType} from "@ant-design/pro-table";
import {selectTemplate} from "@/services/contract/business/template";
import {selectPerToTemplate} from "@/services/contract/person/perToTemplate";
import {selectTemplateType} from "@/services/contract/business/templateType";
import {ProFormInstance} from "@ant-design/pro-form";

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const PreChooseTemplate = (props: any) => {
  const {isTemplateModalVisible, isShowTemplateModal, setTemplate} = props;
  const [tabKey, setTabKey] = useState('PerToTemplateTab');
  const [templateTypeList, setTemplateTypeList] = useState([]);//模板类型
  const templateActionRef = useRef<ActionType>();
  const perToTemplateActionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const handleCancel = () => {
    isShowTemplateModal(false);
  };

  //查询模板类型
  const initTemplateType = async () => {
    // 这里异步请求后台将数据拿到
    const response = await selectTemplateType({V_STATUS: '1'});
    const templateTempList: any = [];
    response.data.forEach(function (item: any) {
      const tempTemplateDetail: any = {value: item.I_ID, label: item.V_NAME};
      templateTempList.push(tempTemplateDetail);
    });
    setTemplateTypeList(templateTempList);
  };

  //useEffect参数为空数组时仅初始化执行一次
  useEffect(() => {
    initTemplateType();
  }, []);

  return (
    // 布局标签
    <Modal
      title={'选择合同模版'}
      width="1000px"
      visible={isTemplateModalVisible}
      onCancel={handleCancel}
      footer={[<Button key="close" type="primary" onClick={handleCancel}>关闭</Button>]}
    >
      <Tabs
        activeKey={tabKey}
        onChange={(key: string) => setTabKey(key)}
        type="card"
      >
        <TabPane key="PerToTemplateTab" tab="我的收藏">
          <ProList<any>
            search={{}}
            actionRef={perToTemplateActionRef}
            rowKey="I_ID"
            split={true}
            headerTitle={false}
            grid={{column: 3}}
            request={async (params) => {   //调用请求加载表格数据， 默认自动加载 params为Search的查询条件参数
              const newParams = {};
              //可对params传参进行进一步处理后再调用查询
              Object.assign(newParams, params);
              return await selectPerToTemplate({...newParams});
            }}
            onItem={(record: any) => {
              return {
                onClick: () => {
                  setTemplate(record);
                  handleCancel();
                },
              };
            }}
            pagination={false}
            showActions="hover"
            metas={{
              title: {
                dataIndex: 'V_NAME',
                title: '模版名称',
              }
            }}
          />
        </TabPane>
        <TabPane key="TemplateTab" tab="全部合同模版">
          <ProList<any>
            search={{}}
            formRef={formRef}
            actionRef={templateActionRef}
            rowKey="I_ID"
            split={true}
            headerTitle={false}
            grid={{column: 3}}
            request={async (params) => {   //调用请求加载表格数据， 默认自动加载 params为Search的查询条件参数
              const newParams = {};
              console.log(params);
              //可对params传参进行进一步处理后再调用查询
              Object.assign(newParams, params);
              return await selectTemplate({...newParams, V_STATUS: '1'});
            }}
            onItem={(record: any) => {
              return {
                onClick: () => {
                  setTemplate(record);
                  handleCancel();
                },
              };
            }}
            pagination={false}
            showActions="hover"
            metas={{
              type: {
                // 自己扩展的字段，主要用于筛选，不在列表中显示
                title: '模板类型',
                dataIndex: 'V_TYPEID',
                valueType: 'select',
                fieldProps: {
                  options: templateTypeList,
                  onChange() {
                    formRef.current?.submit();
                  }
                },
              },
              title: {
                dataIndex: 'V_NAME',
                title: '模版名称',
              }
            }}
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default PreChooseTemplate;
