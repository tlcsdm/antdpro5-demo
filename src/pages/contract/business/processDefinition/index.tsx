import {Button} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import 'moment/locale/zh-cn'
import {ProFormInstance} from '@ant-design/pro-form';
import {PlusOutlined} from "@ant-design/icons/lib";
import {selectProcessDefinition} from "@/services/contract/business/processDefinition";
import InsertProcessDefinition from "@/pages/contract/business/processDefinition/components/InsertProcessDefinition";
import ViewProcessDefinitionDiagram from '../../../../components/View/ViewProcessDefinitionDiagram';

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const Applications: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalDiagramVisible, setIsModalDiagramVisible] = useState(false);
  const [deploymentId, setDeploymentId] = useState(undefined);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  /**
   * 控制模态框显示和隐藏
   */
  const isShowModal = (show: boolean | ((prevState: boolean) => boolean)) => {
    setIsModalVisible(show);
  };

  const isShowDiagramModal = (show: boolean | ((prevState: boolean) => boolean), id = undefined) => {
    setDeploymentId(id);
    setIsModalDiagramVisible(show);
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
      title: '流程定义名称',
      dataIndex: 'processDefinitionName',
      width: 180,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '流程定义代码',
      dataIndex: 'processDefinitionKey',
      width: 180,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '版本',
      dataIndex: 'version',
      width: 60,
      hideInSearch: true,
    }, {
      title: '状态',
      dataIndex: 'suspensionState',
      width: 60,
      hideInSearch: true,
    }, {
      title: '操作',
      width: 180,
      hideInSearch: true,
      valueType: 'option',  //操作列的类型
      render: (_, record) => [   //render渲染 record代表当前行
        <a key={record.deploymentId} onClick={() => isShowDiagramModal(true, record.deploymentId)}>查看流程图</a>
      ]
    }
  ];

  return (
    // 布局标签
    <PageContainer title={false} ghost>
      <ProTable
        columns={columns}// 上面定义的表格列
        headerTitle="流程定义列表" // 表头
        actionRef={actionRef} // 用于触发刷新操作等，看api
        formRef={formRef}
        rowKey="processDefinitionId"// 表格行 key 的取值，可以是字符串或一个函数
        manualRequest={false} // 是否需要手动触发首次请求
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
        toolBarRender={(action, {selectedRows}) => [ //工具栏 与 表头headerTitle同一行 可设置为false，设置false表头无效
          <Button
            icon={<PlusOutlined/>}  //图标，其他图标可去ant官网搜索icon，单击即可复制
            type="primary"   //设置为主要键（蓝色）, 不加为白色,只能有一个type="primary"
            onClick={() => {  //点击事件
              isShowModal(true);
            }}>
            新增流程定义
          </Button>
        ]}
        search={false}
        request={async (params) => {   //调用请求加载表格数据， 默认自动加载 params为Search的查询条件参数
          const newParams = {};
          //可对params传参进行进一步处理后再调用查询
          params.threshold = 1;
          Object.assign(newParams, params);
          return await selectProcessDefinition({...newParams});
        }}
      />
      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isModalVisible ? (
          ''
        ) : (
          <InsertProcessDefinition
            isModalVisible={isModalVisible}
            isShowModal={isShowModal}
            actionRef={actionRef}
          />
        )
      }
      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isModalDiagramVisible ? (
          ''
        ) : (
          <ViewProcessDefinitionDiagram
            isModalDiagramVisible={isModalDiagramVisible}
            isShowDiagramModal={isShowDiagramModal}
            deploymentId={deploymentId}
          />
        )
      }
    </PageContainer>
  );
};

export default Applications;
