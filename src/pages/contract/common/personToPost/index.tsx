import React, {useEffect, useState} from 'react';
import {Button, message, Popconfirm, Spin, Tree} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {selectDeptTree} from '@/services/contract/common/dept';
import ProCard from '@ant-design/pro-card';
import ProTable, {ProColumns} from "@ant-design/pro-table";
import {deletePersonToPost, insertPersonToPostBatch, selectPersonToPost} from "@/services/contract/common/personToPost";
import {deletePersonToDept, insertPersonToDeptBatch, selectPersonToDept} from "@/services/contract/common/personToDept";
import {PageContainer} from "@ant-design/pro-layout";
import PreChoosePerson from "@/components/Choose/PreChoosePerson";
import PreChoosePost from "@/components/Choose/PreChoosePost";

const Applications: React.FC = () => {
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [treeKey, setTreeKey] = useState('');
  const [orgCode, setOrgCode] = useState('');
  const [title, setTitle] = useState('');
  const [personDataSource, setPersonDataSource] = useState([]);
  const [postDataSource, setPostDataSource] = useState([]);
  const [personName, setPersonName] = useState('');
  const [personCode, setPersonCode] = useState('');
  const [isUserPostModalVisible, setIsUserPostModalVisible] = useState(false);
  const [personList, setPersonList] = useState([]);
  const [postList, setPostList] = useState([]);
  // @ts-ignore
  useEffect(async () => {
    const rep = await selectDeptTree({});
    setTreeData(deptTree(rep.data));
  }, []);

  //选择的人员数据
  // @ts-ignore
  useEffect(async () => {
    // @ts-ignore
    if (personList && personList.length > 0) {
      const hide = message.loading('正在新增');
      let V_PERCODE_FORMLIST = [];
      for (let i = 0; i < personList.length; i++) {
        // @ts-ignore
        V_PERCODE_FORMLIST.push(personList[i].V_PERCODE);
      }
      const req = await insertPersonToDeptBatch({
        V_PERCODE_FORMLIST: V_PERCODE_FORMLIST.toString(),
        V_ORGCODE: orgCode,
        V_DEPTCODE: treeKey,
      });
      hide();
      if (req && req.success) {
        message.success('新增成功，即将刷新');
        getPersonTable(treeKey);
      }
    }
  }, [personList]);

  //选择的岗位数据
  // @ts-ignore
  useEffect(async () => {
    // @ts-ignore
    if (postList && postList.length > 0) {
      const hide = message.loading('正在新增');
      const req = await insertPersonToPostBatch({V_PERCODE_FORM: personCode, V_POSTCODELIST: postList.toString()});
      hide();
      if (req && req.success) {
        message.success('新增成功，即将刷新');
        getPostDataSource(personCode, personName);
      }
    }
  }, [postList]);

  const deptTree = (deptTreeData: any) => {
    return deptTreeData.map((item: any) => ({
      key: item.V_DEPTCODE,
      title: item.V_DEPTNAME,
      children: item.children ? deptTree(item.children) : [],
      orgCode: item.V_DEPTCODE_UP,
    }));
  };

  //获取组织机构下的人员数据
  const getPersonTable = async (selectedKeys: any) => {
    const rep = await selectPersonToDept({V_DEPTCODE: selectedKeys});
    setPersonDataSource(rep.data);
  };

  //获取人员岗位数据
  const getPostDataSource = async (code: any, name: any) => {
    setPersonName(name);
    setPersonCode(code);
    const rep = await selectPersonToPost({V_PERCODE_FORM: code});
    setPostDataSource(rep.data);
  };

  //删除人员岗位关系
  const handlePostDelete = async (id = undefined) => {
    if (!id) return true;
    const hide = message.loading('正在删除');
    const req = await deletePersonToPost({
      I_ID: id
    });
    hide();
    if (req && req.success) {
      message.success('删除成功，即将刷新');
      getPostDataSource(personCode, personName);
    }
    return true;
  };

  //删除人员组织机构关系
  const handlePersonDelete = async (id = undefined) => {
    if (!id) return true;
    const hide = message.loading('正在删除');
    const req = await deletePersonToDept({
      I_ID: id
    });
    hide();
    if (req && req.success) {
      message.success('删除成功，即将刷新');
      getPersonTable(treeKey);
    }
    return true;
  };

  /**
   * 控制模态框显示和隐藏
   */
  const isShowUserModal = async (show: boolean | ((prevState: boolean) => boolean)) => {
    if (treeKey == '') {
      message.warn('请选择上级组织机构');
    } else {
      setIsUserModalVisible(show);
    }
  };

  /**
   * 控制模态框显示和隐藏
   */
  const isShowUserPostModal = async (show: boolean | ((prevState: boolean) => boolean)) => {
    if (personCode == '') {
      message.warn('请选择人员');
    } else {
      setIsUserPostModalVisible(show);
    }
  };

  const personColumns: ProColumns[] = [
    {
      title: '序号',
      width: 50,
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '人员登陆名',
      dataIndex: 'V_LOGINNAME',
      width: 100,
    },
    {
      title: '人员编码',
      dataIndex: 'V_PERCODE',
      width: 100,
    },
    {
      title: '姓名',
      dataIndex: 'V_PERNAME',
      width: 100,
    },
    {
      title: '所属部门',
      dataIndex: 'V_DEPTNAME',
      width: 100,
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm key={record.I_ID} title="确认删除？" okText="确认" cancelText="取消" onConfirm={(e) => {
          handlePersonDelete(record.I_ID)
        }}>
          <a href="#">删除</a>
        </Popconfirm>
      ],
    },
  ];

  const postColumns: ProColumns[] = [
    {
      title: '序号',
      width: 50,
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '岗位编码',
      dataIndex: 'V_POSTCODE',
      width: 120,
    },
    {
      title: '岗位名称',
      dataIndex: 'V_POSTNAME',
      width: 100,
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm key={record.I_ID} title="确认删除？" okText="确认" cancelText="取消" onConfirm={(e) => {
          handlePostDelete(record.I_ID)
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
                    setOrgCode(e.node.orgCode);
                    setTitle(e.node.title);
                    getPersonTable(selectedKeys[0]);
                  }}
                  height={700}
                />
              )
            }
          </div>
        </ProCard>

        <ProCard colSpan="80%" ghost>
          <ProTable
            columns={personColumns}
            dataSource={personDataSource}
            scroll={{x: 1050, y: 300}}
            search={false}
            rowKey="I_ID"
            onRow={record => {
              return {
                onClick: event => getPostDataSource(record.V_PERCODE, record.V_PERNAME)
              };
            }}
            dateFormatter="string"
            headerTitle={`${title}人员`}
            toolBarRender={() => [
              <Button
                key="button"
                icon={<PlusOutlined/>}
                type="primary"
                onClick={() => isShowUserModal(true)}
              >
                新建
              </Button>
            ]}
          />
          <ProTable
            columns={postColumns}
            dataSource={postDataSource}
            scroll={{x: 700, y: 300}}
            search={false}
            rowKey="I_ID"
            pagination={false}
            dateFormatter="string"
            headerTitle={`${personName}所属岗位`}
            toolBarRender={() => [
              <Button
                key="button"
                icon={<PlusOutlined/>}
                type="primary"
                onClick={() => isShowUserPostModal(true)}
              >
                新建
              </Button>
            ]}
          />
        </ProCard>

        {
          // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
          !isUserModalVisible ? (
            ''
          ) : (
            <PreChoosePerson
              isUserModalVisible={isUserModalVisible}
              isShowUserModal={isShowUserModal}
              setPersonList={setPersonList}
              personDataSource={personDataSource}
            />
          )
        }

        {
          // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
          !isUserPostModalVisible ? (
            ''
          ) : (
            <PreChoosePost
              isUserPostModalVisible={isUserPostModalVisible}
              isShowUserPostModal={isShowUserPostModal}
              postDataSource={postDataSource}
              setPostList={setPostList}
            />
          )
        }
      </ProCard>
    </PageContainer>
  );
};
export default Applications;
