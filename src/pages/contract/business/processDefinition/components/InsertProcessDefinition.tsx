import React, {useEffect, useRef, useState} from 'react';
import {message} from 'antd';
import ProForm, {ModalForm, ProFormInstance, ProFormText,} from '@ant-design/pro-form';
import 'antd/dist/antd.min.css';
import ProFormUploadButton from "@ant-design/pro-form/lib/components/UploadButton";
import {insertProcessDefinition} from "@/services/contract/business/processDefinition";

const InsertProcessDefinition = (props: any) => {
  const {isModalVisible, isShowModal, actionRef} = props;
  const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单
  const [fileList, setFileList] = useState([]);  //附件
  const formRef = useRef<ProFormInstance>();

  //初始化
  useEffect(() => {
  }, []);

  //form表单提交
  const handleSubmit = async (fields: any) => {
    const formData = new FormData();
    fileList.forEach(file => {
      // @ts-ignore
      formData.append('multipartFiles', file.originFileObj);//文件
    });
    formData.append('category', fields.category); //文件类型
    const resp = insertProcessDefinition(formData);
    return resp.then((data: any) => {
      if (data.success) {
        message.success('上传成功');
        formRef.current?.resetFields();
        setFileList([]);
      } else {
        message.error('上传失败');
      }
      return data;
    });
  };

  //文件数据
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    setFileList(e.fileList);
    return e && e.fileList;
  };
  const fileProps = {
    name: 'multipartFiles',
    beforeUpload: () => {
      return false;
    },
  };

  return (
    <ModalForm
      form={formObj} //const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单
      title="新增"
      width="800px"
      formRef={formRef}
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
          label="流程类别"
          width="lg"
          name="category"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormUploadButton
          {...fileProps}
          label="流程定义文件"
          title="上传文件"
          getValueFromEvent={normFile}
          fieldProps={{multiple: true}}
          rules={[{
            required: true,
            message: '请选择文件'
          }]}
        />
      </ProForm.Group>
    </ModalForm>
  );
};
export default InsertProcessDefinition;
