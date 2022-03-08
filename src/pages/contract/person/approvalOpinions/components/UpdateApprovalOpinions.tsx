import React, {useEffect, useState} from 'react';
import {message} from 'antd';
import ProForm, {ModalForm, ProFormTextArea,} from '@ant-design/pro-form';
import 'antd/dist/antd.min.css';
import {
  insertApprovalOpinions,
  loadApprovalOpinions,
  updateApprovalOpinions
} from "@/services/contract/person/approvalOpinions";

const UpdateApprovalOpinions = (props: any) => {
  const {isModalVisible, isShowModal, actionRef, approvalOpinionsId} = props;
  const [approvalOpinions, setApprovalOpinions] = useState(undefined);// 将表单初始化的值设置成状态, 在编辑的时候, 使用这个状态
  const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单

  //修改时初始化数据
  const initApprovalOpinions = async () => {
    const response = await loadApprovalOpinions({I_ID: approvalOpinionsId});
    const approvalOpinionsData = response.data;
    setApprovalOpinions({...response.data});
    Object.keys(approvalOpinionsData).forEach(key => formObj.setFieldsValue({[`${key}`]: approvalOpinionsData[key]}));
  };

  //初始化
  useEffect(() => {
    if (approvalOpinionsId !== undefined) {
      initApprovalOpinions();
    } else {

    }
  }, []);

  //form表单提交
  const handleSubmit = async (fields: any) => {
    const hide = message.loading('处理中...');
    let response = [];
    // 对提交后端数据处理
    const newFields = {};
    Object.assign(newFields, fields);
    if (approvalOpinions === undefined) {
      response = await insertApprovalOpinions({...newFields});
    } else {
      response = await updateApprovalOpinions({I_ID: (approvalOpinions as any).I_ID, ...newFields});
    }
    hide();
    if (response.success) {
      message.success("操作成功");
    } else {
      return false;
    }
    return true;
  };

  return (
    <ModalForm
      form={formObj} //const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单
      title={(approvalOpinions !== undefined ? "修改" : "新增")} //加载数据给approvalOpinions赋值，判断是否是新增/修改
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
        <ProFormTextArea
          label="审批意见"
          width="lg"
          name="V_OPINIONS"
          allowClear
          rules={[
            {
              required: true,
              message: '审批意见为必填项'
            }
          ]}
        />
      </ProForm.Group>

    </ModalForm>
  );
};
export default UpdateApprovalOpinions;


