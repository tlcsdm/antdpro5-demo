import {Button, Space, Table} from 'antd';
import React, {useEffect, useRef} from 'react';
import 'moment/locale/zh-cn'
import Modal from "antd/es/modal/Modal";
import {selectDictionary} from "@/services/contract/common/dictionary";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {CheckOutlined} from "@ant-design/icons/lib";
import {ProFormInstance} from "@ant-design/pro-form";

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const PreChooseDictionaryMultiple = (props: any) => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const {isDictionaryModalVisible, isShowDictionaryModal, setDictionaryList, dictionaryType, dictDataSource} = props;

  const handleCancel = () => {
    isShowDictionaryModal(false);
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
      title: '名称',
      dataIndex: 'V_NAME',
      width: 150,
      hideInSearch: false,
      hideInTable: false
    }
  ];

  return (
    // 布局标签
    <Modal
      title={`选择${dictionaryType}`}
      width="1000px"
      visible={isDictionaryModalVisible}
      footer={[<Button key="close" type="primary" onClick={handleCancel}>关闭</Button>,]}
      onCancel={handleCancel}
    >
      <ProTable
        columns={columns}// 上面定义的表格列
        headerTitle={`${dictionaryType}列表`} // 表头
        actionRef={actionRef} // 用于触发刷新操作等，看api
        formRef={formRef}
        rowKey="I_ID"// 表格行 key 的取值，可以是字符串或一个函数
        manualRequest={false} // 是否需要手动触发首次请求
        options={{
          density: true, // 密度
          fullScreen: true, // 全屏
          reload: true, // 刷新
          setting: true // 列设置
        }}
        pagination={false}
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          getCheckboxProps: (record) => {
            if (dictDataSource && dictDataSource.length > 0) {
              for (let i = 0; i < dictDataSource.length; i++) {
                if (dictDataSource[i].V_NAME == record.V_NAME) {
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
                setDictionaryList(selectedRows);
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
          return await selectDictionary({...newParams, V_DICTIONARYTYPE: dictionaryType});
        }}
      />
    </Modal>
  );
};

export default PreChooseDictionaryMultiple;
