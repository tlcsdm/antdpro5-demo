import React, {useEffect, useState} from 'react';
import {message} from 'antd';
import ProForm, {ModalForm, ProFormDigit, ProFormText,} from '@ant-design/pro-form';
import 'antd/dist/antd.min.css';
import {insertSponsor, loadSponsor, updateSponsor} from "@/services/contract/business/sponsor";

const UpdateSponsor = (props: any) => {
  const {isModalVisible, isShowModal, actionRef, sponsorId} = props;
  const [sponsor, setSponsor] = useState(undefined);// 将表单初始化的值设置成状态, 在编辑的时候, 使用这个状态
  const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单

  //修改时初始化数据
  const initSponsor = async () => {
    const response = await loadSponsor({I_ID: sponsorId});
    const sponsorData = response.data;
    setSponsor({...response.data});
    Object.keys(sponsorData).forEach(key => formObj.setFieldsValue({[`${key}`]: sponsorData[key]}));
  };

  //初始化
  useEffect(() => {
    if (sponsorId !== undefined) {
      initSponsor();
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
    if (sponsor === undefined) {
      response = await insertSponsor({...newFields});
    } else {
      response = await updateSponsor({I_ID: (sponsor as any).I_ID, ...newFields});
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
      title={(sponsor !== undefined ? "修改" : "新增")} //加载数据给sponsor赋值，判断是否是新增/修改
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
          label="定作方编码"
          width="lg"
          name="V_SPONSORCODE"
          rules={[
            {
              required: false,
              message: '定作方编码为必填项'
            }
          ]}
        />
        <ProFormText
          label="定作方名称"
          width="lg"
          name="V_SPONSORNAME"
          rules={[
            {
              required: true,
              message: '定作方名称为必填项'
            }
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          label="定作方法人"
          width="lg"
          name="V_OFFICER"
          rules={[
            {
              required: false,
              message: '定作方为必填项'
            }
          ]}
        />
        <ProFormText
          label="电话号码"
          width="lg"
          name="V_PHONE"
          rules={[
            {
              required: false,
              message: '电话号码为必填项'
            }
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          label="显示顺序"
          width="lg"
          name="I_ORDER"
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
export default UpdateSponsor;
