import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Alert, message, Tabs} from 'antd';
import React, {useState} from 'react';
import {LoginForm, ProFormText} from '@ant-design/pro-form';
import {FormattedMessage, history, useModel} from 'umi';
import Footer from '@/components/Footer';
import sha256 from 'crypto-js/sha256';
import styles from './index.less';
import {ReadOutlined, WalletOutlined} from "@ant-design/icons/lib";
import {login} from "@/services/contract/common/login";
import Cookies from 'js-cookie'
import {selectPersonMenuTree} from "@/services/contract/common/menu";
import {setLocalStorage} from "@/utils/Storage";

const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const {setInitialState} = useModel('@@initialState');

  const fetchUserInfo = async (values: API.CurrentUser) => {
    const userInfo = values;
    const menuData = await selectPersonMenuTree({V_SYSTYPE: 'contract'});
    if (userInfo) {
      setLocalStorage("con_person", userInfo, 60 * 60 * 24 * 30);
      setLocalStorage("con_menu", menuData, 60 * 60 * 24);
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
        menuData: menuData.data,
        menuList: menuData.menuList
      }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      // @ts-ignore
      values.password = sha256(values.password).toString();
      const msg = await login({...values});
      if (msg && msg.success) {
        if (values.username != null) {
          localStorage.setItem('V_LOGINNAME', values.username);
        }
        message.success('登录成功！');
        Cookies.set('V_PERCODE', msg.data.V_PERCODE);
        await fetchUserInfo(msg.data);
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const {query} = history.location;
        const {redirect} = query as { redirect: string };
        history.push(redirect || '/');
        return;
      }
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
    }
  };
  const {success, message: msg, type: loginType} = userLoginState;

  return (
    <div className={styles.container}>
      {/*<div className={styles.lang} data-lang>*/}
      {/*  {SelectLang && <SelectLang/>}*/}
      {/*</div>*/}
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/favicon.ico"/>}
          title="鞍钢矿业合同管理系统"
          //subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          initialValues={{
            //autoLogin: true,
            //登录账号给上次登录账号
            username: localStorage.getItem('V_LOGINNAME') ? localStorage.getItem('V_LOGINNAME') : ''
          }}
          // actions={[
          //   <FormattedMessage
          //     key="loginWith"
          //     id="pages.login.loginWith"
          //     defaultMessage="其他登录方式"
          //   />,
          //   <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.icon} />,
          //   <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.icon} />,
          //   <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.icon} />,
          // ]}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab={'系统登录'}
            />
          </Tabs>

          {!success && loginType === 'account' && (
            <LoginMessage
              content={`${msg}`}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon}/>,
                }}
                placeholder={'用户名:'}
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!'
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon}/>,
                }}
                placeholder={'密码:'}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！'
                  },
                ]}
              />
            </>
          )}

          <div
            style={{
              marginBottom: 24,
            }}
          >
            {/*<ProFormCheckbox noStyle name="autoLogin">*/}
            {/*  <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录"/>*/}
            {/*</ProFormCheckbox>*/}
            <a
              style={{
                float: 'right'
              }}
              target="__blank"
              rel="noopener noreferrer"
            >
              <ReadOutlined/>
              <FormattedMessage id="pages.login.manual" defaultMessage="使用手册"/>
            </a>
            <a
              style={{
                float: 'right',
                paddingRight: '10px'
              }}
              target="__blank"
              rel="noopener noreferrer"
            >
              <WalletOutlined/>
              <FormattedMessage id="pages.login.changelog" defaultMessage="更新日志"/>
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer/>
    </div>
  );
};

export default Login;
