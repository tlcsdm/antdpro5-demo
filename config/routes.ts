export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/personalcenter',
    name: '个人中心',
    icon: 'user',
    routes: [
      {
        path: '/',
        redirect: '/personalcenter/workplace',
      },
      {
        name: '个人中心',
        icon: 'smile',
        path: '/personalcenter/workplace',
        component: './Welcome',
      },
      {
        name: '待办任务',
        icon: 'smile',
        path: '/personalcenter/todo',
        component: './Welcome',
      },
      {
        name: '日程管理',
        icon: 'smile',
        path: '/personalcenter/schedule',
        component: './Welcome',
      },
      {
        name: '业务中心',
        icon: 'smile',
        path: '/personalcenter/business',
        component: './Welcome',
      },
      {
        name: '协同办公',
        icon: 'smile',
        path: '/personalcenter/cooperate',
        component: './Welcome',
      },
    ],
  },
  {
    path: '/system',
    name: '系统设置',
    icon: 'user',
    routes: [
      {
        path: '/',
        redirect: '/system/dictionary',
      },
      {
        name: '字典管理',
        icon: 'smile',
        path: '/system/dictionary',
        component: './contract/common/dictionary',
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
