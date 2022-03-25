import {Button} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import 'moment/locale/zh-cn'
import {ProFormInstance} from '@ant-design/pro-form';
import Modal from "antd/es/modal/Modal";
import {selectApprovalMemo} from "@/services/contract/person/approval";
import {activityStatus} from "@/utils/enum";
import {SnippetsOutlined} from "@ant-design/icons/lib";
import ViewProcessDiagram from './ViewProcessDiagram';

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const ViewApprovalMemo = (props: any) => {
  const {isOpinionModalVisible, isShowOpinionModal, bizId, processInstanceId} = props;
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [isProcessDiagramModalVisible, setIsProcessDiagramModalVisible] = useState(false);

  /**
   * 控制模态框显示和隐藏
   */
  const isShowProcessDiagramModal = (show: boolean | ((prevState: boolean) => boolean)) => {
    setIsProcessDiagramModalVisible(show);
  };

  const handleCancel = () => {
    isShowOpinionModal(false);
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
      title: '任务名称',
      dataIndex: 'TASK_NAME_',
      width: 150,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '人员名称',
      dataIndex: 'ASSIGNEE_NAME_',
      width: 100,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '审批日期',
      dataIndex: 'CREATION_DATE_',
      width: 150,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '审批意见',
      dataIndex: 'APPROVAL_MEMO_',
      width: 150,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '审批状态',
      dataIndex: 'APPROVAL_MEMO_STATUS_',
      width: 100,
      hideInSearch: true,
      hideInTable: false,
      valueEnum: activityStatus,
    }
  ];

  return (
    // 布局标签
    <Modal
      title={'审批意见'}
      width="1000px"
      visible={isOpinionModalVisible}
      footer={[<Button key="close" type="primary" onClick={handleCancel}>关闭</Button>,]}
      onCancel={handleCancel}
    >
      <ProTable
        columns={columns}// 上面定义的表格列
        headerTitle="审批意见列表" // 表头
        actionRef={actionRef} // 用于触发刷新操作等，看api
        formRef={formRef}
        rowKey="TASK_ID_"// 表格行 key 的取值，可以是字符串或一个函数
        //manualRequest={true} // 是否需要手动触发首次请求
        search={false}
        pagination={false}
        options={{
          density: true, // 密度
          fullScreen: true, // 全屏
          reload: true, // 刷新
          setting: true // 列设置
        }}
        toolBarRender={(action, {selectedRows}) => [ //工具栏 与 表头headerTitle同一行 可设置为false，设置false表头无效
          <Button
            icon={<SnippetsOutlined/>}  //图表，其他图标可去ant官网搜索icon，单击即可复制
            type="primary"   //设置为主要键（蓝色）, 不加为白色
            onClick={() => {  //点击事件
              isShowProcessDiagramModal(true);
            }}>
            查看流程图
          </Button>
        ]}
        request={async (params) => {   //调用请求加载表格数据， 默认自动加载 params为Search的查询条件参数
          const newParams = {};
          //可对params传参进行进一步处理后再调用查询
          Object.assign(newParams, params);
          newParams['PROC_INST_ID_'] = processInstanceId;
          newParams['BIZ_ID_'] = bizId;
          return await selectApprovalMemo({...newParams, V_STATUS: '1'});
        }}
      />

      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isProcessDiagramModalVisible ? (
          ''
        ) : (
          <ViewProcessDiagram
            isProcessDiagramModalVisible={isProcessDiagramModalVisible}
            isShowProcessDiagramModal={isShowProcessDiagramModal}
            procInstanceId={processInstanceId}
          />
        )
      }
    </Modal>
  );
};

export default ViewApprovalMemo;
