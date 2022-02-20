export default [
  {
    path: '/user',
    layout: false,
    routes: [{
      path: '/user',
      routes: [{
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      }],
    },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/personalcenter',
    name: '个人中心',
    icon: 'user',
    access: 'hasRoute',
    routes: [
      {
        path: '/personalcenter',
        component: './Welcome',
      },
      {
        name: '待办任务',
        icon: 'profile',
        path: '/personalcenter/todo',
        component: './Welcome',
        access: 'hasRoute',
      },
      {
        name: '已办任务',
        icon: 'fileDone',
        path: '/personalcenter/done',
        component: './Welcome',
        access: 'hasRoute',
      },
      {
        name: '承揽方收藏',
        icon: 'bank',
        path: '/personalcenter/contractor',
        component: './contract/person/contractor',
        access: 'hasRoute',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/business',
    name: '业务设置',
    icon: 'setting',
    access: 'hasRoute',
    routes: [
      {
        path: '/business',
        component: './Welcome',
      },
      {
        name: '定作方管理',
        icon: 'team',
        path: '/business/sponsor',
        component: './contract/business/sponsor',
        access: 'hasRoute',
      },
      {
        name: '承揽方管理',
        icon: 'team',
        path: '/business/contractor',
        component: './contract/business/contractor',
        access: 'hasRoute',
      },
      {
        name: '专业管理',
        icon: 'team',
        path: '/business/major',
        component: './contract/business/major',
        access: 'hasRoute',
      },
      {
        name: '模板类型管理',
        icon: 'container',
        path: '/business/templateType',
        component: './contract/business/templateType',
        access: 'hasRoute',
      }, {
        name: '专业对应角色管理',
        icon: 'team',
        path: '/business/majorToRole',
        component: './contract/business/majorToRole',
        access: 'hasRoute',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/system',
    name: '系统设置',
    icon: 'setting',
    access: 'hasRoute',
    routes: [
      {
        path: '/system',
        component: './Welcome',
      },
      {
        name: '字典管理',
        icon: 'book',
        path: '/system/dictionary',
        component: './contract/common/dictionary',
        access: 'hasRoute',
      },
      {
        name: '人员管理',
        icon: 'team',
        path: '/system/person',
        component: './contract/common/person',
        access: 'hasRoute',
      },
      {
        name: '菜单管理',
        icon: 'bars',
        path: '/system/menu',
        component: './contract/common/menu',
        access: 'hasRoute',
      },
      {
        name: '岗位管理',
        icon: 'audit',
        path: '/system/post',
        component: './contract/common/post',
        access: 'hasRoute',
      },
      {
        name: '角色管理',
        icon: 'user',
        path: '/system/role',
        component: './contract/common/role',
        access: 'hasRoute',
      },
      {
        name: '组织机构管理',
        icon: 'team',
        path: '/system/dept',
        component: './contract/common/dept',
        access: 'hasRoute',
      },
      {
        name: '日志管理',
        icon: 'container',
        path: '/system/log',
        access: 'hasRoute',
        routes: [
          {
            name: '操作日志',
            icon: 'container',
            path: '/system/log/operlog',
            access: 'hasRoute',
            component: './contract/common/log',
          },
          {
            component: './404',
          },
        ],
      },
      {
        name: '机构人员岗位管理',
        icon: 'user',
        path: '/system/personToPost',
        component: './contract/common/personToPost',
        access: 'hasRoute',
      },
      {
        name: '机构人员角色管理',
        icon: 'user',
        path: '/system/perToRole',
        component: './contract/common/perToRole',
        access: 'hasRoute',
      },
      {
        name: '机构人员菜单管理',
        icon: 'user',
        path: '/system/personToMenu',
        component: './contract/common/personToMenu',
        access: 'hasRoute',
      },
      {
        name: '角色菜单管理',
        icon: 'user',
        path: '/system/roleToMenu',
        component: './contract/common/roleToMenu',
        access: 'hasRoute',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/personalcenter/todo',
  },
  {
    component: './404',
  },
];
