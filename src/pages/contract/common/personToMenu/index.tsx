import React, {useEffect, useState} from 'react';
import {Button, message, Popconfirm, Spin, Tree} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {selectDeptTree} from '@/services/contract/common/dept';
import ProCard from '@ant-design/pro-card';
import ProTable, {ProColumns} from "@ant-design/pro-table";
import {selectPersonToDept} from "@/services/contract/common/personToDept";
import {PageContainer} from "@ant-design/pro-layout";
import {deletePersonToMenu, insertPersonToMenuBatch, selectPersonToMenu} from "@/services/contract/common/personToMenu";
import PreChooseMenu from "@/components/Choose/PreChooseMenu";

const Applications: React.FC = () => {
  const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [title, setTitle] = useState('');
  const [personDataSource, setPersonDataSource] = useState([]);
  const [postDataSource, setPostDataSource] = useState([]);
  const [personName, setPersonName] = useState('');
  const [personCode, setPersonCode] = useState('');
  const [menuList, setMenuList] = useState([]);
  // @ts-ignore
  useEffect(async () => {
    const rep = await selectDeptTree({});
    setTreeData(deptTree(rep.data));
  }, []);

  //选择的菜单数据
  // @ts-ignore
  useEffect(async () => {
    // @ts-ignore
    if (menuList && menuList.length > 0) {
      const hide = message.loading('正在新增');
      const req = await insertPersonToMenuBatch({
        V_MENUCODELIST: menuList.toString(),
        V_PERCODE_FORM: personCode,
      });
      hide();
      if (req && req.success) {
        message.success('新增成功，即将刷新');
        getMenuDataSource(personCode, personName);
      }
    }
  }, [menuList]);

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

  //获取人员菜单数据
  const getMenuDataSource = async (code: any, name: any) => {
    setPersonName(name);
    setPersonCode(code);
    const rep = await selectPersonToMenu({V_PERCODE_FORM: code});
    setPostDataSource(rep.data);
  };

  //删除人员菜单关系
  const handleMenuDelete = async (id = undefined) => {
    if (!id) return true;
    const hide = message.loading('正在删除');
    const req = await deletePersonToMenu({
      I_ID: id
    });
    hide();
    if (req && req.success) {
      message.success('删除成功，即将刷新');
      getMenuDataSource(personCode, personName);
    }
    return true;
  };

  /**
   * 控制模态框显示和隐藏
   */
  const isShowMenuModal = async (show: boolean | ((prevState: boolean) => boolean), status: any) => {
    if (personCode == '') {
      message.warn('请选择人员');
    } else {
      setIsMenuModalVisible(show);
      if (status) {
        getMenuDataSource(personCode, personName);
      }
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
    }
  ];

  const postColumns: ProColumns[] = [
    {
      title: '序号',
      width: 50,
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '菜单编码',
      dataIndex: 'V_MENUCODE',
      width: 120,
    },
    {
      title: '菜单名称',
      dataIndex: 'V_NAME',
      width: 100,
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm key={record.I_ID} title="确认删除？" okText="确认" cancelText="取消" onConfirm={(e) => {
          handleMenuDelete(record.I_ID)
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
                onClick: event => getMenuDataSource(record.V_PERCODE, record.V_PERNAME)
              };
            }}
            dateFormatter="string"
            headerTitle={`${title}人员列表`}
          />
          <ProTable
            columns={postColumns}
            dataSource={postDataSource}
            scroll={{x: 700, y: 300}}
            search={false}
            rowKey="I_ID"
            pagination={false}
            dateFormatter="string"
            headerTitle={`${personName}所属菜单列表`}
            toolBarRender={() => [
              <Button
                key="button"
                icon={<PlusOutlined/>}
                type="primary"
                onClick={() => isShowMenuModal(true, false)}
              >
                新建
              </Button>
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
              menuDataSource={postDataSource}
            />
          )
        }

      </ProCard>
    </PageContainer>
  );
};
export default Applications;
