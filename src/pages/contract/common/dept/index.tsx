import React, {useEffect, useState} from 'react';
import {Button, Form, Input, message, Popconfirm, Select, Spin, Tree} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import UpdateDept from './components/UpdateDept';
import {deleteDept, selectDept, selectDeptTree, updateDeptStatus} from '@/services/contract/common/dept';
import ProCard from '@ant-design/pro-card';
import ProTable, {ProColumns} from "@ant-design/pro-table";
import {PageContainer} from "@ant-design/pro-layout";
import {statusEnum, yesNoTextEnum} from "@/utils/enum";

const Applications: React.FC = () => {
  const [isDeptModalVisible, setIsDeptModalVisible] = useState(false);
  const [editId, setEditId] = useState(undefined);
  const [treeData, setTreeData] = useState([]);
  const [treeKey, setTreeKey] = useState('');
  const [title, setTitle] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();
  const {Option} = Select;

  // @ts-ignore
  useEffect(async () => {
    const rep = await selectDeptTree({});
    setTreeData(deptTree(rep.data));
  }, []);

  const deptTree = (deptTreeData: any) => {
    return deptTreeData.map((item: any) => ({
      key: item.V_DEPTCODE,
      title: item.V_DEPTNAME,
      children: item.children ? deptTree(item.children) : [],
    }));
  };

  //修改状态
  const updateStatus = async (id: any, V_STATUS: string, status: any) => {
    if (V_STATUS === status) return;
    const rep = await updateDeptStatus({I_ID: id, V_STATUS: status});
    if (rep && rep.success) {
      message.success('操作成功');
      getDeptTable(treeKey);
    }
  };

  const getDeptTable = async (selectedKeys: any) => {
    const rep = await selectDept({
      V_DEPTCODE_UP: selectedKeys,
      V_DEPTNAME: form.getFieldValue('V_DEPTNAME'),
      V_DEPTCODE: form.getFieldValue('V_DEPTCODE'),
      V_DEPTTYPE: form.getFieldValue('V_DEPTTYPE'),
      V_STATUS: form.getFieldValue('V_STATUS')
    });
    setDataSource(rep.data);
  };

  /**
   * 删除
   */
  const handleDelete = async (id = undefined) => {
    if (!id) return true;
    const hide = message.loading('正在删除');
    const req = await deleteDept({
      I_ID: id
    });
    hide();
    if (req && req.success) {
      message.success('删除成功，即将刷新');
      const rep = await selectDeptTree({});
      setTreeData(deptTree(rep.data));
      getDeptTable(treeKey);
    }
    return true;
  };

  /**
   * 控制模态框显示和隐藏
   */
  const isShowDeptModal = async (show: boolean | ((prevState: boolean) => boolean), status: any, id: any) => {
    if (treeKey == '') {
      message.warn('请选择上级组织机构');
    } else {
      setEditId(id);
      setIsDeptModalVisible(show);
      if (status) {
        const rep = await selectDeptTree({});
        setTreeData(deptTree(rep.data));
        getDeptTable(treeKey);
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
      title: '组织机构编码',
      dataIndex: 'V_DEPTCODE',
      copyable: true,
      width: 100
    },
    {
      title: '组织机构名称',
      dataIndex: 'V_DEPTNAME',
      width: 100
    },
    {
      title: '组织机构全称',
      dataIndex: 'V_DEPTNAME_FULL',
      width: 150,
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
      title: '组织机构类型',
      dataIndex: 'V_DEPTTYPE',
      width: 100
    },
    {
      title: '是否主体生产单位',
      dataIndex: 'V_PRODUCE',
      width: 100,
      valueEnum: yesNoTextEnum
    },
    {
      title: '单位性质',
      dataIndex: 'V_DLFR',
      width: 60
    },
    {
      title: '地区',
      dataIndex: 'V_DQ',
      width: 60
    },
    {
      title: '状态',
      dataIndex: 'V_STATUS',
      width: 50,
      valueEnum: statusEnum,
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      valueType: 'option',
      render: (_, record) => [
        <a key={record.I_ID} onClick={() => isShowDeptModal(true, false, record.I_ID)}>编辑</a>,
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
                  defaultExpandParent
                  defaultExpandedKeys={['00001']}
                  showLine={true} //文件目录结构展示，true树带线，false树不带线
                  onSelect={(selectedKeys: any, e: any) => { //树的选中事件，里面的参数参考官网api复制, selectedKeys：当前选中树选中项key值，e： 获取树所有数据
                    if (selectedKeys.length === 0) return;
                    setTreeKey(selectedKeys[0]);
                    setTitle(e.node.title);
                    getDeptTable(selectedKeys[0]);
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
              getDeptTable(treeKey);
            }
          }}>
            <Form.Item name="V_DEPTCODE" label="组织机构编码">
              <Input allowClear/>
            </Form.Item>
            <Form.Item name="V_DEPTNAME" label="组织机构名称">
              <Input allowClear/>
            </Form.Item>
            <Form.Item name="V_DEPTTYPE" label="组织机构类型">
              <Input allowClear/>
            </Form.Item>
            <Form.Item name="V_STATUS" label="状态">
              <Select allowClear style={{width: 70}}>
                <Option value="0">停用</Option>
                <Option value="1">启用</Option>
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
            headerTitle={`${title}下级组织`}
            toolBarRender={() => [
              <Button
                key="button"
                icon={<PlusOutlined/>}
                type="primary"
                onClick={() => isShowDeptModal(true, false, '')}
              >
                新建
              </Button>,
            ]}
          />
        </ProCard>

        {
          // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
          !isDeptModalVisible ? (
            ''
          ) : (
            <UpdateDept
              isDeptModalVisible={isDeptModalVisible}
              isShowDeptModal={isShowDeptModal}
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
