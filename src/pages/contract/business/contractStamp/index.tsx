import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import 'moment/locale/zh-cn'
import {ProFormInstance} from '@ant-design/pro-form';
import {stampStatus} from "@/utils/enum";
import '@/utils/style.less'
import {getDate, getMonthFirstDay} from "@/utils/date";
import EditContractRider from "@/pages/contract/business/contractRider/EditContractRider";
import ViewApprovalContract from "@/components/View/ViewApprovalContract";
import {
  deleteAppointToStamp,
  selectAppointToStamp, updateStampStatusBatch,
} from "@/services/contract/business/contractStamp";
import {EditOutlined, PlusOutlined} from "@ant-design/icons/lib";
import {Button, message, Popconfirm} from "antd";
import UpdateContractStamp from "@/pages/contract/business/contractStamp/components/UpdateContractStamp";
import ConfirmStampDate from "@/pages/contract/business/contractStamp/components/ConfirmStampDate";
import {useModel} from "@@/plugin-model/useModel";

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const Applications: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalStampVisible, setIsModalStampVisible] = useState(false);
  const [isModaConfirmStampDateVisible, setIsModalConfirmStampDateVisible] = useState(false);
  const [isContractRiderModalVisible, setIsContractRiderModalVisible] = useState(false);
  const [contractId, setContractId] = useState(undefined);
  const [stampIdList, setStampIdList] = useState(undefined);
  const [appointDate, setAppointDate] = useState(undefined);
  const [guid, setGuid] = useState(undefined);
  const [flag, setFlag] = useState(Boolean);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const {initialState} = useModel('@@initialState');

  /**
   * 控制模态框显示和隐藏
   */
  const isShowStampModal = (show: boolean | ((prevState: boolean) => boolean)) => {
    setIsModalStampVisible(show);
  };

  const isShowConfirmStampDateModal = (show: boolean | ((prevState: boolean) => boolean), idList = undefined, appointDate = undefined) => {
    setStampIdList(idList);
    setAppointDate(appointDate);
    setIsModalConfirmStampDateVisible(show);
  };

  const isShowModal = (show: boolean | ((prevState: boolean) => boolean), id = undefined) => {
    setContractId(id);
    setIsModalVisible(show);
  };

  const isShowContractRiderModal = (show: boolean | ((prevState: boolean) => boolean), id = undefined) => {
    setGuid(id);
    setIsContractRiderModalVisible(show);
  };

  //useEffect参数为空数组时仅初始化执行一次
  useEffect(() => {
    const roleList = (initialState as any).currentUser.V_ROLES;
    roleList.forEach(function (item: any) {
      if (item.V_ORLECODE === 'contractAdministrator') {
        setFlag(true);
      }
    });
  }, []);

  //删除
  const handleRemove = async (id: any) => {
    if (!id) return true;
    const hide = message.loading('正在删除');
    const req = await deleteAppointToStamp({
      I_ID: id
    });
    hide();
    if (req && req.success) {
      message.success('删除成功，即将刷新');
      actionRef.current?.reloadAndRest?.(); //刷新Protable
    }
    return true;
  };

  const confirmDate = async (idList: any, date: any) => {
    isShowConfirmStampDateModal(true, idList, date);
  };

  const columns: ProColumns[] = [  //定义 Protable的列 columns放在Protable
    {
      title: '起始时间',
      dataIndex: 'D_DATE_CREATE',
      valueType: 'dateRange',
      order: 3,
      initialValue: [getMonthFirstDay(), getDate()],
      search: {
        transform: (value) => {
          return {
            V_BEGIN_DATE: value[0],
            V_END_DATE: value[1],
          };
        },
      },
      hideInTable: true,
    },
    {
      title: '序号',
      width: 50,
      hideInSearch: true,
      hideInTable: false,
      render: (text, record, index) => `${index + 1}`
    }, {
      title: '操作',
      width: 60,
      hideInSearch: true,
      valueType: 'option',  //操作列的类型
      render: (_, record) => [   //render渲染 record代表当前行
        <a key={record.I_ID} onClick={() => isShowModal(true, record.V_CONTRACTID)}>查看</a>
      ]
    }, {
      title: '定制方',
      dataIndex: 'V_SPONSORABBR',
      width: 180,
      hideInSearch: true,
      hideInTable: false,
    }, {
      title: '项目编码',
      dataIndex: 'V_PROJECTCODE',
      width: 100,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '项目名称',
      dataIndex: 'V_PROJECTNAME',
      width: 180,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '项目金额(万元)',
      dataIndex: 'V_MONEY',
      width: 120,
      hideInSearch: true,
      hideInTable: false,
      render: (val: any) => val / 10000,
      className: 'column-right',
    }, {
      title: '承揽方',
      dataIndex: 'V_CONTRACTORNAME',
      width: 200,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '预约人',
      dataIndex: 'V_APPLICANT',
      width: 80,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '预约时间',
      dataIndex: 'V_APPOINTDATE',
      width: 150,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '盖章状态',
      dataIndex: 'V_STAMPSTATUS',
      width: 120,
      valueEnum: stampStatus,
    }, {
      title: '起草时间',
      dataIndex: 'D_DATE_CREATE',
      width: 180,
      valueType: 'dateTime',
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '附件',
      width: 60,
      fixed: 'right',
      hideInSearch: true,
      hideInTable: false,
      render: (text, record, index) => [
        <a key={record.I_ID} onClick={() => isShowContractRiderModal(true, record.V_CONTRACTID)}>查看</a>,
      ]
    }, {
      title: '操作',
      width: 120,
      fixed: 'right',
      hideInSearch: true,
      valueType: 'option',  //操作列的类型
      render: (_, record) => [   //render渲染 record代表当前行
        <Popconfirm key={record.I_ID} title="确认删除？" okText="确认" cancelText="取消" onConfirm={() => {
          handleRemove(record.I_ID)
        }}>
          <a href="#">删除</a>
        </Popconfirm>
      ]
    },
  ];

  return (
    // 布局标签
    <PageContainer title={false} ghost>
      <ProTable
        columns={columns}// 上面定义的表格列
        headerTitle="预约签章列表" // 表头
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
        rowSelection={{}}
        toolBarRender={(action, {selectedRows}) => [ //工具栏 与 表头headerTitle同一行 可设置为false，设置false表头无效
          (!flag)&&<Button
            icon={<PlusOutlined/>}  //图标，其他图标可去ant官网搜索icon，单击即可复制
            type="primary"   //设置为主要键（蓝色）, 不加为白色,只能有一个type="primary"
            onClick={() => {  //点击事件
              isShowStampModal(true);
            }}>
            新建
          </Button>,
          (flag)&&<Button
            icon={<EditOutlined/>}  //图标，其他图标可去ant官网搜索icon，单击即可复制
            type="primary"   //设置为主要键（蓝色）, 不加为白色,只能有一个type="primary"
            onClick={async () => {  //点击事件
              let flag = true;
              // @ts-ignore
              if (selectedRows.length === 0) {
                message.warning('请选择数据进行操作！');
                return true;
              }
              // @ts-ignore
              for (let i = 0; i < selectedRows.length; i++) {
                // @ts-ignore
                for (let j = 0; j < selectedRows.length; j++) {
                  // @ts-ignore
                  if (selectedRows[i].V_APPOINTDATE !== selectedRows[j].V_APPOINTDATE) {
                    message.info('请选择相同预约时间进行操作！');
                    flag = false;
                    break;
                    return true;
                  }
                }
                break;
              }
              if (flag) {
                // @ts-ignore
                return confirmDate(selectedRows?.map((row: any) => row.I_ID).toString(), selectedRows[0].V_APPOINTDATE);
              }
            }}>
            批量确认预约日期
          </Button>,
          (flag)&&<Button
            icon={<EditOutlined/>}  //图标，其他图标可去ant官网搜索icon，单击即可复制
            type="primary"   //设置为主要键（蓝色）, 不加为白色,只能有一个type="primary"
            onClick={async () => {  //点击事件
              if (selectedRows?.length === 0) {
                message.warning('请选择数据进行操作！')
              } else {
                const success = await updateStampStatusBatch({
                  I_IDLIST: selectedRows?.map((row: any) => row.I_ID).toString(),
                  V_CONTRACTIDLIST: selectedRows?.map((row: any) => row.V_CONTRACTID).toString(),
                  V_STAMPSTATUS: 3
                });
                // @ts-ignore
                if (success) {
                  if (actionRef.current) {
                    actionRef.current.reload();  //提交后刷新Protable
                  }
                }
              }
            }}>
            批量盖章
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
          return await selectAppointToStamp({...newParams});
        }}
      />
      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isModalVisible ? (
          ''
        ) : (
          <ViewApprovalContract
            isModalVisible={isModalVisible}
            isShowModal={isShowModal}
            contractId={contractId}
          />
        )
      }
      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isContractRiderModalVisible ? (
          ''
        ) : (
          <EditContractRider
            isContractRiderModalVisible={isContractRiderModalVisible}
            isShowContractRiderModal={isShowContractRiderModal}
            riderGuid={guid}
            type={'查看'}
          />
        )
      }

      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isModalStampVisible ? (
          ''
        ) : (
          <UpdateContractStamp
            isModalStampVisible={isModalStampVisible}
            isShowStampModal={isShowStampModal}
            actionRef={actionRef}
          />
        )
      }

      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isModaConfirmStampDateVisible ? (
          ''
        ) : (
          <ConfirmStampDate
            isModaConfirmStampDateVisible={isModaConfirmStampDateVisible}
            isShowConfirmStampDateModal={isShowConfirmStampDateModal}
            actionRef={actionRef}
            stampIdList={stampIdList}
            appointDate={appointDate}
          />
        )
      }
    </PageContainer>
  );
};

export default Applications;
