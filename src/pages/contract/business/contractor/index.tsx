import {PlusOutlined} from '@ant-design/icons';
import {Button, Divider, message, Popconfirm} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import 'moment/locale/zh-cn'
import UpdateContractor from "./components/UpdateContractor";
import ViewContractor from "./components/ViewContractor";
import {ProFormInstance} from '@ant-design/pro-form';
import {deleteContractor, selectContractor, updateContractorStatus} from "@/services/contract/business/contractor";
import {statusEnum} from "@/utils/enum";

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const Applications: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewContractorModalVisible, setIsViewContractorModalVisible] = useState(false);
  const [contractorId, setContractorId] = useState(undefined);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  /**
   * 控制模态框显示和隐藏
   */
  const isShowModal = (show: boolean | ((prevState: boolean) => boolean), id = undefined) => {
    setContractorId(id);
    setIsModalVisible(show);
  };

  /**
   * 查看模态框显示和隐藏
   */
  const isContractorShowModal = (show: boolean | ((prevState: boolean) => boolean), id = undefined) => {
    setContractorId(id);
    setIsViewContractorModalVisible(show);
  };

  //useEffect参数为空数组时仅初始化执行一次
  useEffect(() => {

  }, []);

  //修改状态
  const updateStatus = async (id: any, V_STATUS: string, status: any) => {
    if (V_STATUS === status) return;
    const rep = await updateContractorStatus({I_ID: id, V_STATUS: status});
    if (rep && rep.success) {
      message.success('操作成功');
      actionRef.current?.reloadAndRest?.(); //刷新Protable
    }
  };

  //删除承揽方
  const handleRemove = async (id: any) => {
    if (!id) return true;
    const hide = message.loading('正在删除');
    const req = await deleteContractor({
      I_ID: id
    });
    hide();
    if (req && req.success) {
      message.success('删除成功，即将刷新');
      actionRef.current?.reloadAndRest?.(); //刷新Protable
    }
    return true;
  };

  const columns: ProColumns[] = [  //定义 Protable的列 columns放在Protable
    {
      title: '序号',
      width: 50,
      hideInSearch: true,
      hideInTable: false,
      render: (text, record, index) => `${index + 1}`
    }, {
      title: '单位名称',
      dataIndex: 'V_NAME',
      width: 180,
      hideInSearch: false,
      hideInTable: false,
      render: (_, record) => [
        <a key={record.I_ID} onClick={() => isContractorShowModal(true, record.I_ID)}>{_}</a>
      ],
    }, {
      title: '单位地址',
      dataIndex: 'V_ADDRESS',
      width: 180,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '法定代表人',
      dataIndex: 'V_LEGAL',
      width: 100,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '委托代理人',
      dataIndex: 'V_REPRESENTITIVE',
      width: 100,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '联系电话',
      dataIndex: 'V_PHONE',
      width: 150,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '企业性质',
      dataIndex: 'V_NATURE',
      width: 150,
      hideInSearch: true,
      hideInTable: true
    }, {
      title: '注册资金(元)',
      dataIndex: 'I_REGEREDCAPITAL',
      width: 150,
      hideInSearch: true,
      hideInTable: true
    }, {
      title: '经营许可',
      dataIndex: 'V_LICENSE',
      width: 150,
      hideInSearch: true,
      hideInTable: true
    }, {
      title: '信用等级',
      dataIndex: 'V_CREDIT',
      width: 150,
      hideInSearch: true,
      hideInTable: true
    }, {
      title: '状态',
      dataIndex: 'V_STATUS',
      width: 60,
      valueEnum: statusEnum,
    }, {
      title: '操作',
      width: 180,
      hideInSearch: true,
      valueType: 'option',  //操作列的类型
      render: (_, record) => [   //render渲染 record代表当前行
        <>
          <a key={record.I_ID} onClick={() => isShowModal(true, record.I_ID)}>编辑</a>
          <Divider type="vertical"/>
          <a key={record.I_ID} onClick={() => updateStatus(record.I_ID, record.V_STATUS, '1')}>启用</a>
          <Divider type="vertical"/>
          <a key={record.I_ID} onClick={() => updateStatus(record.I_ID, record.V_STATUS, '0')}>停用</a>
          <Divider type="vertical"/>
          <Popconfirm key={record.I_ID} title="确认删除？" okText="确认" cancelText="取消" onConfirm={() => {
            handleRemove(record.I_ID)
          }}>
            <a href="#">删除</a>
          </Popconfirm>
        </>
      ]
    }
  ];

  return (
    // 布局标签
    <PageContainer title={false} ghost>
      <ProTable
        columns={columns}// 上面定义的表格列
        headerTitle="承揽方列表" // 表头
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
            新建
          </Button>
        ]}
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
          return await selectContractor({...newParams});
        }}
      />

      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isModalVisible ? (
          ''
        ) : (
          <UpdateContractor
            isModalVisible={isModalVisible}
            isShowModal={isShowModal}
            actionRef={actionRef}
            contractorId={contractorId}
          />
        )
      }

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
  );
};

export default Applications;
