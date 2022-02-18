import React, {useEffect, useState} from 'react';
import {message} from 'antd';
import ProForm, {ModalForm, ProFormDigit, ProFormText,} from '@ant-design/pro-form';
import 'antd/dist/antd.min.css';
import {insertDictionary, loadDictionary, updateDictionary} from "@/services/contract/common/dictionary";

const UpdateDictionary = (props: any) => {
  const {isModalVisible} = props; // 模态框是否显示
  const {isShowModal} = props; // 操作模态框显示隐藏的方法
  const {actionRef} = props; // 父组件传过来的表格的引用, 可以用来操作表格, 比如刷新表格
  const {dictionaryId} = props; // 要编辑的ID, 添加的时候是undefined, 只有编辑才有
  const [dictionary, setDictionary] = useState(undefined);// 将表单初始化的值设置成状态, 在编辑的时候, 使用这个状态
  const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单

  //修改时初始化数据
  const initDictionary = async () => {
    const response = await loadDictionary({I_ID: dictionaryId});
    const dictionaryData = response.data;

    setDictionary({...response.data});
    Object.keys(dictionaryData);
    Object.values(dictionaryData);
    Object.keys(dictionaryData).forEach(key => formObj.setFieldsValue({[`${key}`]: dictionaryData[key]}));
  };

  //初始化
  useEffect(() => {
    if (dictionaryId !== undefined) {
      initDictionary();
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
    if (dictionary === undefined) {
      response = await insertDictionary({...newFields});
    } else {
      response = await updateDictionary({I_ID: (dictionary as any).I_ID, ...newFields});
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
      title={(dictionary !== undefined ? "修改" : "新增")} //加载数据给dictionary赋值，判断是否是新增/修改
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
          label="编码"
          width="lg"
          name="V_CODE"
          rules={[
            {
              required: true,
              message: '编码为必填项'
            }
          ]}
        />
        <ProFormText
          label="名称"
          width="lg"
          name="V_NAME"
          rules={[
            {
              required: true,
              message: '名称为必填项'
            }
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          label="排序"
          width="lg"
          name="I_ORDER"
          min={1}
          //max={99999}
          fieldProps={{precision: 0}}// 小数位数
          rules={[
            {
              required: false,
              message: '排序为必填项'
            }
          ]}
        />
        <ProFormText
          label="字典分类"
          width="lg"
          name="V_DICTIONARYTYPE"
          rules={[
            {
              required: true,
              message: '字典分类为必填项'
            }
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          label="特殊用途标记"
          width="lg"
          name="V_OTHER"
          rules={[
            {
              required: false,
              message: '特殊用途标记为必填项'
            }
          ]}
        />
      </ProForm.Group>
    </ModalForm>
  );
};
export default UpdateDictionary;
