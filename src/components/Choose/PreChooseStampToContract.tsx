import {Button, message, Space} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import 'moment/locale/zh-cn'
import {ProFormInstance} from '@ant-design/pro-form';
import Modal from "antd/es/modal/Modal";
import {CheckOutlined} from "@ant-design/icons/lib";
import {activityStatus} from "@/utils/enum";
import '@/utils/style.less'
import {selectContract} from "@/services/contract/common/contractPreparation";
import PreChooseContractor from "@/components/Choose/PreChooseContractor";

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const PreChooseStampToContract = (props: any) => {
  const {isContractModalVisible, isShowContractModal, setContractList} = props;
  const [isContractorModalVisible, setIsContractorModalVisible] = useState(false);
  const [contractor, setContractor] = useState(undefined);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const isShowContractorModal = (show: boolean | ((prevState: boolean) => boolean)) => {
    setIsContractorModalVisible(show);
  };

  const handleCancel = () => {
    isShowContractModal(false);
  };

  //useEffect参数为空数组时仅初始化执行一次
  useEffect(() => {

  }, []);

  // @ts-ignore
  useEffect(async () => {
    if (contractor !== undefined) {
      formRef.current?.setFieldsValue({
        // @ts-ignore
        V_CONTRACTOR: contractor.V_NAME
      });
    }
  }, [contractor]);

  const columns: ProColumns[] = [  //定义 Protable的列 columns放在Protable
    {
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
    },
    {
      title: '序号',
      width: 60,
      hideInSearch: true,
      hideInTable: false,
      render: (text, record, index) => `${index + 1}`
    }, {
      title: '定作方',
      dataIndex: 'V_SPONSORNAME',
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
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '起草时间',
      dataIndex: 'D_DATE_CREATE',
      width: 180,
      valueType: 'dateTime',
      hideInSearch: true,
      hideInTable: false
    }
  ];

  return (
    // 布局标签
    <Modal
      title={'选择关联合同'}
      width="1000px"
      visible={isContractModalVisible}
      footer={[<Button key="close" type="primary" onClick={handleCancel}>关闭</Button>,]}
      onCancel={handleCancel}
    >
      <ProTable
        columns={columns}// 上面定义的表格列
        headerTitle="合同列表" // 表头
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
                setContractList(selectedRows.map((row: any) => row.I_ID).toString());
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
          if (params.V_CONTRACTOR === undefined) {
            message.info('承揽方为空！');
            return true;
          }
          const newParams = {};
          //可对params传参进行进一步处理后再调用查询
          Object.assign(newParams, params);
          newParams['V_BEGIN_DATE'] = new Date().getFullYear() + '-01-01';
          newParams['V_END_DATE'] = new Date().getFullYear() + '-12-31';
          newParams['V_INST_STATUS'] = '1';   //审批通过的合同
          newParams['V_STAMPSTATUS'] = '0';   //审批通过的合同
          return await selectContract({...newParams});

        }}
      />

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
    </Modal>
  );
};

export default PreChooseStampToContract;
