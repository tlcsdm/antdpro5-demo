import React, {useEffect, useState} from 'react';
import {message} from 'antd';
import ProForm, {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import 'antd/dist/antd.min.css';
import {insertTemplate, loadTemplate, updateTemplate} from "@/services/contract/business/template";
import {selectTemplateType} from "@/services/contract/business/templateType";
import {yesNoEnum} from "@/utils/enum";

const UpdateTemplate = (props: any) => {
  const {isModalVisible, isShowModal, actionRef, templateId} = props;
  const [template, setTemplate] = useState(undefined);// 将表单初始化的值设置成状态, 在编辑的时候, 使用这个状态
  const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单
  const [fileList, setFileList] = useState([]);  //文件

  //修改时初始化数据
  const initTemplate = async () => {
    const response = await loadTemplate({I_ID: templateId});
    const templateData = response.data;
    setTemplate({...response.data});
    Object.keys(templateData).forEach(key => formObj.setFieldsValue({[`${key}`]: templateData[key]}));
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
    name: 'file',
    beforeUpload: () => {
      return false;
    },
  };

  //初始化
  useEffect(() => {
    if (templateId !== undefined) {
      initTemplate();
    }
  }, []);

  return (
    <ModalForm
      form={formObj} //const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单
      title={(template !== undefined ? "修改" : "新增")} //加载数据给template赋值，判断是否是新增/修改
      width="800px"
      layout={'horizontal'}
      labelCol={{style: {width: 150}}}
      wrapperCol={{span: 14}}
      labelAlign={"right"} //文本框前面名称的位置
      visible={isModalVisible} //显示或隐藏
      onVisibleChange={isShowModal} //设置显示或隐藏
      onFinish={async (value) => { //表单提交 value表单中的值
        const formData = new FormData();
        //为新增或修改是有文件的情况下
        if (template === undefined || fileList.length > 0) {
          // @ts-ignore
          formData.append('multipartFile', fileList[0].originFileObj);//文件
        }
        formData.append('V_NAME', value.V_NAME); //模板名称
        formData.append('V_DESCRIPTION', value.V_DESCRIPTION === undefined ? '' : value.V_DESCRIPTION); //模板描述
        formData.append('V_TYPEID', value.V_TYPEID); //模板类型
        formData.append('V_TEMPTYPE', value.V_TEMPTYPE); //是否集团模板
        let resp = [];
        if (template === undefined) {
          resp = await insertTemplate(formData);
        } else {
          formData.append('I_ID', (template as any).I_ID); //最后修改人
          resp = await updateTemplate(formData);
        }
        if (resp.success) {
          message.success('操作成功');
          isShowModal(false);
          if (actionRef.current) {
            actionRef.current.reload();  //提交后刷新Protable
          }
        } else {
          message.error('操作失败');
        }
      }}
    >
      <ProFormSelect
        label="模版类型"
        width="lg"
        name="V_TYPEID"
        allowClear={false}
        request={async () => {
          const response = await selectTemplateType({});
          return (response.data as any).map((item: any) => ({
            value: item.I_ID,
            label: item.V_NAME
          }));
        }}
        rules={[
          {
            required: true,
            message: '模版类型为必填项'
          }
        ]}
      />
      <ProFormText
        label="模版名称"
        width="lg"
        name="V_NAME"
        rules={[
          {
            required: true,
            message: '模版名称为必填项'
          }
        ]}
      />
      <ProFormUploadButton
        {...fileProps}
        label="上传新模板"
        title="选择文件"
        accept={'.doc,.docx'}
        extra="请选择doc或docs文件"
        getValueFromEvent={normFile}
        fieldProps={{maxCount: 1}}
        rules={[{
          required: template === undefined,
          message: '请选择模板文件'
        }]}
      />
      <ProFormSelect
        label="是否集团模版"
        width="lg"
        name="V_TEMPTYPE"
        valueEnum={yesNoEnum}
        rules={[
          {
            required: true,
            message: '是否集团模版为必填项'
          }
        ]}
      />
      <ProFormTextArea
        label="模版描述"
        width="lg"
        name="V_DESCRIPTION"
        rules={[
          {
            required: false,
            message: '模版描述为必填项'
          }
        ]}
      />
    </ModalForm>
  );
};
export default UpdateTemplate;


