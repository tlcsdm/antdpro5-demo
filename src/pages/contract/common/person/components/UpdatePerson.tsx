import React, {useEffect, useState} from 'react';
import {message} from 'antd';
import ProForm, {ModalForm, ProFormDigit, ProFormSelect, ProFormText,} from '@ant-design/pro-form';
import 'antd/dist/antd.min.css';
import {insertPerson, loadPerson, updatePerson} from "@/services/contract/common/person";
import {yesNoOpinion} from "@/utils/enum";

const UpdatePerson = (props: any) => {
  const {isModalVisible} = props; // 模态框是否显示
  const {isShowModal} = props; // 操作模态框显示隐藏的方法
  const {actionRef} = props; // 父组件传过来的表格的引用, 可以用来操作表格, 比如刷新表格
  const {personId} = props; // 要编辑的ID, 添加的时候是undefined, 只有编辑才有
  const [person, setPerson] = useState(undefined);// 将表单初始化的值设置成状态, 在编辑的时候, 使用这个状态
  const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单

  //修改时初始化数据
  const initPerson = async () => {
    const response = await loadPerson({I_ID: personId});
    const personData = response.data;
    setPerson({...response.data});
    Object.keys(personData);
    Object.values(personData);
    Object.keys(personData).forEach(key => formObj.setFieldsValue({[`${key}`]: personData[key]}));
  };

  //初始化
  useEffect(() => {
    if (personId !== undefined) {
      initPerson();
    } else {
      formObj.setFieldsValue({I_ORDER: 1});
      formObj.setFieldsValue({V_TOAM: '否'});
    }
  }, []);

  //form表单提交
  const handleSubmit = async (fields: any) => {
    const hide = message.loading('处理中...');
    let response = [];
    // 对提交后端数据处理
    const newFields = {};
    newFields['V_PERCODE_FORM'] = formObj.getFieldsValue(['V_PERCODE']).V_PERCODE;
    Object.assign(newFields, fields);
    if (person === undefined) {
      response = await insertPerson({...newFields});
    } else {
      response = await updatePerson({I_ID: (person as any).I_ID, ...newFields});
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
      title={(person !== undefined ? "修改" : "新增")} //加载数据给person赋值，判断是否是新增/修改
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
          label="人员编码"
          width="lg"
          name="V_PERCODE"
          rules={[
            {
              required: true,
              message: '人员编码为必填项'
            }
          ]}
        />
        <ProFormText
          label="人员姓名"
          width="lg"
          name="V_PERNAME"
          rules={[
            {
              required: true,
              message: '人员姓名为必填项'
            }
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          label="人员登陆名"
          width="lg"
          name="V_LOGINNAME"
          rules={[
            {
              required: true,
              message: '人员登陆名为必填项'
            }
          ]}
        />
        <ProFormText
          label="单位电话"
          width="lg"
          name="V_TEL"
          rules={[
            {
              required: false,
              message: '单位电话为必填项'
            }
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          label="联系电话"
          width="lg"
          name="V_LXDH_CLF"
          rules={[
            {
              required: false,
              message: '联系电话为必填项'
            }
          ]}
        />
        <ProFormText
          label="身份证号码"
          width="lg"
          name="V_SFZH"
          rules={[
            {
              required: false,
              message: '身份证号码为必填项'
            }
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          label="sap账号"
          width="lg"
          name="V_SAPPER"
          rules={[
            {
              required: false,
              message: 'sap账号为必填项'
            }
          ]}
        />
        <ProFormText
          label="员工号"
          width="lg"
          name="V_YGCODE"
          rules={[
            {
              required: false,
              message: '员工号为必填项'
            }
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          options={yesNoOpinion}
          width="lg"
          name="V_TOAM"
          label="是否接收即时通"
          rules={[
            {
              required: false,
              message: '是否接收即时通为必填项'
            }
          ]}
        />
        <ProFormText
          label="即时通号"
          width="lg"
          name="V_AM"
          rules={[
            {
              required: false,
              message: '即时通号为必填项'
            }
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          label="职级"
          width="lg"
          name="V_ZJ"
          rules={[
            {
              required: false,
              message: '职级为必填项'
            }
          ]}
        />
        <ProFormText
          label="职务"
          width="lg"
          name="V_ZW"
          rules={[
            {
              required: false,
              message: '职务为必填项'
            }
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          label="人员显示排序"
          width="lg"
          name="I_ORDER"
          min={1}
          //max={99999}
          fieldProps={{precision: 0}}// 小数位数
          rules={[
            {
              required: false,
              message: '人员显示排序为必填项'
            }
          ]}
        />
      </ProForm.Group>

    </ModalForm>
  );
};
export default UpdatePerson;


