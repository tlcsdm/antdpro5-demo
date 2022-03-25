import React, {useEffect} from 'react';
import ProForm, {ModalForm, ProFormText} from '@ant-design/pro-form';

const ResetPwd = (props: any) => {
  const {onSubmit, resetPwdModalVisible, onCancel} = props;
  const [form] = ProForm.useForm();
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      login_password: '',
      confirm_password: '',
    });
  });

  const checkPassword = (rule: any, value: string) => {
    const login_password = form.getFieldValue('password');
    if (value === login_password) {
      // 校验条件自定义
      return Promise.resolve();
    }
    return Promise.reject(new Error('两次密码输入不一致'));
  };

  return (
    <ModalForm
      width={640}
      title={'密码重置'}
      visible={resetPwdModalVisible}
      modalProps={{
        onCancel: onCancel
      }}
      form={form}
      labelAlign={"right"} //文本框前面名称的位置
      onFinish={async (value) => { //表单提交 value表单中的值
        onSubmit(value);
      }}
    >
      <ProFormText.Password
        width="xl"
        name="password"
        label="登录密码"
        rules={[
          {
            required: true,
            message: '登录密码不可为空。',
          },
        ]}
      />
      <ProFormText.Password
        width="xl"
        name="confirm_password"
        label="确认密码"
        rules={[
          {
            required: true,
            message: '确认密码',
          },
          {validator: checkPassword},
        ]}
      />
    </ModalForm>
  );
};

export default ResetPwd;
