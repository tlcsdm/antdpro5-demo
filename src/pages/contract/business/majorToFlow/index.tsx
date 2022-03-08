import React, {useEffect, useState} from 'react';
import {Button, message, Popconfirm, Spin, Tree} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {selectDeptTree} from '@/services/contract/common/dept';
import ProCard from '@ant-design/pro-card';
import ProTable, {ProColumns} from "@ant-design/pro-table";
import {PageContainer} from "@ant-design/pro-layout";
import {selectMajor} from "@/services/contract/business/major";
import PreChooseRole from "@/components/Choose/PreChooseRole";
import {deleteMajorToFlow, selectMajorToFlow} from "@/services/contract/business/majorToFlow";

const Applications: React.FC = () => {
  const [treeData, setTreeData] = useState([]);
  const [title, setTitle] = useState('');
  const [majorDataSource, setMajorDataSource] = useState([]);
  const [flowDataSource, setFlowDataSource] = useState([]);
  const [majorName, setMajorName] = useState('');
  const [majorId, setMajorId] = useState('');
  const [isMajorFlowModalVisible, setIsMajorFlowModalVisible] = useState(false);
  const [flowList, setFlowList] = useState([]);
  // @ts-ignore
  useEffect(async () => {
    const rep = await selectDeptTree({});
    setTreeData(deptTree(rep.data));
  }, []);

  //选择的角色数据
  // @ts-ignore
  useEffect(async () => {
    // if (flowList && flowList.length > 0) {
    //   const hide = message.loading('正在新增');
    //   let V_ORLECODELIST = [];
    //   for (let i = 0; i < flowList.length; i++) {
    //     // @ts-ignore
    //     V_ORLECODELIST.push(flowList[i].V_ORLECODE);
    //   }
    //   const req = await insertMajorToFlowBatch({
    //     V_ORLECODELIST: V_ORLECODELIST.toString(),
    //     V_MAJORID: majorId,
    //   });
    //   hide();
    //   if (req && req.success) {
    //     message.success('新增成功，即将刷新');
    //     getFlowDataSource(majorId, majorName);
    //   }
    // }
  }, [flowList]);

  const deptTree = (deptTreeData: any) => {
    return deptTreeData.map((item: any) => ({
      key: item.V_DEPTCODE,
      title: item.V_DEPTNAME,
      children: item.children ? deptTree(item.children) : [],
    }));
  };

  //获取组织机构下的专业数据
  const getMajorTable = async (selectedKeys: any) => {
    const rep = await selectMajor({V_DEPTCODE: selectedKeys});
    setMajorDataSource(rep.data);
  };

  //获取专业对应流程数据
  const getFlowDataSource = async (id: any, name: any) => {
    setMajorName(name);
    setMajorId(id);
    const rep = await selectMajorToFlow({V_MAJORID: id});
    setFlowDataSource(rep.data);
  };

  //删除专业流程关系
  const handleDelete = async (id = undefined) => {
    if (!id) return true;
    const hide = message.loading('正在删除');
    const req = await deleteMajorToFlow({
      I_ID: id
    });
    hide();
    if (req && req.success) {
      message.success('删除成功，即将刷新');
      getFlowDataSource(majorId, majorName);
    }
    return true;
  };

  /**
   * 控制模态框显示和隐藏
   */
  const isShowMajorFlowModal = async (show: boolean | ((prevState: boolean) => boolean)) => {
    if (majorId == '') {
      message.warn('请选择专业');
    } else {
      setIsMajorFlowModalVisible(show);
    }
  };

  const majorColumns: ProColumns[] = [
    {
      title: '序号',
      width: 50,
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '专业名称',
      dataIndex: 'V_NAME',
      width: 100,
    }
  ];

  const flowColumns: ProColumns[] = [
    {
      title: '序号',
      width: 50,
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '角色编码',
      dataIndex: 'V_ORLECODE',
      width: 120,
    },
    {
      title: '角色名称',
      dataIndex: 'V_ORLENAME',
      width: 100,
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm key={record.I_ID} title="确认删除？" okText="确认" cancelText="取消" onConfirm={(e) => {
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
                    setTitle(e.node.title);
                    getMajorTable(selectedKeys[0]);
                    setMajorId('');
                  }}
                  height={700}
                />
              )
            }
          </div>
        </ProCard>

        <ProCard colSpan="80%" ghost>
          <ProTable
            columns={majorColumns}
            dataSource={majorDataSource}
            scroll={{x: 1050, y: 300}}
            search={false}
            rowKey="I_ID"
            onRow={record => {
              return {
                onClick: event => getFlowDataSource(record.I_ID, record.V_NAME)
              };
            }}
            dateFormatter="string"
            headerTitle={`${title}专业`}
          />
          <ProTable
            columns={flowColumns}
            dataSource={flowDataSource}
            scroll={{x: 700, y: 300}}
            search={false}
            rowKey="I_ID"
            pagination={false}
            dateFormatter="string"
            headerTitle={`${majorName}对应流程`}
            toolBarRender={() => [
              <Button
                key="button"
                icon={<PlusOutlined/>}
                type="primary"
                disabled={(majorId === '')}
                onClick={() => isShowMajorFlowModal(true)}
              >
                新建
              </Button>
            ]}
          />
        </ProCard>

        {
          // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
          !isMajorFlowModalVisible ? (
            ''
          ) : (
            <PreChooseRole
              isRoleModalVisible={isMajorFlowModalVisible}
              isShowRoleModal={isShowMajorFlowModal}
              flowDataSource={flowDataSource}
              setFlowList={setFlowList}
            />
          )
        }
      </ProCard>
    </PageContainer>
  );
};
export default Applications;
