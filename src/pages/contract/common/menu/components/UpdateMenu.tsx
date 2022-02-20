import React, {useEffect, useState} from 'react';
import ProForm, {ProFormDigit, ProFormSelect, ProFormText} from '@ant-design/pro-form';
import {Drawer, message, Skeleton} from 'antd';
import {insertMenu, loadMenu, updateMenu} from '@/services/contract/common/menu';
import 'antd/dist/antd.min.css';
import {iconOpinion} from "@/utils/iconMap";

const UpdateMenu = (props: any) => {
  const [formObj] = ProForm.useForm();// 定义Form实例, 用来操作表单
  const {isMenuModalVisible,isShowMenuModal,editId,treeKey,title} = props;
  const type = editId == '' ? '新增' : '修改';
  const [initialValues, setInitialValues] = useState(undefined);
  // const [dataSource, setDataSource] = useState([]);

  // @ts-ignore
  useEffect(async () => {
    // const response = await selectDictionary({dictClassCode: '菜单类型'});
    // setDataSource(response.data.map((item: any) => ({
    //   key: item.dictCode,
    //   value: item.dictCode,
    //   label: item.dictName
    // })));
    if (editId != '') {
      const rep = await loadMenu({I_ID: editId});
      setInitialValues({...rep.data});
    } else {
      formObj.setFieldsValue({I_ORDER: 1});
      formObj.setFieldsValue({V_SYSTYPE: 'contract'});
    }
    formObj.setFieldsValue({menuSuperName: title});
  }, []);


  /**
   * 提交表单, 执行编辑或者添加
   *
   * @param values
   * @returns {Promise<void>}
   */
  const handleSubmit = async (values: any) => {
    let rep;
    if (editId == '') {
      rep = await insertMenu({...values, I_PID: treeKey});
    } else {
      rep = await updateMenu({...values, I_ID: editId});
    }

    if (rep && rep.success) {
      isShowMenuModal(false, true);
      message.success(`${type}成功`)
    }
  };

  return (
    <Drawer
      title={`${type}菜单`}
      visible={isMenuModalVisible} //设置显示或隐藏
      onClose={() => isShowMenuModal(false, false)} //取消/关闭触发
      width={746}
      destroyOnClose={true} //关闭时销毁 Modal 里的子元素
    >
      {
        // 只有是编辑的情况下, 并且要显示的数据还没有返回, 才显示骨架屏
        initialValues === undefined && editId !== '' ? (
          <Skeleton active={true} paragraph={{rows: 4}}/>
        ) : (
          <ProForm
            form={formObj}
            initialValues={initialValues}
            onFinish={(values) => handleSubmit(values)}
          >
            <ProFormText
              readonly={true}
              name="menuSuperName"
              label="父级菜单"
            />
            <ProFormText
              name="V_NAME"
              label="菜单名称"
              placeholder="请输入菜单名称"
              rules={[
                {
                  required: true,
                  message: '菜单名称为必填项'
                }
              ]}
            />
            <ProFormText
              name="V_ADDRESS"
              label="访问路径"
              placeholder="请输入访问路径"
              rules={[
                {
                  required: true,
                  message: '访问路径为必填项'
                }
              ]}
            />
            <ProFormSelect
              name="V_ADDRESS_ICO"
              label="菜单图标"
              placeholder="菜单图标"
              showSearch
              options={iconOpinion}
            />
            <ProFormText
              name="V_SYSTYPE"
              label="系统编码"
              placeholder="系统编码"
            />
            <ProFormDigit
              name="I_ORDER"
              label="显示顺序"
              min={1}
              //max={99999}
              fieldProps={{precision: 0}}// 小数位数
              rules={[
                {
                  required: false,
                  message: '显示顺序为必填项'
                }
              ]}
            />
            {/*<ProFormSelect*/}
            {/*  name="menuTypeCode"*/}
            {/*  label="菜单类型"*/}
            {/*  placeholder="请输入菜单类型"*/}
            {/*  options={dataSource}*/}
            {/*/>*/}
          </ProForm>
        )
      }
    </Drawer>
  );
};
export default UpdateMenu;
