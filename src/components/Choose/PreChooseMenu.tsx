import React, {useEffect, useState} from 'react';
import {Button, Drawer, Space, Spin, Tree} from 'antd';
import {selectMenuTree} from '@/services/contract/common/menu';

const PreChooseMenu = (props: any) => {
  const {isMenuModalVisible, isShowMenuModal, setMenuList, menuDataSource} = props; // 模态框是否显示
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);

  // @ts-ignore
  useEffect(async () => {
    const rep = await selectMenuTree({});
    setTreeData(menuTree(rep.data));
  }, []);

  const menuTree = (menuTreeData: any) => {
    return menuTreeData.map((item: any) => ({
      key: item.I_ID,
      title: item.V_NAME,
      disabled: judge(item.I_ID),
      children: item.children ? menuTree(item.children) : [],
    }));
  };

  //判断用户已有岗位，在树中禁选
  const judge = (code: any) => {
    if (!menuDataSource) return false;
    let status = false;
    for (let i = 0; i < menuDataSource.length; i++) {
      if (menuDataSource[i].V_MENUCODE == code) {
        return true;
      }
    }
    return status;
  };

  //保存
  const handleSubmit = async (checkedKeys: any) => {
    setMenuList(checkedKeys);
    isShowMenuModal(false);
  };

  return (
    <Drawer
      title={`选择菜单`}
      visible={isMenuModalVisible} //设置显示或隐藏
      onClose={() => isShowMenuModal(false)} //取消/关闭触发
      width={500}
      destroyOnClose={true} //关闭时销毁 Modal 里的子元素
      footer={
        <Space>
          <Button onClick={() => isShowMenuModal(false)}>取消</Button>
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
              checkStrictly
              defaultExpandAll
              showLine={true} //文件目录结构展示，true树带线，false树不带线
              onCheck={(checkedKeys: any, e: any) => {
                setCheckedKeys(checkedKeys.checked);
              }}
              height={700}
            />
          )
        }
      </div>
    </Drawer>
  );
};

export default PreChooseMenu;
