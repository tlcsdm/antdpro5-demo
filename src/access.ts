/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser | undefined, menuList: [] }) {
  const {menuList} = initialState || {};
  return {
    hasRoute: (route: any) => {
      // @ts-ignore
      return menuList?.includes(route.path);
    },
  };
}
