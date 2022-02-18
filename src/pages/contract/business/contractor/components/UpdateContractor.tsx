import React, {useEffect, useState} from 'react';
import {message} from 'antd';
import ProForm, {ModalForm, ProFormMoney, ProFormSelect, ProFormText, ProFormTextArea,} from '@ant-design/pro-form';
import 'antd/dist/antd.min.css';
import {insertContractor, loadContractor, updateContractor} from "@/services/contract/business/contractor";
import {creditOpinion} from "@/utils/enum";

const UpdateContractor = (props: any) => {
  const {isModalVisible} = props; // 模态框是否显示
  const {isShowModal} = props; // 操作模态框显示隐藏的方法
  const {actionRef} = props; // 父组件传过来的表格的引用, 可以用来操作表格, 比如刷新表格
  const {contractorId} = props; // 要编辑的ID, 添加的时候是undefined, 只有编辑才有
  const [contractor, setContractor] = useState(undefined);// 将表单初始化的值设置成状态, 在编辑的时候, 使用这个状态
  const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单

  //修改时初始化数据
  const initContractor = async () => {
    const response = await loadContractor({I_ID: contractorId});
    const contractorData = response.data;

    setContractor({...response.data});
    Object.keys(contractorData);
    Object.values(contractorData);
    Object.keys(contractorData).forEach(key => formObj.setFieldsValue({[`${key}`]: contractorData[key]}));
  };

  //初始化
  useEffect(() => {
    if (contractorId !== undefined) {
      initContractor();
    } else {
      formObj.setFieldsValue({V_CREDIT: "暂未评价"});
    }
  }, []);

  //form表单提交
  const handleSubmit = async (fields: any) => {
    const hide = message.loading('处理中...');
    let response = [];
    // 对提交后端数据处理
    const newFields = {};
    Object.assign(newFields, fields);
    if (contractor === undefined) {
      response = await insertContractor({...newFields});
    } else {
      response = await updateContractor({I_ID: (contractor as any).I_ID, ...newFields});
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
      title={(contractor !== undefined ? "修改" : "新增")} //加载数据给Contractor赋值，判断是否是新增/修改
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
          label="承揽方名称"
          width="lg"
          name="V_NAME"
          rules={[
            {
              required: true,
              message: '承揽方名称为必填项'
            }
          ]}
        />
        <ProFormText
          label="地址"
          width="lg"
          name="V_ADDRESS"
          rules={[
            {
              required: false,
              message: '地址为必填项'
            }
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          label="法定代表人"
          width="lg"
          name="V_LEGAL"
          rules={[
            {
              required: false,
              message: '法定代表人为必填项'
            }
          ]}
        />
        <ProFormText
          label="委托代理人"
          width="lg"
          name="V_REPRESENTITIVE"
          rules={[
            {
              required: false,
              message: '委托代理人为必填项'
            }
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          label="联系电话"
          width="lg"
          name="V_PHONE"
          rules={[
            {
              required: false,
              message: '显示顺序为必填项'
            }
          ]}
        />
        <ProFormText
          label="开户银行"
          width="lg"
          name="V_BANK"
          rules={[
            {
              required: false,
              message: '开户银行为必填项'
            }
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          label="银行帐号"
          width="lg"
          name="V_ACCOUNT"
          rules={[
            {
              required: false,
              message: '银行帐号为必填项'
            }
          ]}
        />
        <ProFormText
          label="企业性质"
          width="lg"
          name="V_NATURE"
          rules={[
            {
              required: false,
              message: '企业性质为必填项'
            }
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormMoney
          label="注册资金(元)"
          width="lg"
          name="I_REGEREDCAPITAL"
          locale="zh-CN"
          min={0}
          fieldProps={{precision: 2}}// 小数位数
          rules={[
            {
              required: false,
              message: '注册资金(元)为必填项'
            }
          ]}
        />
        <ProFormTextArea
          label="经营许可"
          width="lg"
          name="V_LICENSE"
          rules={[
            {
              required: false,
              message: '经营许可为必填项'
            }
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          options={creditOpinion}
          width="lg"
          name="V_CREDIT"
          label="信用等级"
          rules={[
            {
              required: false,
              message: '信用等级为必填项'
            }
          ]}
        />
      </ProForm.Group>
    </ModalForm>
  );
};
export default UpdateContractor;
