import {PlusOutlined} from '@ant-design/icons';
import {Button, message, Popconfirm} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import 'moment/locale/zh-cn'
import UpdatePerson from "./components/UpdatePerson";
import {ProFormInstance} from '@ant-design/pro-form';
import {deletePerson, selectPerson, updatePersonPassWord, updatePersonStatus} from "@/services/contract/common/person";
import {statusEnum} from "@/utils/enum";
import ViewPerson from "@/pages/contract/common/person/components/ViewPerson";

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const Applications: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewPersonModalVisible, setIsViewPersonModalVisible] = useState(false);
  const [personId, setPersonId] = useState(undefined);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  /**
   * 控制模态框显示和隐藏
   */
  const isShowModal = (show: boolean | ((prevState: boolean) => boolean), id = undefined) => {
    setPersonId(id);
    setIsModalVisible(show);
  };

  /**
   * 查看模态框显示和隐藏
   */
  const isPersonShowModal = (show: boolean | ((prevState: boolean) => boolean), id = undefined) => {
    setPersonId(id);
    setIsViewPersonModalVisible(show);
  };

  //useEffect参数为空数组时仅初始化执行一次
  useEffect(() => {

  }, []);

  //修改状态
  const updateStatus = async (id: any, V_STATUS: string, status: any) => {
    if (V_STATUS === status) return;
    const rep = await updatePersonStatus({I_ID: id, V_STATUS: status});
    if (rep && rep.success) {
      message.success('操作成功');
      actionRef.current?.reloadAndRest?.();
    }
  };

  //删除人员
  const handleRemove = async (id: any) => {
    if (!id) return true;
    const hide = message.loading('正在删除');
    const req = await deletePerson({
      I_ID: id
    });
    hide();
    if (req && req.success) {
      message.success('删除成功，即将刷新');
      actionRef.current?.reloadAndRest?.(); //刷新Protable
    }
    return true;
  };

  //初始化密码
  const initPasswd = async (id: any) => {
    if (!id) return true;
    const hide = message.loading('正在初始化密码');
    const req = await updatePersonPassWord({
      I_ID: id,
      V_PASSWORD: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'
    });
    hide();
    if (req && req.success) {
      message.success('初始化密码成功');
    }
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
      title: '人员编码',
      dataIndex: 'V_PERCODE',
      width: 100,
      hideInSearch: false,
      hideInTable: false,
      render: (_, record) => [
        <a key={record.I_ID} onClick={() => isPersonShowModal(true, record.I_ID)}>{_}</a>
      ],
    }, {
      title: '人员姓名',
      dataIndex: 'V_PERNAME',
      width: 100,
      hideInSearch: false,
      hideInTable: false
    }, {
      title: '人员登陆名',
      dataIndex: 'V_LOGINNAME',
      width: 100,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '员工号',
      dataIndex: 'V_YGCODE',
      width: 100,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '单位电话',
      dataIndex: 'V_TEL',
      width: 150,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '联系电话',
      dataIndex: 'V_LXDH_CLF',
      width: 100,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '最后登录时间',
      dataIndex: 'D_DATE_LOGIN',
      valueType: 'dateTime',
      width: 120,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '状态',
      dataIndex: 'V_STATUS',
      width: 50,
      hideInSearch: false,
      hideInTable: false,
      valueEnum: statusEnum,
    }, {
      title: '显示排序',
      dataIndex: 'I_ORDER',
      width: 80,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '操作',
      width: 200,
      hideInSearch: true,
      valueType: 'option',  //操作列的类型
      render: (_, record) => [   //render渲染 record代表当前行
        <a key={record.I_ID} onClick={() => isShowModal(true, record.I_ID)}>编辑</a>,
        <a key={record.I_ID} onClick={() => updateStatus(record.I_ID, record.V_STATUS, '1')}>启用</a>,
        <a key={record.I_ID} onClick={() => updateStatus(record.I_ID, record.V_STATUS, '0')}>停用</a>,
        <Popconfirm key={record.I_ID} title="确认删除？" okText="确认" cancelText="取消" onConfirm={(e) => {
          handleRemove(record.I_ID)
        }}>
          <a href="#">删除</a>
        </Popconfirm>,
        <Popconfirm key={record.I_ID} title="确认初始化密码为123456？" okText="确认" cancelText="取消" onConfirm={(e) => {
          initPasswd(record.I_ID)
        }}>
          <a href="#">初始化密码</a>
        </Popconfirm>
      ]
    }
  ];

  return (
    // 布局标签
    <PageContainer title={false} ghost>
      <ProTable
        columns={columns}// 上面定义的表格列
        headerTitle="人员列表" // 表头
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
          //可对params传参进行进一步处理后再调用查询
          Object.assign(newParams, params);
          newParams['V_PERCODE_FORM'] = formRef?.current?.getFieldValue('V_PERCODE');
          return await selectPerson({...newParams});
        }}
      />

      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isModalVisible ? (
          ''
        ) : (
          <UpdatePerson
            isModalVisible={isModalVisible}
            isShowModal={isShowModal}
            actionRef={actionRef}
            personId={personId}
          />
        )
      }

      {
        !isViewPersonModalVisible ? (
          ''
        ) : (
          <ViewPerson
            isViewPersonModalVisible={isViewPersonModalVisible}
            isPersonShowModal={isPersonShowModal}
            personId={personId}
          />
        )
      }
    </PageContainer>
  );
};

export default Applications;
