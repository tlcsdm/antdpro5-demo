import {Button, Space, Table} from 'antd';
import React, {useEffect, useRef} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import 'moment/locale/zh-cn'
import {ProFormInstance} from '@ant-design/pro-form';
import {selectPerson} from "@/services/contract/common/person";
import Modal from "antd/es/modal/Modal";
import {CheckOutlined} from "@ant-design/icons/lib";

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const PreChoosePerson = (props: any) => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const {isUserModalVisible} = props; // 模态框是否显示
  const {isShowUserModal} = props; // 操作模态框显示隐藏的方法
  const {setPersonList} = props;
  const {personDataSource} = props;

  const handleCancel = () => {
    isShowUserModal(false);
  };

  //useEffect参数为空数组时仅初始化执行一次
  useEffect(() => {

  }, []);

  const columns: ProColumns[] = [  //定义 Protable的列 columns放在Protable
    {
      title: '序号',
      width: 50,
      hideInSearch: true,
      hideInTable: false,
      render: (text, record, index) => `${index + 1}`
    }, {
      title: '人员编码',
      dataIndex: 'V_PERCODE',
      width: 100,
      hideInSearch: false,
      hideInTable: false
    }, {
      title: '人员姓名',
      dataIndex: 'V_PERNAME',
      width: 100,
      hideInSearch: false,
      hideInTable: false
    }, {
      title: '员工号',
      dataIndex: 'V_YGCODE',
      width: 100,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '单位电话',
      dataIndex: 'V_TEL',
      width: 150,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '联系电话',
      dataIndex: 'V_LXDH_CLF',
      width: 100,
      hideInSearch: true,
      hideInTable: false
    }
  ];

  return (
    // 布局标签
    <Modal
      title={'选择人员'}
      width="1000px"
      visible={isUserModalVisible}
      footer={[<Button key="close" type="primary" onClick={handleCancel}>关闭</Button>,]}
      onCancel={handleCancel}
    >
      <ProTable
        columns={columns}// 上面定义的表格列
        headerTitle="人员列表" // 表头
        actionRef={actionRef} // 用于触发刷新操作等，看api
        formRef={formRef}
        rowKey="I_ID"// 表格行 key 的取值，可以是字符串或一个函数
        manualRequest={true} // 是否需要手动触发首次请求
        options={{
          density: true, // 密度
          fullScreen: true, // 全屏
          reload: true, // 刷新
          setting: true // 列设置
        }}
        pagination={{  //设置分页 ，可设置为pagination={false}不加分页
          pageSize: 20,
          current: 1
        }}
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          getCheckboxProps: (record) => {
            if (personDataSource && personDataSource.length > 0) {
              for (let i = 0; i < personDataSource.length; i++) {
                if (personDataSource[i].V_PERCODE == record.V_PERCODE) {
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
            <Button
              icon={<CheckOutlined/>}  //图标，其他图标可去ant官网搜索icon，单击即可复制
              type="primary"   //设置为主要键（蓝色）, 不加为白色,只能有一个type="primary"
              onClick={() => {  //点击事件
                setPersonList(selectedRows);
                handleCancel();
              }}>
              选择
            </Button>
          );
        }}
        search={{
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse()
          ]
        }}
        request={async (params) => {   //调用请求加载表格数据， 默认自动加载 params为Search的查询条件参数
          const newParams = {};
          //可对params传参进行进一步处理后再调用查询
          Object.assign(newParams, params);
          newParams['V_PERCODE_FORM'] = formRef?.current?.getFieldValue('V_PERCODE');
          return await selectPerson({...newParams, V_STATUS: '1'});
        }}
      />
    </Modal>
  );
};

export default PreChoosePerson;
