import {PageContainer} from '@ant-design/pro-layout';
import React, {FC} from 'react';
import {history} from 'umi';
import {useModel} from "@@/plugin-model/useModel";

type SearchProps = {
  match: {
    url: string;
    path: string;
  };
  location: {
    pathname: string;
  };
};

const Search: FC<SearchProps> = (props) => {
  const {initialState} = useModel('@@initialState');
  const {menuList} = initialState || {};

  const getTabList = () => {
    const tabList = [];
    // @ts-ignore
    if (menuList && menuList?.includes(props.match.url + '/approval')) {
      tabList.push({
        key: 'approval',
        tab: '待审批的合同',
      })
    }
    // @ts-ignore
    if (menuList && menuList?.includes(props.match.url + '/revise')) {
      tabList.push({
        key: 'revise',
        tab: '待修订的合同',
      })
    }
    return tabList;
  };

  const handleTabChange = (key: string) => {
    const {match} = props;
    const url = match.url === '/' ? '' : match.url;
    switch (key) {
      case 'approval':
        history.push(`${url}/approval`);
        break;
      case 'revise':
        history.push(`${url}/revise`);
        break;
      default:
        break;
    }
  };

  const getTabKey = () => {
    const {match, location} = props;
    const url = match.path === '/' ? '' : match.path;
    const tabKey = location.pathname.replace(`${url}/`, '');
    if (tabKey && tabKey !== '/') {
      return tabKey;
    }
    return 'approval';
  };

  return (
    <PageContainer
      title={false}
      tabList={getTabList()}
      tabActiveKey={getTabKey()}
      onTabChange={handleTabChange}
      tabProps={{
        type: 'card'
      }}
    >
      {props.children}
    </PageContainer>
  );
};

export default Search;
