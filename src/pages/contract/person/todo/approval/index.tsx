import React, {useRef, useState} from 'react';
import {PageContainer} from "@ant-design/pro-layout";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {selectContractor} from "@/services/contract/business/contractor";
import {
  deletePerToContractorBatch,
  insertPerToContractorBatch,
  selectPerToContractor
} from "@/services/contract/person/perToContractor";
import {Button, message, Space, Table, Tabs} from "antd";
import TabPane from "@ant-design/pro-card/es/components/TabPane";
import ViewContractor from "@/pages/contract/business/contractor/components/ViewContractor";

const Applications: React.FC = () => {
  const [tabKey, setTabKey] = useState('ContractorTab');
  const [isViewContractorModalVisible, setIsViewContractorModalVisible] = useState(false);
  const [contractorId, setContractorId] = useState(undefined);
  const [perToContractorData, setPerToContractorData] = useState([]);
  const contractorActionRef = useRef<ActionType>();
  const perToContractorActionRef = useRef<ActionType>();

  /**
   * 查看模态框显示和隐藏
   */
  const isContractorShowModal = (show: boolean | ((prevState: boolean) => boolean), id = undefined) => {
    setContractorId(id);
    setIsViewContractorModalVisible(show);
  };

  const refreshTable = async (key: any) => { //tab切换时,刷新ProTable
    if (key == 'PerToContractorTab') {
      perToContractorActionRef.current?.reload?.()
    }
  };

  const handleInsert = async (selectedRowKeys: any) => { //添加到我的收藏
    const response = await insertPerToContractorBatch({CONTRACTOR_IDLIST: selectedRowKeys.toString()});
    if (response && response.success) {
      message.success('操作成功');
      contractorActionRef.current?.clearSelected?.(); //清空选择
    } else {
      return false;
    }
    return true;
  };

  const handleDelete = async (selectedRowKeys: any) => { //移除我的收藏
    const hide = message.loading('正在删除');
    const response = await deletePerToContractorBatch({I_IDLIST: selectedRowKeys.toString()});
    hide();
    if (response && response.success) {
      message.success('删除成功，即将刷新');
      perToContractorActionRef.current?.reloadAndRest?.(); //清空选择
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
      title: '单位名称',
      dataIndex: 'V_NAME',
      width: 200,
      hideInSearch: false,
      hideInTable: false,
      render: (_, record) => [
        <a key={record.I_ID}
           onClick={() => isContractorShowModal(true, tabKey == 'ContractorTab' ? record.I_ID : record.CONTRACTOR_ID)}>{_}</a>
      ],
    }, {
      title: '单位地址',
      dataIndex: 'V_ADDRESS',
      width: 250,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '法定代表人',
      dataIndex: 'V_LEGAL',
      width: 65,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '委托代理人',
      dataIndex: 'V_REPRESENTITIVE',
      width: 65,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '联系电话',
      dataIndex: 'V_PHONE',
      width: 80,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '信用等级',
      dataIndex: 'V_CREDIT',
      width: 70,
      hideInSearch: true,
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
        <TabPane key="ContractorTab" tab="承揽方收藏">
          <ProTable
            rowSelection={{
              selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
              getCheckboxProps: (record) => {
                if (perToContractorData && perToContractorData.length > 0) {
                  for (let i = 0; i < perToContractorData.length; i++) {
                    // @ts-ignore
                    if (perToContractorData[i].V_NAME == record.V_NAME) {
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
            columns={columns}// 上面定义的表格列
            actionRef={contractorActionRef}
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
              return await selectContractor({...newParams});
            }}
          />
        </TabPane>
        <TabPane key="PerToContractorTab" tab="我的收藏">
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
            actionRef={perToContractorActionRef}
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
              const req = await selectPerToContractor({...newParams});
              setPerToContractorData(req.data);
              return req;
            }}
          />
        </TabPane>
      </Tabs>
      {
        !isViewContractorModalVisible ? (
          ''
        ) : (
          <ViewContractor
            isViewContractorModalVisible={isViewContractorModalVisible}
            isContractorShowModal={isContractorShowModal}
            contractorId={contractorId}
          />
        )
      }
    </PageContainer>
  )
};

export default Applications;



