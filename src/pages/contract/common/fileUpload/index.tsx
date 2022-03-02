import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import 'moment/locale/zh-cn'
import ProForm, {
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton
} from "@ant-design/pro-form";
import {selectDictionary} from "@/services/contract/common/dictionary";
import {Col, message, Row, Space} from "antd";
import request from "umi-request";
import Cookies from "js-cookie";

const Applications: React.FC = () => {
  const [fileList, setFileList] = useState([]);  //附件
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {

  }, []);

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

  return (
    // 布局标签
    <PageContainer title={false} ghost>
      <ProForm
        layout={'horizontal'}
        formRef={formRef}
        labelCol={{span: 4}}
        wrapperCol={{span: 14}}
        submitter={{
          render: (props, doms) => {
            return (
              <Row>
                <Col span={14} offset={4}>
                  <Space>{doms}</Space>
                </Col>
              </Row>
            );
          },
        }}
        onFinish={async (value) => { //表单提交 value表单中的值
          const formData = new FormData();
          fileList.forEach(file => {
            // @ts-ignore
            formData.append('multipartFiles', file.originFileObj);//文件
          });
          formData.append('V_FILETYPE', value.V_FILETYPE); //文件类型
          formData.append('V_TOPIC', value.V_TOPIC); //文件主题
          formData.append('V_DESC', value.V_DESC == undefined ? '' : value.V_DESC); //文件描述
          formData.append('V_PERCODE', (Cookies as any).get('V_PERCODE')); //最后修改人
          const resp = request('/api/contract-system/insertSystemRider', {
            method: 'post',
            processData: false,
            data: formData,
          });
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
        }}
      >
        <ProFormSelect
          width="md"
          name="V_FILETYPE"
          label="文件类型"
          allowClear={false}
          request={async () => {
            const response = await selectDictionary({
              V_DICTIONARYTYPE: '文件类型'
            });
            return (response.data as any).map((item: any) => ({
              value: item.V_CODE,
              label: item.V_NAME
            }));
          }}
          rules={[{
            required: true,
            message: '文件类型为必填项'
          }]}
        />
        <ProFormText
          width="md"
          name="V_TOPIC"
          label="文件主题"
          rules={[{
            required: true,
            message: '文件主题为必填项'
          }]}
        />
        <ProFormUploadButton
          {...fileProps}
          label="上传附件"
          title="上传文件"
          getValueFromEvent={normFile}
          fieldProps={{multiple: true}}
          rules={[{
            required: true,
            message: '请选择文件'
          }]}
        />
        <ProFormTextArea
          name='V_DESC'
          label="文件描述"
          width="md"
        />
      </ProForm>
    </PageContainer>
  );
};

export default Applications;
