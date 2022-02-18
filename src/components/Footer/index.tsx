import {DefaultFooter} from '@ant-design/pro-layout';
import React from "react";

const Footer: React.FC = () => {
  const defaultMessage = 'Powered By 新安杰系统集成有限公司';
  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: '',
          title: '鞍钢集团矿业公司网站',
          href: 'http://www.ansteel.cn/',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
