import React, {useEffect, useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import 'moment/locale/zh-cn';
import {ProFormInstance} from '@ant-design/pro-form';
import {exportLoginLog, selectLoginLog} from '@/services/contract/common/loginLog';
import {successEnum} from '@/utils/enum';
import {Button} from 'antd';
import {getDate, getMonthFirstDay} from '@/utils/date';

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const Applications: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  //useEffect参数为空数组时仅初始化执行一次
  useEffect(() => {
  }, []);

  const columns: ProColumns[] = [
    //定义 Protable的列 columns放在Protable
    {
      title: '序号',
      width: 50,
      hideInSearch: true,
      hideInTable: false,
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '登录名称',
      dataIndex: 'V_OPERATEPER',
      width: 150,
      copyable: true,
      hideInSearch: false,
      hideInTable: false,
    },
    {
      title: '客户端IP',
      dataIndex: 'V_IP',
      width: 150,
      copyable: true,
      hideInSearch: false,
      hideInTable: false,
    },
    {
      title: '浏览器',
      dataIndex: 'V_BROWSER',
      width: 150,
      hideInSearch: true,
      hideInTable: false,
    },
    {
      title: '浏览器版本',
      dataIndex: 'V_VERSION',
      width: 150,
      hideInSearch: true,
      hideInTable: false,
    },
    {
      title: '操作系统',
      dataIndex: 'V_OS',
      width: 150,
      hideInSearch: true,
      hideInTable: false,
    },
    {
      title: '操作时间',
      dataIndex: 'V_CREATETIME',
      valueType: 'dateTime',
      width: 150,
      hideInSearch: true,
      hideInTable: false,
    },
    {
      title: '主机名',
      dataIndex: 'V_HOSTNAME',
      width: 150,
      hideInSearch: true,
      hideInTable: false,
    },
    {
      title: '操作时间',
      dataIndex: 'V_CREATETIME',
      valueType: 'dateRange',
      order: 3,
      initialValue: [getMonthFirstDay(), getDate()],
      search: {
        transform: (value) => {
          return {
            START_DATE: value[0],
            END_DATE: value[1],
          };
        },
      },
      hideInTable: true,
    },
    {
      title: '登录状态',
      dataIndex: 'V_SUCCESS',
      width: 100,
      hideInSearch: false,
      hideInTable: false,
      valueEnum: successEnum,
    },
    {
      title: '错误信息',
      dataIndex: 'V_ERRMESSAGE',
      width: 200,
      hideInSearch: true,
      hideInTable: false,
    },
  ];

  return (
    // 布局标签
    <PageContainer title={false} ghost>
      <ProTable
        columns={columns} // 上面定义的表格列
        headerTitle="登录日志列表" // 表头
        actionRef={actionRef} // 用于触发刷新操作等，看api
        formRef={formRef}
        dateFormatter="string"
        manualRequest={true} // 是否需要手动触发首次请求
        rowKey="I_ID" // 表格行 key 的取值，可以是字符串或一个函数
        options={{
          density: true, // 密度
          fullScreen: true, // 全屏
          reload: true, // 刷新
          setting: true, // 列设置
        }}
        pagination={{
          //设置分页 ，可设置为pagination={false}不加分页
          pageSize: 20,
          current: 1,
        }}
        search={{
          defaultCollapsed: true,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Button
              key="export"
              onClick={() => {
                exportLoginLog({
                  ...formProps.form?.getFieldsValue(),
                  START_DATE: (typeof (formProps.form?.getFieldValue('V_CREATETIME')[0]) == 'string') ? formProps.form?.getFieldValue('V_CREATETIME')[0] : formProps.form?.getFieldValue('V_CREATETIME')[0].format('YYYY-MM-DD'),
                  END_DATE: (typeof (formProps.form?.getFieldValue('V_CREATETIME')[1]) == 'string') ? formProps.form?.getFieldValue('V_CREATETIME')[1] : formProps.form?.getFieldValue('V_CREATETIME')[1].format('YYYY-MM-DD')
                });
              }}
            >
              导出
            </Button>,
          ],
        }}
        request={async (params) => {
          //调用请求加载表格数据， 默认自动加载 params为Search的查询条件参数
          const newParams = {};
          //可对params传参进行进一步处理后再调用查询
          Object.assign(newParams, params);
          return await selectLoginLog({...newParams});
        }}
      />
    </PageContainer>
  );
};

export default Applications;
