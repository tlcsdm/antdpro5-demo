import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import 'moment/locale/zh-cn';
import {ProFormInstance} from '@ant-design/pro-form';
import ViewLog from './components/ViewLog';
import {selectLog} from '@/services/contract/common/log';
import {getDate, getMonthFirstDay} from '@/utils/date';
import {Button} from "antd";
import {successEnum} from "@/utils/enum";

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const Applications: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [logId, setLogId] = useState(undefined);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  /**
   * 控制模态框显示和隐藏
   */
  const isShowModal = (show: boolean | ((prevState: boolean) => boolean), id = undefined) => {
    setLogId(id);
    setIsModalVisible(show);
  };

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
      title: '操作',
      width: 50,
      hideInSearch: true,
      valueType: 'option', //操作列的类型
      render: (_, record) => [
        //render渲染 record代表当前行
        <a key={record.I_ID} onClick={() => isShowModal(true, record.I_ID)}>
          查看
        </a>,
      ],
    },
    {
      title: '服务名',
      dataIndex: 'V_SERVICE',
      width: 160,
      hideInSearch: false,
      hideInTable: false,
    },
    {
      title: '模块名',
      dataIndex: 'V_TITLE',
      width: 100,
      hideInSearch: false,
      hideInTable: false,
    },
    {
      title: '操作类型',
      dataIndex: 'V_OPERATETYPE',
      width: 180,
      order: 1,
      hideInSearch: false,
      hideInTable: false,
    },
    {
      title: '操作人',
      dataIndex: 'V_OPERATEPER',
      width: 70,
      hideInSearch: false,
      hideInTable: false,
    },
    {
      title: '请求方法名',
      dataIndex: 'V_SIGNATURE',
      width: 150,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '操作时间',
      dataIndex: 'V_CREATETIME',
      valueType: 'dateTime',
      width: 145,
      hideInTable: false,
      hideInSearch: true,
      sorter: (a, b) => a.V_CREATETIME - b.V_CREATETIME,
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
      title: '客户端IP',
      dataIndex: 'V_IP',
      width: 95,
      hideInSearch: false,
      hideInTable: false,
    },
    {
      title: '状态',
      dataIndex: 'V_SUCCESS',
      width: 60,
      order: 2,
      hideInSearch: false,
      hideInTable: false,
      valueEnum: successEnum,
    },
    {
      title: 'traceid',
      dataIndex: 'I_TRACEID',
      width: 200,
      hideInSearch: false,
      hideInTable: false,
      copyable: true,
    },
    {
      title: '主机名',
      dataIndex: 'V_HOSTNAME',
      width: 100,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '浏览器信息',
      dataIndex: 'V_BROWSER',
      width: 90,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '浏览器版本',
      dataIndex: 'V_VERSION',
      width: 95,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '操作系统信息',
      dataIndex: 'V_OS',
      width: 100,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '请求路径',
      dataIndex: 'V_URL',
      width: 100,
      hideInSearch: false,
      hideInTable: true,
    },
    {
      title: '请求参数',
      dataIndex: 'V_PARAMS',
      width: 100,
      hideInSearch: false,
      hideInTable: true,
    },
    {
      title: '项目版本',
      dataIndex: 'V_PROVERSION',
      width: 80,
      hideInSearch: false,
      hideInTable: true,
    },
  ];

  return (
    // 布局标签
    <PageContainer title={false} ghost>
      <ProTable
        columns={columns} // 上面定义的表格列
        headerTitle="日志列表" // 表头
        actionRef={actionRef} // 用于触发刷新操作等，看api
        formRef={formRef}
        rowKey="I_ID" // 表格行 key 的取值，可以是字符串或一个函数
        manualRequest={true} // 是否需要手动触发首次请求
        scroll={{x: 'max-content'}}
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
              //icon={<DownloadOutlined/>}
              key="export"
              onClick={() => {
                window.location.href = '/api/contract-system/exportLog?' +
                  'V_SERVICE=' + encodeURIComponent(formProps.form?.getFieldValue('V_SERVICE') ? formProps.form?.getFieldValue('V_SERVICE') : '') +
                  '&V_TITLE=' + encodeURIComponent(formProps.form?.getFieldValue('V_TITLE') ? formProps.form?.getFieldValue('V_TITLE') : '') +
                  '&V_OPERATEPER=' + encodeURIComponent(formProps.form?.getFieldValue('V_OPERATEPER') ? formProps.form?.getFieldValue('V_OPERATEPER') : '') +
                  '&V_IP=' + encodeURIComponent(formProps.form?.getFieldValue('V_IP') ? formProps.form?.getFieldValue('V_IP') : '') +
                  '&V_OPERATETYPE=' + encodeURIComponent(formProps.form?.getFieldValue('V_OPERATETYPE') ? formProps.form?.getFieldValue('V_OPERATETYPE') : '') +
                  '&V_SUCCESS=' + encodeURIComponent(formProps.form?.getFieldValue('V_SUCCESS') ? formProps.form?.getFieldValue('V_SUCCESS') : '') +
                  '&V_URL=' + encodeURIComponent(formProps.form?.getFieldValue('V_URL') ? formProps.form?.getFieldValue('V_URL') : '') +
                  '&V_PARAMS=' + encodeURIComponent(formProps.form?.getFieldValue('V_PARAMS') ? formProps.form?.getFieldValue('V_PARAMS') : '') +
                  '&I_TRACEID=' + encodeURIComponent(formProps.form?.getFieldValue('I_TRACEID') ? formProps.form?.getFieldValue('I_TRACEID') : '') +
                  '&START_DATE=' + encodeURIComponent((typeof (formProps.form?.getFieldValue('START_DATE')) == 'string') ? formProps.form?.getFieldValue('START_DATE') : formProps.form?.getFieldValue('START_DATE').format('YYYY-MM-DD')) +
                  '&END_DATE=' + encodeURIComponent((typeof (formProps.form?.getFieldValue('END_DATE')) == 'string') ? formProps.form?.getFieldValue('END_DATE') : formProps.form?.getFieldValue('END_DATE').format('YYYY-MM-DD')) +
                  '&V_PROVERSION=' + encodeURIComponent(formProps.form?.getFieldValue('V_PROVERSION') ? formProps.form?.getFieldValue('V_PROVERSION') : '');
              }}>
              导出
            </Button>
          ],
        }}
        request={async (params) => {
          //调用请求加载表格数据， 默认自动加载 params为Search的查询条件参数
          const newParams = {};
          //可对params传参进行进一步处理后再调用查询
          Object.assign(newParams, params);
          return await selectLog({...newParams});
        }}
      />
      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isModalVisible ? (
          ''
        ) : (
          <ViewLog isModalVisible={isModalVisible} isShowModal={isShowModal} logId={logId}/>
        )
      }
    </PageContainer>
  );
};

export default Applications;
