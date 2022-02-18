import React, {useEffect, useState} from 'react';
import {message} from 'antd';
import ProForm, {ModalForm, ProFormText,} from '@ant-design/pro-form';
import 'antd/dist/antd.min.css';
import {insertRole, loadRole, updateRole} from "@/services/contract/common/role";

const UpdateRole = (props: any) => {
  const {isModalVisible} = props; // 模态框是否显示
  const {isShowModal} = props; // 操作模态框显示隐藏的方法
  const {actionRef} = props; // 父组件传过来的表格的引用, 可以用来操作表格, 比如刷新表格
  const {roleId} = props; // 要编辑的ID, 添加的时候是undefined, 只有编辑才有
  const [role, setRole] = useState(undefined);// 将表单初始化的值设置成状态, 在编辑的时候, 使用这个状态
  const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单

  //修改时初始化数据
  const initRole = async () => {
    const response = await loadRole({I_ID: roleId});
    const roleData = response.data;

    setRole({...response.data});
    Object.keys(roleData);
    Object.values(roleData);
    Object.keys(roleData).forEach(key => formObj.setFieldsValue({[`${key}`]: roleData[key]}));
  };

  //初始化
  useEffect(() => {
    if (roleId !== undefined) {
      initRole();
    }
  }, []);

  //form表单提交
  const handleSubmit = async (fields: any) => {
    const hide = message.loading('处理中...');
    let response = [];
    // 对提交后端数据处理
    const newFields = {};
    Object.assign(newFields, fields);
    if (role === undefined) {
      response = await insertRole({...newFields});
    } else {
      response = await updateRole({I_ID: (role as any).I_ID, ...newFields});
    }
    hide();
    if (response && response.success) {
      message.success("操作成功");
    } else {
      return false;
    }
    return true;
  };

  return (
    <ModalForm
      form={formObj} //const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单
      title={(role !== undefined ? "修改" : "新增")}
      width="800px"
      labelAlign={"right"} //文本框前面名称的位置
      visible={isModalVisible} //显示或隐藏
      onVisibleChange={isShowModal} //设置显示或隐藏
      onFinish={async (value) => { //表单提交 value表单中的值
        const success = await handleSubmit(value);
        if (success) {
          isShowModal(false);
          if (actionRef.current) {
            actionRef.current.reload();  //提交后刷新Protable
          }
        }
      }}
    >
      <ProForm.Group>
        <ProFormText
          label="角色编码"
          width="lg"
          name="V_ORLECODE"
          readonly={(role !== undefined)}
          rules={[
            {
              required: true,
              message: '角色编码为必填项'
            }
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          label="角色名称"
          width="lg"
          name="V_ORLENAME"
          rules={[
            {
              required: true,
              message: '角色名称为必填项'
            }
          ]}
        />
      </ProForm.Group>
    </ModalForm>
  );
};
export default UpdateRole;
