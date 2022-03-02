import React, {useEffect, useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import 'moment/locale/zh-cn'
import ProForm, {ProFormInstance, ProFormText} from "@ant-design/pro-form";
import {Col, message, Row, Space} from "antd";
import styles from "@/pages/user/Login/index.less";
import {LockOutlined} from "@ant-design/icons/lib";
import sha256 from 'crypto-js/sha256';
import {updatePersonPassWord} from "@/services/contract/common/person";

const Applications: React.FC = () => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {

  }, []);

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
        onFinish={async (values) => { //表单提交 value表单中的值
          const req = await updatePersonPassWord({
            V_OLDPASSWORD: sha256(values.old_password).toString(),
            V_NEWPASSWORD: sha256(values.new_password).toString()
          });
          if (req && req.success) {
            message.success('修改密码成功');
          }
        }}
      >
        <ProFormText.Password
          width="md"
          name="old_password"
          label="旧密码"
          fieldProps={{
            prefix: <LockOutlined className={styles.prefixIcon}/>,
          }}
          placeholder={'请输入旧密码'}
          rules={[
            {
              required: true,
              message: '请输入旧密码！'
            },
          ]}
        />
        <ProFormText.Password
          width="md"
          name="new_password"
          dependencies={['old_password']}
          label="新密码"
          fieldProps={{
            prefix: <LockOutlined className={styles.prefixIcon}/>,
          }}
          placeholder={'请输入新密码'}
          rules={[
            {
              required: true,
              message: '请输入新密码！'
            },
            ({getFieldValue}) => ({
              validator(_, value) {
                if (!value || getFieldValue('old_password') !== value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('新旧密码一样, 请修改新密码'));
              },
            }),
          ]}
        />
        <ProFormText.Password
          width="md"
          name="review_password"
          dependencies={['new_password']}
          label="确认密码"
          fieldProps={{
            prefix: <LockOutlined className={styles.prefixIcon}/>,
          }}
          placeholder={'请输入确认密码'}
          rules={[
            {
              required: true,
              message: '请输入确认密码！'
            },
            ({getFieldValue}) => ({
              validator(_, value) {
                if (!value || getFieldValue('new_password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('您输入的两个密码不匹配！'));
              },
            }),
          ]}
        />
      </ProForm>
    </PageContainer>
  );
};

export default Applications;
