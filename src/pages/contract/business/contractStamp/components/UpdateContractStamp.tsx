import React, {useEffect, useState} from 'react';
import {message} from 'antd';
import ProForm, {ModalForm, ProFormText,} from '@ant-design/pro-form';
import 'antd/dist/antd.min.css';
import {useModel} from "@@/plugin-model/useModel";
import {insertAppointToStampBatch} from "@/services/contract/business/contractStamp";
import PreChooseStampToContract from "@/components/Choose/PreChooseStampToContract";
import ProFormDateTimePicker from "@ant-design/pro-form/lib/components/DateTimePicker";

const UpdateContractStamp = (props: any) => {
  const {isModalStampVisible, isShowStampModal, actionRef} = props;
  const [isContractModalVisible, setIsContractModalVisible] = useState(false);
  const [contractList, setContractList] = useState(undefined);
  const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单
  const {initialState} = useModel('@@initialState');

  const isShowContractModal = (show: boolean | ((prevState: boolean) => boolean)) => {
    setIsContractModalVisible(show);
  };

  //初始化
  useEffect(() => {
    formObj.setFieldsValue({['V_APPLICANT']: (initialState as any).currentUser.V_PERNAME});
  }, []);

  // @ts-ignore
  useEffect(async () => {
    if (contractList !== undefined) {
      formObj.setFieldsValue({
        V_CONTRACTIDLIST: contractList
      });
    }
  }, [contractList]);

  //form表单提交
  const handleSubmit = async (fields: any) => {
    const hide = message.loading('处理中...');
    let response = [];
    // 对提交后端数据处理
    const newFields = {};
    Object.assign(newFields, fields);
    response = await insertAppointToStampBatch({...newFields});
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
      title={"新增"}
      width="800px"
      labelAlign={"right"} //文本框前面名称的位置
      visible={isModalStampVisible} //显示或隐藏
      onVisibleChange={isShowStampModal} //设置显示或隐藏
      onFinish={async (value) => { //表单提交 value表单中的值
        const success = await handleSubmit(value);
        if (success) {
          isShowStampModal(false);
          if (actionRef.current) {
            actionRef.current.reload();  //提交后刷新Protable
          }
        }
      }}
    >
      <ProForm.Group>
        <ProFormText
          label="合同id"
          width="lg"
          name="V_CONTRACTIDLIST"
          disabled
          placeholder={'请选择'}
          rules={[
            {
              required: true,
              message: '合同id为必填项'
            }
          ]}
          addonAfter={<a onClick={() => isShowContractModal(true)}>选择</a>}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDateTimePicker
          label="预约盖章日期"
          width="lg"
          name="V_APPOINTDATE"
          rules={[
            {
              required: true,
              message: '预约盖章日期为必填项'
            }
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          label="预约人"
          width="lg"
          name="V_APPLICANT"
          disabled
          rules={[
            {
              required: true,
              message: '预约人为必填项'
            }
          ]}
        />
      </ProForm.Group>

      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isContractModalVisible ? (
          ''
        ) : (
          <PreChooseStampToContract
            isContractModalVisible={isContractModalVisible}
            isShowContractModal={isShowContractModal}
            setContractList={setContractList}
          />
        )
      }
    </ModalForm>
  );
};
export default UpdateContractStamp;
