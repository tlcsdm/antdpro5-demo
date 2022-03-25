import React, {useEffect, useState} from 'react';
import {message} from 'antd';
import ProForm, {ModalForm,} from '@ant-design/pro-form';
import 'antd/dist/antd.min.css';
import {updateAppointToStampBatch} from "@/services/contract/business/contractStamp";
import ProFormDateTimePicker from "@ant-design/pro-form/lib/components/DateTimePicker";

const ConfirmStampDate = (props: any) => {
  const {isModaConfirmStampDateVisible, isShowConfirmStampDateModal, actionRef, stampIdList, appointDate} = props;
  const [idList, setIdList] = useState(undefined);
  const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单


  //初始化
  useEffect(() => {
    formObj.setFieldsValue({['V_APPOINTDATE']: appointDate});
    setIdList(stampIdList);
  }, []);

  //form表单提交
  const handleSubmit = async (fields: any) => {
    const hide = message.loading('处理中...');
    let response = [];
    // 对提交后端数据处理
    const newFields = {};
    Object.assign(newFields, fields);
    newFields['I_IDLIST'] = idList;
    newFields['V_STAMPSTATUS'] = 2;
    response = await updateAppointToStampBatch({...newFields});
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
      title={"预约签章日期"}
      width="800px"
      labelAlign={"right"} //文本框前面名称的位置
      visible={isModaConfirmStampDateVisible} //显示或隐藏
      onVisibleChange={isShowConfirmStampDateModal} //设置显示或隐藏
      onFinish={async (value) => { //表单提交 value表单中的值
        const success = await handleSubmit(value);
        if (success) {
          isShowConfirmStampDateModal(false);
          if (actionRef.current) {
            actionRef.current.reload();  //提交后刷新Protable
          }
        }
      }}
    >
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
    </ModalForm>
  );
};
export default ConfirmStampDate;
