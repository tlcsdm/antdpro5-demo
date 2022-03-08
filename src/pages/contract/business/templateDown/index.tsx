import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import 'moment/locale/zh-cn'
import {ProFormInstance} from '@ant-design/pro-form';
import {downloadTemplate, selectTemplate} from "@/services/contract/business/template";
import {selectTemplateType} from "@/services/contract/business/templateType";

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const Applications: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [templateTypeList, setTemplateTypeList] = useState([]);//模板类型

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
      hideInTable: false,
      render: (text, record) =>
        <a onClick={() => downloadTemplate({
          I_ID: record.I_ID,
          V_URL: record.V_URL,
          V_FILENAME: record.V_FILENAME,
        })}>{text}</a>
    }
  ];

  return (
    // 布局标签
    <PageContainer title={false} ghost>
      <ProTable
        columns={columns}// 上面定义的表格列
        headerTitle={false} // 表头
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
        pagination={false}
        search={{
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse()
          ]
        }}
        request={async (params) => {   //调用请求加载表格数据， 默认自动加载 params为Search的查询条件参数
          const newParams = {};
          Object.assign(newParams, params);
          return await selectTemplate({...newParams, V_STATUS: '1'});
        }}
      />
    </PageContainer>
  );
};

export default Applications;
