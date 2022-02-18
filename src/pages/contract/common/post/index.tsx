import React, {useEffect, useState} from 'react';
import {Button, Form, Input, message, Popconfirm, Select, Spin, Tree} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import UpdatePost from './components/UpdatePost';
import {deletePost, selectPost, selectPostTree, updatePostStatus} from '@/services/contract/common/post';
import ProCard from '@ant-design/pro-card';
import ProTable, {ProColumns} from "@ant-design/pro-table";
import {PageContainer} from "@ant-design/pro-layout";
import {statusEnum, yesNoEnum} from "@/utils/enum";

const Applications: React.FC = () => {
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  const [editId, setEditId] = useState(undefined);
  const [treeData, setTreeData] = useState([]);
  const [treeKey, setTreeKey] = useState('');
  const [title, setTitle] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();
  const {Option} = Select;

  // @ts-ignore
  useEffect(async () => {
    const rep = await selectPostTree({});
    setTreeData(postTree(rep.data));
  }, []);

  //修改状态
  const updateStatus = async (id: any, V_STATUS: string, status: any) => {
    if (V_STATUS === status) return;
    const rep = await updatePostStatus({I_ID: id, V_STATUS: status});
    if (rep && rep.success) {
      message.success('操作成功');
      getPostTable(treeKey);
    }
  };

  const postTree = (postTreeData: any) => {
    return postTreeData.map((item: any) => ({
      key: item.V_POSTCODE,
      title: item.V_POSTNAME,
      children: item.children ? postTree(item.children) : [],
    }));
  };

  const getPostTable = async (selectedKeys: any) => {
    const rep = await selectPost({
      V_POSTCODE_UP: selectedKeys,
      V_POSTNAME: form.getFieldValue('V_POSTNAME'),
      V_POSTCODE: form.getFieldValue('V_POSTCODE'),
      V_ISADMIN: form.getFieldValue('V_ISADMIN')
    });
    setDataSource(rep.data);
  };

  /**
   * 删除
   */
  const handleDelete = async (id = undefined) => {
    if (!id) return true;
    const hide = message.loading('正在删除');
    const req = await deletePost({
      I_ID: id
    });
    hide();
    if (req && req.success) {
      message.success('删除成功，即将刷新');
      const rep = await selectPostTree({});
      setTreeData(postTree(rep.data));
      getPostTable(treeKey);
    }
    return true;
  };

  /**
   * 控制模态框显示和隐藏
   */
  const isShowPostModal = async (show: boolean | ((prevState: boolean) => boolean), status: any, id: any) => {
    if (treeKey == '') {
      message.warn('请选择上级岗位');
    } else {
      setEditId(id);
      setIsPostModalVisible(show);
      if (status) {
        const rep = await selectPostTree({});
        setTreeData(postTree(rep.data));
        getPostTable(treeKey);
      }
    }
  };

  const columns: ProColumns[] = [
    {
      title: '序号',
      width: 50,
      render: (text, record, index) => `${index + 1}`,
    }, {
      title: '岗位编码',
      dataIndex: 'V_POSTCODE',
      copyable: true,
      width: 150
    }, {
      title: '岗位名称',
      dataIndex: 'V_POSTNAME',
      width: 150,
    }, {
      title: '是否为管理员',
      dataIndex: 'V_ISADMIN',
      width: 70,
      valueEnum: yesNoEnum,
    }, {
      title: '显示顺序',
      dataIndex: 'I_ORDER',
      width: 80,
      hideInSearch: true,
      hideInTable: false
    }, {
      title: '状态',
      dataIndex: 'V_STATUS',
      width: 50,
      valueEnum: statusEnum,
    }, {
      title: '操作',
      width: 180,
      fixed: 'right',
      valueType: 'option',
      render: (_, record) => [
        <a key={record.I_ID} onClick={() => isShowPostModal(true, false, record.I_ID)}>编辑</a>,
        <a key={record.I_ID} onClick={() => updateStatus(record.I_ID, record.V_STATUS, '1')}>启用</a>,
        <a key={record.I_ID} onClick={() => updateStatus(record.I_ID, record.V_STATUS, '0')}>停用</a>,
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
                    getPostTable(selectedKeys[0]);
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
              getPostTable(treeKey);
            }
          }}>
            <Form.Item name="V_POSTCODE" label="岗位编码">
              <Input allowClear/>
            </Form.Item>
            <Form.Item name="V_POSTNAME" label="岗位名称">
              <Input allowClear/>
            </Form.Item>
            <Form.Item name="V_ISADMIN" label="是否为管理员">
              <Select allowClear style={{width: 70}}>
                <Option value="0">否</Option>
                <Option value="1">是</Option>
              </Select>
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
            headerTitle={`${title}子岗位`}
            toolBarRender={() => [
              <Button
                key="button"
                icon={<PlusOutlined/>}
                type="primary"
                onClick={() => isShowPostModal(true, false, '')}
              >
                新建
              </Button>,
            ]}
          />
        </ProCard>

        {
          // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
          !isPostModalVisible ? (
            ''
          ) : (
            <UpdatePost
              isPostModalVisible={isPostModalVisible}
              isShowPostModal={isShowPostModal}
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
