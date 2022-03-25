import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import 'moment/locale/zh-cn'
import {ProFormInstance} from '@ant-design/pro-form';
import {activityStatus} from "@/utils/enum";
import {selectDept} from "@/services/contract/common/dept";
import {selectMajor} from "@/services/contract/business/major";
import PreChooseSponsor from "@/components/Choose/PreChooseSponsor";
import PreChooseContractor from "@/components/Choose/PreChooseContractor";
import '@/utils/style.less'
import {getDate, getMonthFirstDay} from "@/utils/date";
import EditContractRider from "@/pages/contract/business/contractRider/EditContractRider";
import {useModel} from "@@/plugin-model/useModel";
import {selectContractPermission} from "@/services/contract/business/viewContractInfo";
import ViewApprovalContract from "@/components/View/ViewApprovalContract";
import {Divider} from "antd";
import {history} from "umi";
import Cookies from "js-cookie";

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const Applications: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSponsorModalVisible, setIsSponsorModalVisible] = useState(false);
  const [isContractorModalVisible, setIsContractorModalVisible] = useState(false);
  const [isContractRiderModalVisible, setIsContractRiderModalVisible] = useState(false);
  const [contractId, setContractId] = useState(undefined);
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

  //打印合同
  const printContract = async (id: any) => {
    history.push({
      pathname: '/pdfPreview',
      query: {
        path: '/api/contract-system/loadContractFilePdf?V_GUID=' + id + '&V_PERCODE=' + Cookies.get('V_PERCODE'),
        print: 'true'
      }
    })
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
          <a key={record.I_ID} onClick={() => isShowModal(true, record.I_ID)}>查看</a>
          <Divider type="vertical" style={{display: ((record.V_INST_STATUS === 1) ? 'inline' : 'none')}}/>
          {(record.V_INST_STATUS === 1) && <a key={'printContract'} onClick={() => printContract(record.I_ID)}>打印</a>}
        </>
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
          newParams['V_DEPTCODE'] = (initialState as any).currentUser.V_DEPTCODE;
          newParams['V_ORGCODE'] = (initialState as any).currentUser.V_ORGCODE;
          return await selectContractPermission({...newParams});
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
    </PageContainer>
  );
};

export default Applications;
