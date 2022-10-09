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
          title: 'xx公司网站',
          href: 'https://www.tlcsdm.com',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
