import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from "@ant-design/pro-layout";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button, message, Space, Table, Tabs} from "antd";
import TabPane from "@ant-design/pro-card/es/components/TabPane";
import {
  deletePerToTemplateBatch,
  insertPerToTemplateBatch,
  selectPerToTemplate
} from "@/services/contract/person/perToTemplate";
import {selectTemplate} from "@/services/contract/business/template";
import {selectTemplateType} from "@/services/contract/business/templateType";
import {ProFormInstance} from "@ant-design/pro-form";

const Applications: React.FC = () => {
  const [tabKey, setTabKey] = useState('TemplateTab');
  const [perToTemplateData, setPerToTemplateData] = useState([]);
  const [templateTypeList, setTemplateTypeList] = useState([]);//模板类型
  const templateActionRef = useRef<ActionType>();
  const perToTemplateActionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

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
    formRef.current?.setFieldsValue?.({V_TYPEID: ''});
  };

  useEffect(() => {
    initTemplateType();
  }, []);

  const refreshTable = async (key: any) => { //tab切换时,刷新ProTable
    if (key == 'PerToTemplateTab') {
      perToTemplateActionRef.current?.reload?.()
    }
  };

  const handleInsert = async (selectedRowKeys: any) => { //添加到我的收藏
    const response = await insertPerToTemplateBatch({V_TEMPLATEIDLIST: selectedRowKeys.toString()});
    if (response && response.success) {
      message.success('操作成功');
      templateActionRef.current?.clearSelected?.(); //清空选择
    } else {
      return false;
    }
    return true;
  };

  const handleDelete = async (selectedRowKeys: any) => { //移除我的收藏
    const hide = message.loading('正在删除');
    const response = await deletePerToTemplateBatch({I_IDLIST: selectedRowKeys.toString()});
    hide();
    if (response && response.success) {
      message.success('删除成功，即将刷新');
      perToTemplateActionRef.current?.reloadAndRest?.(); //清空选择
    } else {
      return false;
    }
    return true;
  };

  const columns: ProColumns[] = [
    {
      title: '序号',
      width: 50,
      hideInSearch: true,
      hideInTable: false,
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '模板类型',
      dataIndex: 'V_TYPEID',
      width: 150,
      valueType: 'select',
      fieldProps: {
        options: templateTypeList,
        onChange() {
          formRef.current?.submit();
        }
      },
      hideInSearch: tabKey !== 'TemplateTab',
      hideInTable: false
    },
    {
      title: '模版名称',
      dataIndex: 'V_NAME',
      width: 200,
      hideInSearch: false,
      hideInTable: false
    }
  ];

  return (
    <PageContainer title={false} ghost>
      <Tabs
        activeKey={tabKey}
        onChange={(key: string) => setTabKey(key)}
        type="card"
        onTabClick={(key: string) => refreshTable(key)}
        animated={false}
      >
        <TabPane key="TemplateTab" tab="合同模版列表">
          <ProTable
            rowSelection={{
              selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
              getCheckboxProps: (record) => {
                if (perToTemplateData && perToTemplateData.length > 0) {
                  for (let i = 0; i < perToTemplateData.length; i++) {
                    // @ts-ignore
                    if (perToTemplateData[i].V_NAME == record.V_NAME) {
                      return {disabled: true};
                    }
                  }
                }
                return {};
              }
            }}
            tableAlertRender={({selectedRowKeys, selectedRows, onCleanSelected}) => (
              <Space size={24}>
                  <span>
                    已选 {selectedRowKeys.length} 项
                      <a style={{marginLeft: 8}} onClick={onCleanSelected}>
                    取消选择
                      </a>
                  </span>
              </Space>
            )}
            tableAlertOptionRender={({selectedRowKeys, selectedRows, onCleanSelected}) => {
              return (
                <Space size={16}>
                  <Button
                    key="insert"
                    type="primary"
                    onClick={() => {
                      handleInsert(selectedRowKeys);
                    }}
                  >
                    添加到我的收藏
                  </Button>
                </Space>
              );
            }}
            rowKey="I_ID"
            formRef={formRef}
            columns={columns}// 上面定义的表格列
            actionRef={templateActionRef}
            manualRequest={false} // 是否需要手动触发首次请求
            options={{
              density: true, // 密度
              fullScreen: true, // 全屏
              reload: true, // 刷新
              setting: true // 列设置
            }}
            pagination={{  //设置分页 ，可设置为pagination={false}不加分页
              pageSize: 100,
              current: 1
            }}
            search={{
              defaultCollapsed: false,
              optionRender: (searchConfig, formProps, dom) => [
                ...dom.reverse(),
              ]
            }}
            request={async (params) => {   //调用请求加载表格数据， 默认自动加载 params为Search的查询条件参数
              const newParams = {"V_STATUS": "1"};
              //可对params传参进行进一步处理后再调用查询
              Object.assign(newParams, params);
              return await selectTemplate({...newParams});
            }}
          />
        </TabPane>
        <TabPane key="PerToTemplateTab" tab="我的收藏">
          <ProTable
            scroll={{y: 700}}
            rowSelection={{}}
            tableAlertRender={({selectedRowKeys, selectedRows, onCleanSelected}) => (
              <Space size={24}>
                  <span>
                    已选 {selectedRowKeys.length} 项
                      <a style={{marginLeft: 8}} onClick={onCleanSelected}>
                    取消选择
                      </a>
                  </span>
              </Space>
            )}
            tableAlertOptionRender={({selectedRowKeys, selectedRows, onCleanSelected}) => {
              return (
                <Space size={16}>
                  <Button
                    key="delete"
                    type="primary"
                    onClick={() => {
                      handleDelete(selectedRowKeys);
                    }}
                  >
                    移出我的收藏
                  </Button>
                </Space>
              );
            }}
            rowKey="I_ID"
            actionRef={perToTemplateActionRef}
            columns={columns}// 上面定义的表格列
            manualRequest={false} // 是否需要手动触发首次请求
            options={{
              density: true, // 密度
              fullScreen: true, // 全屏
              reload: true, // 刷新
              setting: true // 列设置
            }}
            pagination={false}
            search={{
              defaultCollapsed: false,
              optionRender: (searchConfig, formProps, dom) => [
                ...dom.reverse(),
              ]
            }}
            request={async (params) => {   //调用请求加载表格数据， 默认自动加载 params为Search的查询条件参数
              const newParams = {};
              //可对params传参进行进一步处理后再调用查询
              Object.assign(newParams, params);
              const req = await selectPerToTemplate({...newParams});
              setPerToTemplateData(req.data);
              return req;
            }}
          />
        </TabPane>
      </Tabs>
    </PageContainer>
  )
};

export default Applications;



