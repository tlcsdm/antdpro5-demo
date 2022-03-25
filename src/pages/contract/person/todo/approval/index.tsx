import {Button, Card, message} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import 'moment/locale/zh-cn'
import ProForm, {ProFormInstance, ProFormText} from '@ant-design/pro-form';
import {MinusOutlined, PlusOutlined} from "@ant-design/icons/lib";
import {selectDept} from "@/services/contract/common/dept";
import {selectMajor} from "@/services/contract/business/major";
import PreChooseSponsor from "@/components/Choose/PreChooseSponsor";
import PreChooseContractor from "@/components/Choose/PreChooseContractor";
import ProCard from "@ant-design/pro-card/es/ProCard";
import UpdateApprovalContract from "@/pages/contract/person/todo/approval/components/UpdateApprovalContract";
import {
  completeApproveBatch,
  loadNextUserTaskDefinition,
  selectAllInContractTask,
  selectApprovalOpinions
} from '@/services/contract/person/approval';
import '@/utils/style.less'
import {getDate, getMonthFirstDay} from "@/utils/date";
import PreChooseCandidate from "@/components/Choose/PreChooseCandidate";
import {activityStatusMap} from "@/utils/enum";
import EditContractRider from "@/pages/contract/business/contractRider/EditContractRider";
import {useModel} from "@@/plugin-model/useModel";
import ProFormSelect from "@ant-design/pro-form/lib/components/Select";
import {Link} from "@umijs/preset-dumi/lib/theme";

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const Applications: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [isOpinionModalVisible, setIsOpinionModalVisible] = useState(false);
  const [isSponsorModalVisible, setIsSponsorModalVisible] = useState(false);
  const [isContractorModalVisible, setIsContractorModalVisible] = useState(false);
  const [isCandidateModalVisible, setIsCandidateModalVisible] = useState(false);
  const [isContractRiderModalVisible, setIsContractRiderModalVisible] = useState(false);
  const [contractId, setContractId] = useState(undefined);
  const [taskId, setTaskId] = useState(undefined);
  // const [bizId, setBizId] = useState(undefined);
  // const [processInstanceId, setProcessInstanceId] = useState(undefined);
  const [processDefinitionKey, setProcessDefinitionKey] = useState(undefined);
  const [sponsor, setSponsor] = useState(undefined);
  const [contractor, setContractor] = useState(undefined);
  const [candidate, setCandidate] = useState(undefined);
  const [guid, setGuid] = useState(undefined);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [candidateDataSource, setCandidateDataSource] = useState([]);
  const [nextUserTaskDefinition, setNextUserTaskDefinition] = useState([]);
  const [selectedRowsState, setSelectedRows] = useState([]);
  const {initialState} = useModel('@@initialState');
  const [formObj] = ProForm.useForm();

  /**
   * 控制模态框显示和隐藏
   */
  const isShowModal = (show: boolean | ((prevState: boolean) => boolean), id = undefined, taskId = undefined, definitionKey = undefined) => {
    setContractId(id);
    setTaskId(taskId);
    setProcessDefinitionKey(definitionKey);
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

  const isShowCandidateModal = (show: boolean | ((prevState: boolean) => boolean)) => {
    setIsCandidateModalVisible(show);
  };

  const isShowContractRiderModal = (show: boolean | ((prevState: boolean) => boolean), id = undefined) => {
    setGuid(id);
    setIsContractRiderModalVisible(show);
  };

  //useEffect参数为空数组时仅初始化执行一次
  useEffect(() => {
    onSelectApprovalOpinion(); //常用意见
    initOrg();
    formRef.current?.setFieldsValue({
      V_PROCESS_STATUS: 0
    });
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

  // @ts-ignore
  useEffect(async () => {
    if (candidate !== undefined) {
      confirm('同意'); //确认
    }
  }, [candidate]);

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

  //常用意见
  const [approvalOpinionList, setApprovalOpinionList] = useState([]);
  const onSelectApprovalOpinion = async () => {
    const approvalOpinionList = await selectApprovalOpinions({});
    const approvalOpinionTempList: any = [];
    approvalOpinionList.data.forEach(function (item: any) {
      const tempMajor: any = {value: item.I_ID, label: item.V_OPINIONS};
      approvalOpinionTempList.push(tempMajor);
    });
    setApprovalOpinionList(approvalOpinionTempList);
  };

  const onChangeOpinion = (label: any) => {
    formObj.setFieldsValue({
      V_APPROVAL_OPINIONS: label
    });
  };

  //同意
  const approve = async () => {
    onSelectNextUserTaskDefinition(); //获得下一个用户任务节点
  };

  //获得下一个用户任务节点
  const onSelectNextUserTaskDefinition = async () => {
    const procCandidateList = await loadNextUserTaskDefinition({
      taskId: (selectedRowsState[0] as any).taskId,
      approval: 'approve',
    });
    setCandidateDataSource(procCandidateList.data.candidateList);
    setNextUserTaskDefinition(procCandidateList.data);
    if (procCandidateList.data.taskName == '结束') {
      end();  //办结
    } else {
      isShowCandidateModal(true);
    }
  };

  //办结
  const end = async () => {
    confirm('办结'); //确认
  };

  //驳回
  const reject = async () => {
    if (processDefinitionKey === "companyManager") {           //TODO
      message.warning('现在是发起状态，不能驳回!')
    } else {
      confirm('驳回'); //确认
    }
  };

  //流程确认
  const confirm = async (approvalInfo: any) => {
    let assigneeList = [];
    let assigneeNameList = [];
    if ((nextUserTaskDefinition as any).taskName !== undefined) {
      if (nextUserTaskDefinition != null && (nextUserTaskDefinition as any).taskName != '结束') {
        assigneeList.push('EMP[' + (candidate as any).value + ']');
        assigneeNameList.push((candidate as any).label);
      }
    }

    let info = approvalInfo + ', 下一步流程处理人: ' + assigneeNameList;

    if (approvalInfo == '办结') {
      info = '办结';
    }

    if (approvalInfo == '驳回') {
      info = approvalInfo + ', 下一步流程处理人: 流程发起人';
    }

    const hide = message.loading('处理中... [' + info + ']');

    let response = await completeApproveBatch({
      TASK_ID_LIST: selectedRowsState.map((row: any) => row.taskId).toString(),
      APPROVAL_: approvalInfo === '驳回' ? 'reject' : 'approve',
      ASSIGNEE_: assigneeList.join(','),
      ASSIGNEE_LIST: assigneeList,
      APPROVAL_MEMO_: formObj.getFieldsValue(['V_APPROVAL_OPINIONS']).V_APPROVAL_OPINIONS
    });
    hide();
    if (response && response.success) {
      message.success("操作成功! [" + (approvalInfo == '驳回' ? ('成功! 驳回至起草人') : (nextUserTaskDefinition as any).taskName == '结束' ? '流程办结成功!' : '流程审批成功!') + ']');
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
      width: 50,
      hideInSearch: true,
      valueType: 'option',  //操作列的类型
      render: (_, record) => [   //render渲染 record代表当前行
        <a key={'approval'}
           onClick={() => isShowModal(true, record.processVariables.I_ID, record.taskId, record.taskDefinitionKey)}>审批</a>,
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
    },
    {
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
    <ProCard>
      <ProTable
        columns={columns}// 上面定义的表格列
        headerTitle="待办任务列表" // 表头
        actionRef={actionRef} // 用于触发刷新操作等，看api
        formRef={formRef}
        rowKey="taskId"// 表格行 key 的取值，可以是字符串或一个函数
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
        tableExtraRender={(_, data) => (
          <Card>
            <ProForm
              form={formObj}
              submitter={false}
            >
              <ProForm.Group>
                <span>常用意见:</span>
                <ProFormSelect
                  options={approvalOpinionList}
                  width="md"
                  name="V_OPINIONS"
                  fieldProps={{
                    onChange(value, options) {
                      // @ts-ignore
                      onChangeOpinion(options.label);
                    }
                  }}
                />
                <span>处理意见:</span>
                <ProFormText
                  width="md"
                  name="V_APPROVAL_OPINIONS"
                />
              </ProForm.Group>
            </ProForm>
          </Card>
        )}
        toolBarRender={(action, {selectedRows}) => [ //工具栏 与 表头headerTitle同一行 可设置为false，设置false表头无效
          <Button
            icon={<PlusOutlined/>}  //图标，其他图标可去ant官网搜索icon，单击即可复制
            type="primary"   //设置为主要键（蓝色）, 不加为白色,只能有一个type="primary"
            onClick={async () => {  //点击事件
              if (selectedRowsState.length === 0) {
                message.warning('请选择待办数据进行操作！')
              } else {
                if (formObj.getFieldsValue(['V_APPROVAL_OPINIONS']).V_APPROVAL_OPINIONS === undefined) {
                  formObj.setFieldsValue({
                    V_APPROVAL_OPINIONS: '同意'
                  });
                }
                const success = await approve();
                // @ts-ignore
                if (success) {
                  if (actionRef.current) {
                    actionRef.current.reload();  //提交后刷新Protable
                  }
                }
              }
            }}>
            批量审批通过
          </Button>,
          <Button
            icon={<MinusOutlined/>}  //图标，其他图标可去ant官网搜索icon，单击即可复制
            type="primary"   //设置为主要键（蓝色）, 不加为白色,只能有一个type="primary"
            onClick={async () => {  //点击事件
              if (selectedRowsState.length === 0) {
                message.warning('请选择待办数据进行操作！')
              } else if (formRef.current?.getFieldsValue(['V_APPROVAL_OPINIONS']).V_APPROVAL_OPINIONS === undefined) {
                message.warning('审批意见为空！')
              } else {
                const success = await reject();
                // @ts-ignore
                if (success) {
                  if (actionRef.current) {
                    actionRef.current.reload();  //提交后刷新Protable
                  }
                }
              }
            }}>
            批量驳回起草
          </Button>
        ]}
        search={{
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse()
          ]
        }}
        rowSelection={{
          onChange: (rowKeys: any, selectedRows: any) => {
            if (selectedRows.length > 0) {
              for (let i = 0; i < selectedRows.length; i++) {
                for (let j = 0; j < selectedRows.length; j++) {
                  if (selectedRows[i].processVariables.processDefinitionKey !== selectedRows[j].processVariables.processDefinitionKey) {
                    message.info('审批人不相同，请选择相同审批人的数据进行操作！');
                    break;
                  }
                }
                break;
              }
              setSelectedRows(selectedRows);
            }
          }
        }}
        request={async (params) => {   //调用请求加载表格数据， 默认自动加载 params为Search的查询条件参数
          const newParams = {};
          Object.assign(newParams, params);
          return await selectAllInContractTask({...newParams});
        }}
      />
      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isModalVisible ? (
          ''
        ) : (
          <UpdateApprovalContract
            isModalVisible={isModalVisible}
            isShowModal={isShowModal}
            actionRef={actionRef}
            contractId={contractId}
            tId={taskId}
            definitionKey={processDefinitionKey}
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
        !isCandidateModalVisible ? (
          ''
        ) : (
          <PreChooseCandidate
            isCandidateModalVisible={isCandidateModalVisible}
            isShowCandidateModal={isShowCandidateModal}
            candidateDataSource={candidateDataSource}
            setCandidate={setCandidate}
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
    </ProCard>
  );
};

export default Applications;
