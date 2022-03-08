import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import 'moment/locale/zh-cn';
import {ProFormInstance} from '@ant-design/pro-form';
import {selectRole} from "@/services/contract/common/role";
import ProCard from "@ant-design/pro-card";
import {Button, message, Popconfirm} from "antd";
import {PlusOutlined} from "@ant-design/icons/lib";
import PreChooseMenu from "@/components/Choose/PreChooseMenu";
import {deleteRoleToMenu, insertRoleToMenuBatch, selectRoleToMenu} from "@/services/contract/common/roleToMenu";

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const Applications: React.FC = () => {
  const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [roleKey, setRoleKey] = useState('');
  const [title, setTitle] = useState('');
  const [menuDataSource, setMenuDataSource] = useState([]);
  const [menuList, setMenuList] = useState([]);

  const getRoleToMenuTable = async (roleId: any, roleName: any) => {
    setRoleKey(roleId);
    setTitle(roleName);
    const rep = await selectRoleToMenu({
      V_ORLECODE: roleId,
    });
    setMenuDataSource(rep.data);
  };

  //选择的角色数据
  // @ts-ignore
  useEffect(async () => {
    // @ts-ignore
    if (menuList && menuList.length > 0) {
      const hide = message.loading('正在新增');
      const req = await insertRoleToMenuBatch({
        V_MENUCODELIST: menuList.toString(),
        V_ORLECODE: roleKey,
      });
      hide();
      if (req && req.success) {
        message.success('新增成功，即将刷新');
        getRoleToMenuTable(roleKey, title);
      }
    }
  }, [menuList]);

  //useEffect参数为空数组时仅初始化执行一次
  useEffect(() => {

  }, []);

  /**
   * 控制模态框显示和隐藏
   */
  const isShowMenuModal = async (show: boolean | ((prevState: boolean) => boolean)) => {
    if (roleKey == '') {
      message.warn('请选择角色');
    } else {
      setIsMenuModalVisible(show);
    }
  };

  /**
   * 删除
   */
  const handleDelete = async (id = undefined) => {
    if (!id) return true;
    const hide = message.loading('正在删除');
    const req = await deleteRoleToMenu({
      I_ID: id
    });
    hide();
    if (req && req.success) {
      message.success('删除成功，即将刷新');
      getRoleToMenuTable(roleKey, title);
    }
    return true;
  };

  const roleColumns: ProColumns[] = [  //定义 Protable的列 columns放在Protable
    {
      title: '角色编码',
      dataIndex: 'V_ORLECODE',
      width: 50,
      hideInSearch: false,
      hideInTable: false
    }, {
      title: '角色名称',
      dataIndex: 'V_ORLENAME',
      order: 2,
      width: 50,
      hideInSearch: false,
      hideInTable: false
    }
  ];

  const menuColumns: ProColumns[] = [
    {
      title: '序号',
      width: 50,
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '菜单编号',
      dataIndex: 'V_MENUCODE',
      width: 130
    },
    {
      title: '菜单名称',
      dataIndex: 'V_NAME',
      width: 100
    },
    {
      title: '访问路径',
      dataIndex: 'V_ADDRESS',
      width: 150,
      sorter: (a: any, b: any) => a.V_ADDRESS.localeCompare(b.V_ADDRESS, 'en'),
      render: (text) => (
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: 250,
          }}
          title={`${text}`}
        >
          {text}
        </span>
      ),
    },
    {
      title: '菜单图标',
      dataIndex: 'V_ADDRESS_ICO',
      width: 70
    },
    {
      title: '系统编码',
      dataIndex: 'V_SYSTYPE',
      width: 70
    },
    {
      title: '操作',
      width: 60,
      fixed: 'right',
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm key={record.I_ID} title="确认删除？" okText="确认" cancelText="取消" onConfirm={() => {
          handleDelete(record.I_ID,)
        }}>
          <a href="#">删除</a>
        </Popconfirm>
      ],
    },
  ];

  return (
    // 布局标签
    <PageContainer title={false} ghost>
      <ProCard>
        <ProCard colSpan="40%">
          <ProTable
            columns={roleColumns}// 上面定义的表格列
            scroll={{y: 430}}
            actionRef={actionRef} // 用于触发刷新操作等，看api
            formRef={formRef}
            onRow={record => {
              return {
                onClick: event => getRoleToMenuTable(record.V_ORLECODE, record.V_ORLENAME)
              };
            }}
            rowKey="I_ID"// 表格行 key 的取值，可以是字符串或一个函数
            dateFormatter="string"
            manualRequest={false} // 是否需要手动触发首次请求
            options={false}
            pagination={false}
            search={{
              optionRender: (searchConfig, formProps, dom) => [
                ...dom.reverse()
              ]
            }}
            request={async (params) => {   //调用请求加载表格数据， 默认自动加载 params为Search的查询条件参数
              const newParams = {};
              //可对params传参进行进一步处理后再调用查询
              Object.assign(newParams, params);
              return await selectRole({...newParams, V_STATUS: '1'});
            }}
          />
        </ProCard>
        <ProCard colSpan="60%">
          <ProTable
            columns={menuColumns}
            dataSource={menuDataSource}
            search={false}
            pagination={false}
            rowKey="I_ID"
            headerTitle={`${title}对应菜单`}
            options={{
              density: true, // 密度
              fullScreen: true, // 全屏
              reload: false, // 刷新
              setting: true // 列设置
            }}
            toolBarRender={() => [
              <Button
                key="button"
                icon={<PlusOutlined/>}
                type="primary"
                onClick={() => isShowMenuModal(true)}
              >
                新建
              </Button>,
            ]}
          />
        </ProCard>
        {
          // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
          !isMenuModalVisible ? (
            ''
          ) : (
            <PreChooseMenu
              isMenuModalVisible={isMenuModalVisible}
              isShowMenuModal={isShowMenuModal}
              setMenuList={setMenuList}
              menuDataSource={menuDataSource}
            />
          )
        }
      </ProCard>
    </PageContainer>
  );
};

export default Applications;
