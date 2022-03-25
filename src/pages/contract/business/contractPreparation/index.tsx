import {Button, Divider, Dropdown, Menu, message, Popconfirm} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import 'moment/locale/zh-cn'
import {ProFormInstance} from '@ant-design/pro-form';
import {activityStatus} from "@/utils/enum";
import {DownOutlined} from "@ant-design/icons/lib";
import UpdateContractPreparation
  from "@/pages/contract/business/contractPreparation/components/UpdateContractPreparation";
import {
  deleteContract,
  selectContract,
  selectFirstTaskProcCandidate, startContractProcess
} from "@/services/contract/common/contractPreparation";
import {selectDept} from "@/services/contract/common/dept";
import {selectMajor} from "@/services/contract/business/major";
import PreChooseSponsor from "@/components/Choose/PreChooseSponsor";
import PreChooseContractor from "@/components/Choose/PreChooseContractor";
import '@/utils/style.less'
import {getDate, getMonthFirstDay} from "@/utils/date";
import EditContractRider from "@/pages/contract/business/contractRider/EditContractRider";
import {useModel} from "@@/plugin-model/useModel";
import {selectMajorToFlow} from "@/services/contract/business/majorToFlow";
import PreChooseCandidate from "@/components/Choose/PreChooseCandidate";

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const Applications: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSponsorModalVisible, setIsSponsorModalVisible] = useState(false);
  const [isContractorModalVisible, setIsContractorModalVisible] = useState(false);
  const [isContractRiderModalVisible, setIsContractRiderModalVisible] = useState(false);
  const [isCandidateModalVisible, setIsCandidateModalVisible] = useState(false);
  const [contractId, setContractId] = useState(undefined);
  const [sponsor, setSponsor] = useState(undefined);
  const [contractor, setContractor] = useState(undefined);
  const [guid, setGuid] = useState(undefined);
  const [contractType, setcontractType] = useState(undefined);
  const [processDefinitionKey, setProcessDefinitionKey] = useState(undefined);
  const [candidateDataSource, setCandidateDataSource] = useState([]);
  const [candidate, setCandidate] = useState(undefined);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const {initialState} = useModel('@@initialState');

  /**
   * 控制模态框显示和隐藏
   */
  const isShowModal = (show: boolean | ((prevState: boolean) => boolean), type = undefined, id = undefined) => {
    setContractId(id);
    setcontractType(type);
    setIsModalVisible(show);
  };

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

  const isShowCandidateModal = (show: boolean | ((prevState: boolean) => boolean)) => {
    setIsCandidateModalVisible(show);
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

  // @ts-ignore
  useEffect(async () => {
    if (candidate !== undefined) {
      startApproval();
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

  //删除合同
  const handleRemove = async (id: any, instStatus: any) => {
    if (instStatus !== 3) {
      message.warning('本数据已发起审批！');
      return true;
    }
    if (!id) return true;
    const hide = message.loading('正在删除');
    const req = await deleteContract({
      I_ID: id
    });
    hide();
    if (req && req.success) {
      message.success('删除成功，即将刷新');
      actionRef.current?.reloadAndRest?.(); //刷新Protable
    }
    return true;
  };

  //上报
  const submitContractProcess = async (majorId: any, type: any, id: any) => {
    setContractId(id);
    onSelectMajorFlow(majorId, type);//流程定义key
  };

  //查询流程定义key
  const onSelectMajorFlow = async (majorId: any, contractType: any) => {
    const majorList = await selectMajorToFlow({V_MAJORID: majorId, V_CONTYPE: contractType});
    onSelectCandidate(majorList.data[0].KEY_);//查询第一步候选人
    setProcessDefinitionKey(majorList.data[0].KEY_);
  };

  //查询第一步候选人
  const onSelectCandidate = async (key: any) => {
    const procCandidateList = await selectFirstTaskProcCandidate({
      processDefinitionKey: key,
      taskDefinitionKey: 'companyLeader',
      orgCode: (initialState as any).currentUser.V_DEPTCODE
    });
    setCandidateDataSource(procCandidateList.data);
    isShowCandidateModal(true);
  };

  //流程上报
  const startApproval = async () => {
    const hide = message.loading('处理中...');
    let response = await startContractProcess({
      I_ID: contractId,
      ASSIGNEE_: 'EMP[' + (candidate as any).value + ']',
      PROCESS_DEFINITION_KEY_: processDefinitionKey
    });
    hide();
    if (response && response.success) {
      message.success("操作成功! [上报成功! 下一步流程处理人:" + (candidate as any).label + ']');
      actionRef.current?.reloadAndRest?.(); //刷新Protable
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
      title: '专业',
      dataIndex: 'V_MAJOR',
      width: 100,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '状态',
      dataIndex: 'V_INST_STATUS',
      width: 80,
      valueEnum: activityStatus,
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
        <a key={record.I_ID} onClick={() => isShowContractRiderModal(true, record.I_ID)}>查看</a>,
      ]
    }, {
      title: '操作',
      fixed: 'right',
      width: 180,
      hideInSearch: true,
      valueType: 'option',  //操作列的类型
      render: (_, record) => [   //render渲染 record代表当前行
        <>
          <a key={record.I_ID} style={{display: ((record.V_INST_STATUS === 3) ? 'inline' : 'none')}}
             onClick={() => isShowModal(true, record.V_CONTRACTTYPE, record.I_ID)}>编辑</a>
          <Divider type="vertical" style={{display: ((record.V_INST_STATUS === 3) ? 'inline' : 'none')}}/>
          <a key={record.I_ID} style={{display: ((record.V_INST_STATUS === 3) ? 'inline' : 'none')}}
             onClick={() => submitContractProcess(record.V_MAJORID, record.V_ACCORDANCE, record.I_ID)}>上报</a>
          <Divider type="vertical" style={{display: ((record.V_INST_STATUS === 3) ? 'inline' : 'none')}}/>
          {(record.V_INST_STATUS === 3) &&
          <Popconfirm key={record.I_ID} title="确认删除？" okText="确认" cancelText="取消" onConfirm={() => {
            handleRemove(record.I_ID, record.V_INST_STATUS)
          }}>
            <a href="#">删除</a>
          </Popconfirm>}
        </>
      ]
    }
  ];

  return (
    // 布局标签
    <PageContainer title={false} ghost>
      <ProTable
        columns={columns}// 上面定义的表格列
        headerTitle="合同编制列表" // 表头
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
          <Dropdown
            overlay={
              <Menu
                selectedKeys={[]}
              >
                <Menu.Item
                  key="add"
                  onClick={async () => {
                    // @ts-ignore
                    isShowModal(true, '新建合同');
                  }}
                >
                  新建合同
                </Menu.Item>
                <Menu.Item
                  key="change"
                  onClick={async () => {
                    // @ts-ignore
                    isShowModal(true, '合同变更');
                  }}
                >
                  合同变更
                </Menu.Item>
                <Menu.Item
                  key="relate"
                  onClick={async () => {
                    // @ts-ignore
                    isShowModal(true, '合同关联');
                  }}
                >
                  合同关联
                </Menu.Item>
                <Menu.Item
                  key="delay"
                  onClick={async () => {
                    // @ts-ignore
                    isShowModal(true, '合同延续');
                  }}
                >
                  合同延续
                </Menu.Item>
                <Menu.Item
                  key="childContract"
                  onClick={async () => {
                    // @ts-ignore
                    isShowModal(true, '子母合同');
                  }}
                >
                  子母合同
                </Menu.Item>
              </Menu>
            }
          >
            <Button>
              起草类型 <DownOutlined/>
            </Button>
          </Dropdown>

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
          return await selectContract({...newParams});
        }}
      />
      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isModalVisible ? (
          ''
        ) : (
          <UpdateContractPreparation
            isModalVisible={isModalVisible}
            isShowModal={isShowModal}
            actionRef={actionRef}
            contractId={contractId}
            contractType={contractType}
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

      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isContractRiderModalVisible ? (
          ''
        ) : (
          <EditContractRider
            isContractRiderModalVisible={isContractRiderModalVisible}
            isShowContractRiderModal={isShowContractRiderModal}
            riderGuid={guid}
            type={'管理'}
          />
        )
      }

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
    </PageContainer>
  );
};

export default Applications;
