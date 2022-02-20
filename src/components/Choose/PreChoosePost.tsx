import React, {useEffect, useState} from 'react';
import {Button, Drawer, Space, Spin, Tree} from 'antd';
import {selectPostTree} from "@/services/contract/common/post";

const PreChoosePost = (props: any) => {
  const {isUserPostModalVisible, isShowUserPostModal, postDataSource, setPostList} = props;
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);

  // @ts-ignore
  useEffect(async () => {
    const rep = await selectPostTree({});
    setTreeData(postTree(rep.data));
  }, []);

  const postTree = (postTreeData: any) => {
    return postTreeData.map((item: any) => ({
      key: item.V_POSTCODE,
      title: item.V_POSTNAME,
      disabled: judge(item.V_POSTCODE) || item.V_POSTCODE_UP === '-1',
      children: item.children ? postTree(item.children) : [],
    }));
  };

  //判断用户已有岗位，在树中禁选
  const judge = (code: any) => {
    if (!postDataSource) return false;
    let status = false;
    for (let i = 0; i < postDataSource.length; i++) {
      if (postDataSource[i].V_POSTCODE == code) {
        return true;
      }
    }
    return status;
  };

  //保存
  const handleSubmit = async (checkedKeys: any) => {
    setPostList(checkedKeys);
    isShowUserPostModal(false);
  };

  return (
    <Drawer
      title={'选择岗位'}
      visible={isUserPostModalVisible} //设置显示或隐藏
      onClose={() => isShowUserPostModal(false)} //取消/关闭触发
      width={446}
      destroyOnClose={true} //关闭时销毁 Modal 里的子元素
      footer={
        <Space>
          <Button onClick={() => isShowUserPostModal(false)}>取消</Button>
          <Button type="primary" onClick={() => handleSubmit(checkedKeys)}>
            保存
          </Button>
        </Space>
      }
    >
      <div style={{padding: 4}}>
        {
          treeData.length == 0 ? (
            <div style={{paddingTop: 60, paddingLeft: 300}}>
              <Spin/> {/*加载框*/}
            </div>
          ) : (
            <Tree
              treeData={treeData} //树的数据
              checkable={true}
              checkedKeys={checkedKeys}
              defaultExpandAll
              checkStrictly
              showLine={true} //文件目录结构展示，true树带线，false树不带线
              onCheck={(checkedKeys: any, e: any) => {
                // @ts-ignore
                setCheckedKeys(checkedKeys.checked.length === 0 ? [] : [checkedKeys.checked[checkedKeys.checked.length - 1]]);
              }}
              height={700}
            />
          )
        }
      </div>
    </Drawer>
  );
};

export default PreChoosePost;
