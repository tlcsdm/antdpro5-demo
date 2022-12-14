// @ts-ignore
import {Settings as LayoutSettings} from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'xx合同系统',
  pwa: false,
  logo: '/favicon.ico',
  iconfontUrl: '',
  menu: {
    locale: false
  },
  headerHeight: 48,
  splitMenus: true
};

export default Settings;
