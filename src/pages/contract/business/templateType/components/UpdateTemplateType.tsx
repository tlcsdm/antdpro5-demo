import React, {useEffect, useState} from 'react';
import {message} from 'antd';
import ProForm, {ModalForm, ProFormDigit, ProFormText,} from '@ant-design/pro-form';
import 'antd/dist/antd.min.css';
import {insertTemplateType, loadTemplateType, updateTemplateType} from "@/services/contract/business/templateType";

const UpdateTemplateType = (props: any) => {
  const {isModalVisible} = props; // 模态框是否显示
  const {isShowModal} = props; // 操作模态框显示隐藏的方法
  const {actionRef} = props; // 父组件传过来的表格的引用, 可以用来操作表格, 比如刷新表格
  const {templateTypeId} = props; // 要编辑的ID, 添加的时候是undefined, 只有编辑才有
  const [templateType, setTemplateType] = useState(undefined);// 将表单初始化的值设置成状态, 在编辑的时候, 使用这个状态
  const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单

  //修改时初始化数据
  const initTemplateType = async () => {
    const response = await loadTemplateType({I_ID: templateTypeId});
    const templateTypeData = response.data;

    setTemplateType({...response.data});
    Object.keys(templateTypeData);
    Object.values(templateTypeData);
    Object.keys(templateTypeData).forEach(key => formObj.setFieldsValue({[`${key}`]: templateTypeData[key]}));
  };

  //初始化
  useEffect(() => {
    if (templateTypeId !== undefined) {
      initTemplateType();
    } else {
      formObj.setFieldsValue({I_ORDER: 1});
    }
  }, []);

  //form表单提交
  const handleSubmit = async (fields: any) => {
    const hide = message.loading('处理中...');
    let response = [];
    // 对提交后端数据处理
    const newFields = {};
    Object.assign(newFields, fields);
    if (templateType === undefined) {
      response = await insertTemplateType({...newFields});
    } else {
      response = await updateTemplateType({I_ID: (templateType as any).I_ID, ...newFields});
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
      title={(templateType !== undefined ? "修改" : "新增")} //加载数据给Contractor赋值，判断是否是新增/修改
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
          label="模版类型编码"
          width="lg"
          name="V_CODE"
          rules={[
            {
              required: false,
              message: '模版类型编码为必填项'
            }
          ]}
        />
        <ProFormText
          label="模版类型名称"
          width="lg"
          name="V_NAME"
          rules={[
            {
              required: true,
              message: '模版类型名称为必填项'
            }
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          label="合同号"
          width="lg"
          name="I_CONNUMBER"
          rules={[
            {
              required: false,
              message: '合同号为必填项'
            }
          ]}
        />
        <ProFormDigit
          name="I_ORDER"
          width="lg"
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
      </ProForm.Group>
    </ModalForm>
  );
};
export default UpdateTemplateType;
