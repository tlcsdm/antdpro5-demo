import {PlusOutlined} from '@ant-design/icons';
import {Button, Divider, message, Popconfirm} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import 'moment/locale/zh-cn'
import UpdateTemplate from "./components/UpdateTemplate";
import {ProFormInstance} from '@ant-design/pro-form';
import {
  deleteTemplate,
  downloadTemplate,
  selectTemplate,
  updateTemplateStatus
} from "@/services/contract/business/template";
import {selectTemplateType} from "@/services/contract/business/templateType";
import {statusEnum} from "@/utils/enum";
import StatusSwitch from "@/components/StatusSwitch";

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const Applications: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [templateId, setTemplateId] = useState(undefined);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [templateTypeList, setTemplateTypeList] = useState([]);//模板类型

  /**
   * 控制模态框显示和隐藏
   */
  const isShowModal = (show: boolean | ((prevState: boolean) => boolean), id = undefined) => {
    setTemplateId(id);
    setIsModalVisible(show);
  };

  //查询模板类型
  const initTemplateType = async () => {
    // 这里异步请求后台将数据拿到
    const response = await selectTemplateType({V_STATUS: '1'});
    const templateTempList: any = [];
    response.data.forEach(function (item: any) {
      const tempTemplateDetail: any = {value: item.I_ID, label: item.V_NAME};
      templateTempList.push(tempTemplateDetail);
    });
    setTemplateTypeList(templateTempList);
    formRef.current?.setFieldsValue?.({V_TYPEID: ''});
  };

  //useEffect参数为空数组时仅初始化执行一次
  useEffect(() => {
    initTemplateType();
  }, []);

  //删除合同模版
  const handleRemove = async (id: any, V_URL: any) => {
    if (!id) return true;
    const hide = message.loading('正在删除');
    await deleteTemplate({
      I_ID: id,
      V_URL: V_URL
    });
    hide();
    message.success('删除成功，即将刷新');
    actionRef.current?.reloadAndRest?.(); //刷新Protable
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
      title: '模板类型',
      dataIndex: 'V_TYPEID',
      width: 150,
      valueType: 'select',
      fieldProps: {
        options: templateTypeList,
        onChange() {
          formRef.current?.submit();
        }
      },
      hideInSearch: false,
      hideInTable: false
    },
    {
      title: '模版名称',
      dataIndex: 'V_NAME',
      width: 150,
      hideInSearch: false,
      hideInTable: false
    }, {
      title: '模板查看',
      width: 100,
      hideInSearch: true,
      valueType: 'option',  //操作列的类型
      render: (_, record) => [   //render渲染 record代表当前行
        <a key={record.I_ID} /*onClick={() => isViewShowModal(true, record.I_ID)}*/>查看</a>,
      ]
    }, {
      title: '状态',
      dataIndex: 'V_STATUS',
      width: 100,
      hideInSearch: false,
      hideInTable: false,
      valueEnum: statusEnum,
      render: (text, record, index) => <StatusSwitch row={record} key={record.I_ID}
                                                     updateStatus={updateTemplateStatus}/>
    }, {
      title: '最后修改时间',
      dataIndex: 'D_DATE_EDIT',
      valueType: 'dateTime',
      width: 150,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '操作',
      width: 150,
      hideInSearch: true,
      valueType: 'option',  //操作列的类型
      render: (_, record) => [   //render渲染 record代表当前行
        <>
          <a key={record.I_ID} onClick={() => isShowModal(true, record.I_ID)}>编辑</a>
          <Divider type="vertical"/>
          <Popconfirm key={record.I_ID} title="确认删除？" okText="确认" cancelText="取消" onConfirm={(e) => {
            handleRemove(record.I_ID, record.V_URL);
          }}>
            <a href="#">删除</a>
          </Popconfirm>
          <Divider type="vertical"/>
          <a key={record.I_ID} onClick={() => downloadTemplate({
            I_ID: record.I_ID,
            V_URL: record.V_URL,
            V_FILENAME: record.V_FILENAME,
          })}>下载</a>
        </>
      ]
    }
  ];

  return (
    // 布局标签
    <PageContainer title={false} ghost>
      <ProTable
        columns={columns}// 上面定义的表格列
        headerTitle="合同模版列表" // 表头
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
          Object.assign(newParams, params);
          return await selectTemplate({...newParams});
        }}
      />

      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isModalVisible ? (
          ''
        ) : (
          <UpdateTemplate
            isModalVisible={isModalVisible}
            isShowModal={isShowModal}
            actionRef={actionRef}
            templateId={templateId}
          />
        )
      }
    </PageContainer>
  );
};

export default Applications;
