import React, {useEffect, useState} from 'react';
import {Button, Form, Input, message, Popconfirm, Spin, Tree} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import UpdateMenu from './components/UpdateMenu';
import {deleteMenu, selectMenu, selectMenuTree} from '@/services/contract/common/menu';
import ProCard from '@ant-design/pro-card';
import ProTable, {ProColumns} from "@ant-design/pro-table";
import {PageContainer} from "@ant-design/pro-layout";

const Applications: React.FC = () => {
  const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
  const [editId, setEditId] = useState(undefined);
  const [treeData, setTreeData] = useState([]);
  const [treeKey, setTreeKey] = useState('');
  const [title, setTitle] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();

  // @ts-ignore
  useEffect(async () => {
    const rep = await selectMenuTree({});
    setTreeData(menuTree(rep.data));
  }, []);

  const menuTree = (menuTreeData: any) => {
    return menuTreeData.map((item: any) => ({
      key: item.I_ID,
      title: item.V_NAME,
      children: item.children ? menuTree(item.children) : [],
    }));
  };

  const getMenuTable = async (selectedKeys: any) => {
    const rep = await selectMenu({
      I_PID: selectedKeys,
      V_NAME: form.getFieldValue('V_NAME'),
      V_CODE: form.getFieldValue('V_CODE'),
      V_SYSTYPE: form.getFieldValue('V_SYSTYPE')
    });
    setDataSource(rep.data);
  };

  /**
   * 删除
   */
  const handleDelete = async (id = undefined) => {
    if (!id) return true;
    const hide = message.loading('正在删除');
    const req = await deleteMenu({
      I_ID: id
    });
    hide();
    if (req && req.success) {
      message.success('删除成功，即将刷新');
      const rep = await selectMenuTree({});
      setTreeData(menuTree(rep.data));
      getMenuTable(treeKey);
    }
    return true;
  };

  /**
   * 控制模态框显示和隐藏
   */
  const isShowMenuModal = async (show: boolean | ((prevState: boolean) => boolean), status: any, id: any) => {
    if (treeKey == '') {
      message.warn('请选择父节点菜单');
    } else {
      setEditId(id);
      setIsMenuModalVisible(show);
      if (status) {
        const rep = await selectMenuTree({});
        setTreeData(menuTree(rep.data));
        getMenuTable(treeKey);
      }
    }
  };

  const columns: ProColumns[] = [
    {
      title: '序号',
      width: 50,
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '菜单编号',
      dataIndex: 'I_ID',
      copyable: true,
      width: 120
    },
    {
      title: '菜单名称',
      dataIndex: 'V_NAME',
      width: 150
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
            display: 'inline-block',
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
      title: '显示顺序',
      dataIndex: 'I_ORDER',
      width: 50,
      hideInSearch: true,
      hideInTable: false
    },
    {
      title: '操作',
      width: 60,
      fixed: 'right',
      valueType: 'option',
      render: (_, record) => [
        <a key={record.I_ID} onClick={() => isShowMenuModal(true, false, record.I_ID)}>编辑</a>,
        <Popconfirm key={record.I_ID} title="确认删除？" okText="确认" cancelText="取消" onConfirm={() => {
          handleDelete(record.I_ID)
        }}>
          <a href="#">删除</a>
        </Popconfirm>
      ],
    },
  ];

  return (
    <PageContainer title={false} ghost>
      <ProCard>
        <ProCard colSpan="20%" ghost> {/*设置ProCard的宽度*/}
          <div style={{padding: 4}}>
            {
              treeData.length == 0 ? (
                <div style={{paddingTop: 60, paddingLeft: 130}}>
                  <Spin/> {/*加载框*/}
                </div>
              ) : (
                <Tree
                  treeData={treeData} //树的数据
                  defaultExpandAll //全展开
                  showLine={true} //文件目录结构展示，true树带线，false树不带线
                  onSelect={(selectedKeys: any, e: any) => { //树的选中事件，里面的参数参考官网api复制, selectedKeys：当前选中树选中项key值，e： 获取树所有数据
                    if (selectedKeys.length === 0) return;
                    setTreeKey(selectedKeys[0]);
                    setTitle(e.node.title);
                    getMenuTable(selectedKeys[0]);
                  }}
                  height={700}
                />
              )
            }
          </div>
        </ProCard>

        <ProCard colSpan="80%" ghost>
          <Form form={form} layout="inline" onKeyDown={(e) => {
            if (e.keyCode === 13) {
              getMenuTable(treeKey);
            }
          }}>
            <Form.Item name="V_CODE" label="菜单编码">
              <Input allowClear/>
            </Form.Item>
            <Form.Item name="V_NAME" label="菜单名称">
              <Input allowClear/>
            </Form.Item>
            <Form.Item name="V_SYSTYPE" label="系统编码">
              <Input allowClear/>
            </Form.Item>
          </Form>
          <ProTable
            columns={columns}
            dataSource={dataSource}
            scroll={{x: 800, y: 460}}
            search={false}
            pagination={false}
            rowKey="I_ID"
            dateFormatter="string"
            headerTitle={`${title}子菜单`}
            toolBarRender={() => [
              <Button
                key="button"
                icon={<PlusOutlined/>}
                type="primary"
                onClick={() => isShowMenuModal(true, false, '')}
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
            <UpdateMenu
              isMenuModalVisible={isMenuModalVisible}
              isShowMenuModal={isShowMenuModal}
              editId={editId}
              treeKey={treeKey}
              title={title}
            />
          )
        }

      </ProCard>
    </PageContainer>
  );
};

export default Applications;
