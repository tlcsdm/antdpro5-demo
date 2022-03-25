import React, {useEffect, useRef, useState} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import 'moment/locale/zh-cn'
import {ProFormInstance} from '@ant-design/pro-form';
import {selectDept} from "@/services/contract/common/dept";
import {selectMajor} from "@/services/contract/business/major";
import PreChooseSponsor from "@/components/Choose/PreChooseSponsor";
import PreChooseContractor from "@/components/Choose/PreChooseContractor";
import ProCard from "@ant-design/pro-card/es/ProCard";
import '@/utils/style.less'
import {getDate, getMonthFirstDay} from "@/utils/date";
import {activityStatusMap} from "@/utils/enum";
import {loadLastTask, selectInvolvedProcessInstance, withDrawApprove} from "@/services/contract/person/done";
import ViewApprovalContract from "@/components/View/ViewApprovalContract";
import {PageContainer} from "@ant-design/pro-layout";
import EditContractRider from "@/pages/contract/business/contractRider/EditContractRider";
import {useModel} from "@@/plugin-model/useModel";
import {Divider, message, Popconfirm} from "antd";
import {Link} from "@umijs/preset-dumi/lib/theme";

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const Applications: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [isOpinionModalVisible, setIsOpinionModalVisible] = useState(false);
  const [isSponsorModalVisible, setIsSponsorModalVisible] = useState(false);
  const [isContractorModalVisible, setIsContractorModalVisible] = useState(false);
  const [isContractRiderModalVisible, setIsContractRiderModalVisible] = useState(false);
  const [contractId, setContractId] = useState(undefined);
  // const [bizId, setBizId] = useState(undefined);
  // const [processInstanceId, setProcessInstanceId] = useState(undefined);
  const [sponsor, setSponsor] = useState(undefined);
  const [contractor, setContractor] = useState(undefined);
  const [guid, setGuid] = useState(undefined);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const {initialState} = useModel('@@initialState');

  /**
   * 控制模态框显示和隐藏
   */
  const isShowModal = (show: boolean | ((prevState: boolean) => boolean), id = undefined) => {
    setContractId(id);
    setIsModalVisible(show);
  };

  // const isShowOpinionModal = (show: boolean | ((prevState: boolean) => boolean), bizId = undefined, processInstanceId = undefined) => {
  //   setBizId(bizId);
  //   setProcessInstanceId(processInstanceId);
  //   setIsOpinionModalVisible(show);
  // };

  const isShowSponsorModal = (show: boolean | ((prevState: boolean) => boolean)) => {
    setIsSponsorModalVisible(show);
  };

  const isShowContractorModal = (show: boolean | ((prevState: boolean) => boolean)) => {
    setIsContractorModalVisible(show);
  };

  const isShowContractRiderModal = (show: boolean | ((prevState: boolean) => boolean), id = undefined) => {
    setGuid(id);
    setIsContractRiderModalVisible(show);
  };

  //useEffect参数为空数组时仅初始化执行一次
  useEffect(() => {
    initOrg();
  }, []);

  // @ts-ignore
  useEffect(async () => {
    if (sponsor !== undefined) {
      formRef.current?.setFieldsValue({
        // @ts-ignore
        V_SPONSOR: sponsor.V_SPONSORNAME
      });
    }
  }, [sponsor]);

  // @ts-ignore
  useEffect(async () => {
    if (contractor !== undefined) {
      formRef.current?.setFieldsValue({
        // @ts-ignore
        V_CONTRACTOR: contractor.V_NAME
      });
    }
  }, [contractor]);

  //单位
  const [orgList, setOrgList] = useState([]);
  const initOrg = async () => {
    const deptList = await selectDept({
      V_DEPTTYPE: '厂矿',
      V_DEPTCODE: (initialState as any).currentUser.V_ORGCODE,
    });
    const orgTempList: any = [];
    deptList.data.forEach(function (item: any) {
      const tempOrgDetail: any = {value: item.V_DEPTCODE, label: item.V_DEPTNAME};
      orgTempList.push(tempOrgDetail);
    });
    setOrgList(orgTempList);
    if (deptList.data.length > 0) {
      formRef.current?.setFieldsValue({
        V_DEPTCODE: deptList.data[0].V_DEPTCODE
      });
      onChangeDept(deptList.data[0].V_DEPTCODE);
    }
  };


  //部门
  const [deptList, setDeptList] = useState([]);
  const onChangeDept = async (id: any) => {
    const deptList = await selectDept({
      V_DEPTCODE_UP: id,
    });
    const deptTempList: any = [];
    deptList.data.forEach(function (item: any) {
      const tempDeptDetail: any = {value: item.V_DEPTCODE, label: item.V_DEPTNAME};
      deptTempList.push(tempDeptDetail);
    });
    setDeptList(deptTempList);

    if (deptList.data.length > 0) {
      formRef.current?.setFieldsValue({
        V_DEPTCODENEXT: deptList.data[0].V_DEPTCODE
      });
      onChangeMajor(deptList.data[0].V_DEPTCODE);
    }
  };

  //专业
  const [majorList, setMajorList] = useState([]);
  const onChangeMajor = async (id: any) => {
    const majorList = await selectMajor({V_DEPTCODE: id});
    const majorTempList: any = [];
    majorList.data.forEach(function (item: any) {
      const tempMajor: any = {value: item.I_ID, label: item.V_NAME};
      majorTempList.push(tempMajor);
    });
    setMajorList(majorTempList);
  };

  //撤审合同
  const handleWithDrawApprove = async (processInstanceId: any) => {
    onLoadLastTask(processInstanceId);  //查询流程最后一个待办任务
  };

  //查询流程最后一个待办任务
  const onLoadLastTask = async (processInstanceId: any) => {
    const lastTask = await loadLastTask({
      processInstanceId: processInstanceId
    });
    confirm('撤审', lastTask.data.taskId);
  };


  //流程确认
  const confirm = async (approvalInfo: any, taskId: any) => {
    let assigneeList = [];
    let assigneeNameList = [];
    assigneeList.push('EMP[' + (initialState as any).currentUser.V_PERCODE + ']');
    assigneeNameList.push((initialState as any).currentUser.V_PERNAME);

    let info = approvalInfo + ', 下一步流程处理人: ' + assigneeNameList;

    const hide = message.loading('处理中... [' + info + ']');

    let response = await withDrawApprove({
      TASK_ID_: taskId,
      APPROVAL_: 'rollback',
      ASSIGNEE_: assigneeList.join(','),
      ASSIGNEE_LIST: assigneeList,
      APPROVAL_MEMO_: approvalInfo
    });
    hide();
    if (response && response.success) {
      message.success("操作成功! [ '流程撤审成功!']");
      isShowModal(false);
      formRef.current?.setFieldsValue({
        V_APPROVAL_OPINIONS: ''
      });
      if (actionRef.current) {
        actionRef.current.reload();  //提交后刷新Protable
      }
    } else {
      return false;
    }
    return true;
  };

  const columns: ProColumns[] = [  //定义 Protable的列 columns放在Protable
    {
      title: '定制方',
      dataIndex: 'V_SPONSOR',
      width: 180,
      hideInTable: true,
      fieldProps: {
        placeholder: "请选择",
        onSelect(value: any, options: any) {
          isShowSponsorModal(true)
        },
      },
    }, {
      title: '承揽方',
      dataIndex: 'V_CONTRACTOR',
      width: 180,
      hideInTable: true,
      fieldProps: {
        placeholder: "请选择",
        onSelect(value: any, options: any) {
          isShowContractorModal(true)
        },
      },
    }, {
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
    }, {
      title: '单位',
      dataIndex: 'V_DEPTCODE',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        options: orgList,
        onSelect(value: any, options: any) {
          onChangeDept(value);
        },
      },
    },
    {
      title: '部门  ',
      dataIndex: 'V_DEPTCODENEXT',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        options: deptList,
        onSelect(value: any, options: any) {
          onChangeMajor(value);
        }
      },
    },
    {
      title: '专业',
      dataIndex: 'V_MAJORID',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        options: majorList
      },
    },
    {
      title: '序号',
      width: 50,
      hideInSearch: true,
      hideInTable: false,
      render: (text, record, index) => `${index + 1}`
    }, {
      title: '操作',
      width: 120,
      hideInSearch: true,
      valueType: 'option',  //操作列的类型
      render: (_, record) => [   //render渲染 record代表当前行
        <>
          <a key={'approval'}
             onClick={() => isShowModal(true, record.processVariables.I_ID)}>查看</a>
          <Divider type="vertical" style={{display: ((record.V_INST_STATUS === 0) ? 'inline' : 'none')}}/>
          {(record.processVariables.V_INST_STATUS === 0) &&
          <Popconfirm key={'withdraw'} title="确认撤审？" okText="确认" cancelText="取消" onConfirm={() => {
            handleWithDrawApprove(record.processInstanceId)
          }}>
            <a href="#">撤审</a>
          </Popconfirm>}
        </>
      ]
    }, {
      title: '合同履行类型',
      dataIndex: 'processVariables',
      width: 120,
      hideInSearch: true,
      hideInTable: false,
      render: (text: any) => {
        return text === undefined || text === '' ? '' : text.V_CONTRACTTYPE;
      },
    }, {
      title: '定制方',
      dataIndex: 'processVariables',
      width: 250,
      hideInSearch: true,
      hideInTable: false,
      render: (text: any) => {
        return text === undefined || text === '' ? '' : text.V_SPONSORNAME;
      },
    }, {
      title: '项目编码',
      dataIndex: 'processVariables',
      width: 100,
      hideInSearch: true,
      hideInTable: false,
      render: (text: any) => {
        return text === undefined || text === '' ? '' : text.V_PROJECTCODE;
      },
    }, {
      title: '项目名称',
      dataIndex: 'processVariables',
      width: 180,
      hideInSearch: true,
      hideInTable: false,
      render: (text: any) => {
        return text === undefined || text === '' ? '' : text.V_PROJECTNAME;
      },
    }, {
      title: '项目金额（万元）',
      dataIndex: 'processVariables',
      width: 140,
      hideInSearch: true,
      hideInTable: false,
      className: 'column-right',
      render: (text: any) => {
        return text === undefined || text === '' ? '' : (text.V_MONEY) / 10000;
      },
    }, {
      title: '附件',
      dataIndex: 'processVariables',
      width: 80,
      hideInSearch: true,
      hideInTable: false,
      render: (text, record, index) => [
        <a key={record.I_ID} onClick={() => isShowContractRiderModal(true, record.processVariables.I_ID)}>查看</a>,
      ]
    }, {
      title: '承揽方',
      dataIndex: 'processVariables',
      width: 180,
      hideInSearch: true,
      hideInTable: false,
      render: (text: any) => {
        return text === undefined || text === '' ? '' : text.V_CONTRACTORNAME;
      },
    }, {
      title: '专业',
      dataIndex: 'processVariables',
      width: 100,
      hideInSearch: true,
      hideInTable: false,
      render: (text: any) => {
        return text === undefined || text === '' ? '' : text.V_MAJOR;
      },
    }, {
      title: '状态',
      dataIndex: 'processVariables',
      width: 80,
      hideInSearch: true,
      hideInTable: false,
      render: (text: any) => {
        return activityStatusMap[text.V_INST_STATUS as number];
      },
    }, {
      title: '起草时间',
      dataIndex: 'processVariables',
      width: 180,
      hideInSearch: true,
      hideInTable: false,
      render: (text: any) => {
        return text === undefined || text === '' ? '' : text.D_DATE_CREATE;
      },
    }, {
      title: '操作',
      width: 100,
      fixed: 'right',
      hideInSearch: true,
      valueType: 'option',  //操作列的类型
      render: (_, record) => [   //render渲染 record代表当前行
        <Link key={record.id}
              to={`/personalcenter/todo/memo/${record.businessKey}/${record.processInstanceId}`}>查看审批意见</Link>,
      ]
    },
  ];

  return (
    // 布局标签
    <PageContainer title={false} ghost>
      <ProCard>
        <ProTable
          columns={columns}// 上面定义的表格列
          headerTitle="已办任务列表" // 表头
          actionRef={actionRef} // 用于触发刷新操作等，看api
          formRef={formRef}
          rowKey="processInstanceId"// 表格行 key 的取值，可以是字符串或一个函数
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
          search={{
            defaultCollapsed: false,
            optionRender: (searchConfig, formProps, dom) => [
              ...dom.reverse()
            ]
          }}
          request={async (params) => {   //调用请求加载表格数据， 默认自动加载 params为Search的查询条件参数
            const newParams = {};
            Object.assign(newParams, params);
            return await selectInvolvedProcessInstance({...newParams});
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
          !isSponsorModalVisible ? (
            ''
          ) : (
            <PreChooseSponsor
              isSponsorModalVisible={isSponsorModalVisible}
              isShowSponsorModal={isShowSponsorModal}
              setSponsor={setSponsor}
            />
          )
        }
        {
          // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
          !isContractorModalVisible ? (
            ''
          ) : (
            <PreChooseContractor
              isContractorModalVisible={isContractorModalVisible}
              isShowContractorModal={isShowContractorModal}
              setContractor={setContractor}
            />
          )
        }

        {/*{*/}
        {/*  // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期*/}
        {/*  !isOpinionModalVisible ? (*/}
        {/*    ''*/}
        {/*  ) : (*/}
        {/*    <ViewApprovalMemo*/}
        {/*      isOpinionModalVisible={isOpinionModalVisible}*/}
        {/*      isShowOpinionModal={isShowOpinionModal}*/}
        {/*      bizId={bizId}*/}
        {/*      processInstanceId={processInstanceId}*/}
        {/*    />*/}
        {/*  )*/}
        {/*}*/}

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
      </ProCard>
    </PageContainer>
  );
};

export default Applications;
