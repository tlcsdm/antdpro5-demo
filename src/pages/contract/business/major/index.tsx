import React, {useEffect, useRef, useState} from 'react';
import {Button, message, Popconfirm, Spin, Tree} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {selectDeptTree} from '@/services/contract/common/dept';
import ProCard from '@ant-design/pro-card';
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {PageContainer} from "@ant-design/pro-layout";
import {deleteMajor, insertMajorBatch, selectMajor} from "@/services/contract/business/major";
import PreChooseDictionaryMultiple from "@/components/Choose/PreChooseDictionaryMultiple";

const Applications: React.FC = () => {
  const [treeData, setTreeData] = useState([]);
  const [treeKey, setTreeKey] = useState('');
  const [majorDataSource, setMajorDataSource] = useState([]);
  const [dictionaryList, setDictionaryList] = useState([]);
  const [isMajorModalVisible, setIsMajorModalVisible] = useState(false);
  const actionRef = useRef<ActionType>();

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
      orgCode: item.V_DEPTCODE_UP,
    }));
  };

  //获取组织机构下的专业数据
  const getMajorTable = async (selectedKeys: any) => {
    const rep = await selectMajor({V_DEPTCODE: selectedKeys});
    setMajorDataSource(rep.data);
  };

  //选择的专业数据
  // @ts-ignore
  useEffect(async () => {
    // @ts-ignore
    if (dictionaryList && dictionaryList.length > 0) {
      const hide = message.loading('正在新增');
      let V_NAMELIST = [];
      for (let i = 0; i < dictionaryList.length; i++) {
        // @ts-ignore
        V_NAMELIST.push(dictionaryList[i].V_NAME);
      }
      const req = await insertMajorBatch({
        V_NAMELIST: V_NAMELIST.toString(),
        V_DEPTCODE: treeKey,
      });
      hide();
      if (req && req.success) {
        message.success('新增成功，即将刷新');
        getMajorTable(treeKey);
      }
    }
  }, [dictionaryList]);

  //删除专业
  const handleMajorDelete = async (id = undefined) => {
    if (!id) return true;
    const hide = message.loading('正在删除');
    const req = await deleteMajor({
      I_ID: id
    });
    hide();
    if (req && req.success) {
      message.success('删除成功，即将刷新');
      getMajorTable(treeKey);
    }
    return true;
  };

  /**
   * 控制模态框显示和隐藏
   */
  const isShowMajorModal = async (show: boolean | ((prevState: boolean) => boolean)) => {
    if (treeKey == '') {
      message.warn('请选择上级组织机构');
    } else {
      setIsMajorModalVisible(show);
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
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm key={record.I_ID} title="确认删除？" okText="确认" cancelText="取消" onConfirm={(e) => {
          handleMajorDelete(record.I_ID)
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
                    getMajorTable(selectedKeys[0]);
                  }}
                  height={500}
                />
              )
            }
          </div>
        </ProCard>

        <ProCard colSpan="80%" ghost>
          <ProTable
            columns={majorColumns}
            dataSource={majorDataSource}
            search={false}
            rowKey="I_ID"
            pagination={{  //设置分页 ，可设置为pagination={false}不加分页
              pageSize: 20,
              current: 1
            }}
            manualRequest={false} // 是否需要手动触发首次请求
            dateFormatter="string"
            headerTitle='专业列表'
            actionRef={actionRef} // 用于触发刷新操作等，看api
            toolBarRender={() => [
              <Button
                key="button"
                icon={<PlusOutlined/>}
                type="primary"
                onClick={() => isShowMajorModal(true)}
              >
                新建
              </Button>
            ]}
          />
        </ProCard>

        {
          // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
          !isMajorModalVisible ? (
            ''
          ) : (
            <PreChooseDictionaryMultiple
              isDictionaryModalVisible={isMajorModalVisible}
              isShowDictionaryModal={isShowMajorModal}
              setDictionaryList={setDictionaryList}
              dictionaryType={"合同专业"}
              dictDataSource={majorDataSource}
            />
          )
        }
      </ProCard>
    </PageContainer>
  );
};
export default Applications;
