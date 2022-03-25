export async function queryProjectNotice() {
  // return request('/api/project/notice');
  return [
    {
      id: 'xxx1',
      title: '情况通报',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
      description: '2021年1月份设备考核明细',
      updatedAt: '2021-02-24T00:20:54.426Z',
      member: '生产日报',
      href: '',
      memberLink: '',
    },
    {
      id: 'xxx2',
      title: '会议纪要',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
      description: '会议纪要202023 工程设备保障部[2020]105号',
      updatedAt: '2017-07-24T00:00:00.000Z',
      member: '财务报表',
      href: '',
      memberLink: '',
    },
    {
      id: 'xxx3',
      title: '重点工作',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
      description: '关于检修安全管理工作的几点要求',
      updatedAt: '2021-02-24T00:20:54.426Z',
      member: '预算报表',
      href: '',
      memberLink: '',
    },
    {
      id: 'xxx4',
      title: '定修管理',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
      description: '矿业公司2021年2月第3周设备检修计划',
      updatedAt: '2017-07-23T00:00:00.000Z',
      member: '合同报表',
      href: '',
      memberLink: '',
    },
    {
      id: 'xxx5',
      title: '维修工程',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
      description: '2021.2.19维修计划放行明细已放行项目',
      updatedAt: '2017-07-23T00:00:00.000Z',
      member: '物资报表',
      href: '',
      memberLink: '',
    },
    {
      id: 'xxx6',
      title: '规章制度',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png',
      description: '设备专项考核2020年166号',
      updatedAt: '2017-07-23T00:00:00.000Z',
      member: 'EAM报表',
      href: '',
      memberLink: '',
    },
  ];
}

export async function queryActivities() {
  // return request('/api/activities');
  return [
    {
      id: 'trend-1',
      updatedAt: '2021-02-24T00:20:54.426Z',
      user: {
        name: '曲丽丽',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      },
      group: { name: '高逼格设计天团', link: 'http://github.com/' },
      project: { name: '六月迭代', link: 'http://github.com/' },
      template: '在 @{group} 新建项目 @{project}',
    },
    {
      id: 'trend-2',
      updatedAt: '2021-02-24T00:20:54.426Z',
      user: {
        name: '付小小',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
      },
      group: { name: '高逼格设计天团', link: 'http://github.com/' },
      project: { name: '六月迭代', link: 'http://github.com/' },
      template: '在 @{group} 新建项目 @{project}',
    },
    {
      id: 'trend-3',
      updatedAt: '2021-02-24T00:20:54.426Z',
      user: {
        name: '林东东',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
      },
      group: { name: '中二少女团', link: 'http://github.com/' },
      project: { name: '六月迭代', link: 'http://github.com/' },
      template: '在 @{group} 新建项目 @{project}',
    },
    {
      id: 'trend-4',
      updatedAt: '2021-02-24T00:20:54.426Z',
      user: {
        name: '周星星',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
      },
      project: { name: '5 月日常迭代', link: 'http://github.com/' },
      template: '将 @{project} 更新至已发布状态',
    },
    {
      id: 'trend-5',
      updatedAt: '2021-02-24T00:20:54.426Z',
      user: {
        name: '朱偏右',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
      },
      project: { name: '工程效能', link: 'http://github.com/' },
      comment: { name: '留言', link: 'http://github.com/' },
      template: '在 @{project} 发布了 @{comment}',
    },
    {
      id: 'trend-6',
      updatedAt: '2021-02-24T00:20:54.426Z',
      user: {
        name: '乐哥',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
      },
      group: { name: '程序员日常', link: 'http://github.com/' },
      project: { name: '品牌迭代', link: 'http://github.com/' },
      template: '在 @{group} 新建项目 @{project}',
    },
  ];
}

export async function fakeChartData() {
  // return request('/api/fake_chart_data');
  return {
    visitData: [
      { x: '2021-02-24', y: 7 },
      { x: '2021-02-25', y: 5 },
      {
        x: '2021-02-26',
        y: 4,
      },
      { x: '2021-02-27', y: 2 },
      { x: '2021-02-28', y: 4 },
      { x: '2021-03-01', y: 7 },
      {
        x: '2021-03-02',
        y: 5,
      },
      { x: '2021-03-03', y: 6 },
      { x: '2021-03-04', y: 5 },
      { x: '2021-03-05', y: 9 },
      {
        x: '2021-03-06',
        y: 6,
      },
      { x: '2021-03-07', y: 3 },
      { x: '2021-03-08', y: 1 },
      { x: '2021-03-09', y: 5 },
      {
        x: '2021-03-10',
        y: 3,
      },
      { x: '2021-03-11', y: 6 },
      { x: '2021-03-12', y: 5 },
    ],
    visitData2: [
      { x: '2021-02-24', y: 1 },
      { x: '2021-02-25', y: 6 },
      {
        x: '2021-02-26',
        y: 4,
      },
      { x: '2021-02-27', y: 8 },
      { x: '2021-02-28', y: 3 },
      { x: '2021-03-01', y: 7 },
      {
        x: '2021-03-02',
        y: 2,
      },
    ],
    salesData: [
      { x: '1月', y: 852 },
      { x: '2月', y: 770 },
      { x: '3月', y: 1098 },
      {
        x: '4月',
        y: 919,
      },
      { x: '5月', y: 584 },
      { x: '6月', y: 1068 },
      { x: '7月', y: 398 },
      { x: '8月', y: 516 },
      {
        x: '9月',
        y: 1028,
      },
      { x: '10月', y: 1084 },
      { x: '11月', y: 887 },
      { x: '12月', y: 1087 },
    ],
    searchData: [
      { index: 1, keyword: '搜索关键词-0', count: 851, range: 60, status: 1 },
      {
        index: 2,
        keyword: '搜索关键词-1',
        count: 560,
        range: 70,
        status: 0,
      },
      { index: 3, keyword: '搜索关键词-2', count: 742, range: 37, status: 0 },
      {
        index: 4,
        keyword: '搜索关键词-3',
        count: 500,
        range: 57,
        status: 1,
      },
      { index: 5, keyword: '搜索关键词-4', count: 388, range: 75, status: 1 },
      {
        index: 6,
        keyword: '搜索关键词-5',
        count: 782,
        range: 71,
        status: 1,
      },
      { index: 7, keyword: '搜索关键词-6', count: 209, range: 84, status: 1 },
      {
        index: 8,
        keyword: '搜索关键词-7',
        count: 169,
        range: 14,
        status: 1,
      },
      { index: 9, keyword: '搜索关键词-8', count: 452, range: 55, status: 1 },
      {
        index: 10,
        keyword: '搜索关键词-9',
        count: 16,
        range: 50,
        status: 0,
      },
      { index: 11, keyword: '搜索关键词-10', count: 399, range: 63, status: 1 },
      {
        index: 12,
        keyword: '搜索关键词-11',
        count: 976,
        range: 28,
        status: 1,
      },
      { index: 13, keyword: '搜索关键词-12', count: 419, range: 23, status: 1 },
      {
        index: 14,
        keyword: '搜索关键词-13',
        count: 921,
        range: 60,
        status: 1,
      },
      { index: 15, keyword: '搜索关键词-14', count: 799, range: 93, status: 0 },
      {
        index: 16,
        keyword: '搜索关键词-15',
        count: 107,
        range: 3,
        status: 0,
      },
      { index: 17, keyword: '搜索关键词-16', count: 170, range: 41, status: 0 },
      {
        index: 18,
        keyword: '搜索关键词-17',
        count: 367,
        range: 16,
        status: 1,
      },
      { index: 19, keyword: '搜索关键词-18', count: 640, range: 94, status: 1 },
      {
        index: 20,
        keyword: '搜索关键词-19',
        count: 893,
        range: 81,
        status: 1,
      },
      { index: 21, keyword: '搜索关键词-20', count: 865, range: 36, status: 1 },
      {
        index: 22,
        keyword: '搜索关键词-21',
        count: 143,
        range: 55,
        status: 0,
      },
      { index: 23, keyword: '搜索关键词-22', count: 272, range: 98, status: 0 },
      {
        index: 24,
        keyword: '搜索关键词-23',
        count: 926,
        range: 88,
        status: 1,
      },
      { index: 25, keyword: '搜索关键词-24', count: 770, range: 69, status: 1 },
      {
        index: 26,
        keyword: '搜索关键词-25',
        count: 479,
        range: 87,
        status: 0,
      },
      { index: 27, keyword: '搜索关键词-26', count: 511, range: 45, status: 1 },
      {
        index: 28,
        keyword: '搜索关键词-27',
        count: 245,
        range: 69,
        status: 0,
      },
      { index: 29, keyword: '搜索关键词-28', count: 684, range: 22, status: 1 },
      {
        index: 30,
        keyword: '搜索关键词-29',
        count: 381,
        range: 38,
        status: 0,
      },
      { index: 31, keyword: '搜索关键词-30', count: 221, range: 27, status: 0 },
      {
        index: 32,
        keyword: '搜索关键词-31',
        count: 435,
        range: 60,
        status: 0,
      },
      { index: 33, keyword: '搜索关键词-32', count: 723, range: 74, status: 0 },
      {
        index: 34,
        keyword: '搜索关键词-33',
        count: 302,
        range: 61,
        status: 1,
      },
      { index: 35, keyword: '搜索关键词-34', count: 647, range: 30, status: 1 },
      {
        index: 36,
        keyword: '搜索关键词-35',
        count: 895,
        range: 26,
        status: 0,
      },
      { index: 37, keyword: '搜索关键词-36', count: 613, range: 33, status: 0 },
      {
        index: 38,
        keyword: '搜索关键词-37',
        count: 765,
        range: 92,
        status: 1,
      },
      { index: 39, keyword: '搜索关键词-38', count: 673, range: 30, status: 0 },
      {
        index: 40,
        keyword: '搜索关键词-39',
        count: 546,
        range: 18,
        status: 1,
      },
      { index: 41, keyword: '搜索关键词-40', count: 839, range: 37, status: 1 },
      {
        index: 42,
        keyword: '搜索关键词-41',
        count: 53,
        range: 62,
        status: 0,
      },
      { index: 43, keyword: '搜索关键词-42', count: 11, range: 21, status: 0 },
      {
        index: 44,
        keyword: '搜索关键词-43',
        count: 83,
        range: 60,
        status: 1,
      },
      { index: 45, keyword: '搜索关键词-44', count: 208, range: 60, status: 0 },
      {
        index: 46,
        keyword: '搜索关键词-45',
        count: 899,
        range: 91,
        status: 0,
      },
      { index: 47, keyword: '搜索关键词-46', count: 744, range: 35, status: 1 },
      {
        index: 48,
        keyword: '搜索关键词-47',
        count: 985,
        range: 7,
        status: 0,
      },
      { index: 49, keyword: '搜索关键词-48', count: 780, range: 78, status: 1 },
      {
        index: 50,
        keyword: '搜索关键词-49',
        count: 118,
        range: 81,
        status: 0,
      },
    ],
    offlineData: [
      { name: 'Stores 0', cvr: 0.1 },
      { name: 'Stores 1', cvr: 0.6 },
      {
        name: 'Stores 2',
        cvr: 0.1,
      },
      { name: 'Stores 3', cvr: 0.6 },
      { name: 'Stores 4', cvr: 0.6 },
      {
        name: 'Stores 5',
        cvr: 0.6,
      },
      { name: 'Stores 6', cvr: 0.5 },
      { name: 'Stores 7', cvr: 0.1 },
      {
        name: 'Stores 8',
        cvr: 0.5,
      },
      { name: 'Stores 9', cvr: 0.6 },
    ],
    offlineChartData: [
      { x: 1614126054426, y1: 103, y2: 67 },
      {
        x: 1614127854426,
        y1: 41,
        y2: 57,
      },
      { x: 1614129654426, y1: 58, y2: 58 },
      { x: 1614131454426, y1: 37, y2: 21 },
      {
        x: 1614133254426,
        y1: 47,
        y2: 72,
      },
      { x: 1614135054426, y1: 49, y2: 27 },
      { x: 1614136854426, y1: 39, y2: 77 },
      {
        x: 1614138654426,
        y1: 99,
        y2: 34,
      },
      { x: 1614140454426, y1: 40, y2: 41 },
      { x: 1614142254426, y1: 21, y2: 64 },
      {
        x: 1614144054426,
        y1: 56,
        y2: 39,
      },
      { x: 1614145854426, y1: 101, y2: 60 },
      { x: 1614147654426, y1: 64, y2: 11 },
      {
        x: 1614149454426,
        y1: 13,
        y2: 59,
      },
      { x: 1614151254426, y1: 70, y2: 102 },
      { x: 1614153054426, y1: 37, y2: 92 },
      {
        x: 1614154854426,
        y1: 102,
        y2: 13,
      },
      { x: 1614156654426, y1: 23, y2: 69 },
      { x: 1614158454426, y1: 33, y2: 52 },
      {
        x: 1614160254426,
        y1: 23,
        y2: 81,
      },
    ],
    salesTypeData: [
      { x: '家用电器', y: 4544 },
      { x: '食用酒水', y: 3321 },
      { x: '个护健康', y: 3113 },
      {
        x: '服饰箱包',
        y: 2341,
      },
      { x: '母婴产品', y: 1231 },
      { x: '其他', y: 1231 },
    ],
    salesTypeDataOnline: [
      { x: '家用电器', y: 244 },
      { x: '食用酒水', y: 321 },
      { x: '个护健康', y: 311 },
      {
        x: '服饰箱包',
        y: 41,
      },
      { x: '母婴产品', y: 121 },
      { x: '其他', y: 111 },
    ],
    salesTypeDataOffline: [
      { x: '家用电器', y: 99 },
      { x: '食用酒水', y: 188 },
      { x: '个护健康', y: 344 },
      {
        x: '服饰箱包',
        y: 255,
      },
      { x: '其他', y: 65 },
    ],
    radarData: [
      { name: '个人', label: '引用', value: 10 },
      { name: '个人', label: '口碑', value: 8 },
      {
        name: '个人',
        label: '产量',
        value: 4,
      },
      { name: '个人', label: '贡献', value: 5 },
      { name: '个人', label: '热度', value: 7 },
      {
        name: '团队',
        label: '引用',
        value: 3,
      },
      { name: '团队', label: '口碑', value: 9 },
      { name: '团队', label: '产量', value: 6 },
      {
        name: '团队',
        label: '贡献',
        value: 3,
      },
      { name: '团队', label: '热度', value: 1 },
      { name: '部门', label: '引用', value: 4 },
      {
        name: '部门',
        label: '口碑',
        value: 1,
      },
      { name: '部门', label: '产量', value: 6 },
      { name: '部门', label: '贡献', value: 5 },
      {
        name: '部门',
        label: '热度',
        value: 7,
      },
    ],
  };
}

export async function queryCurrent() {
  // return request('/api/currentUser');
  return {
    name: 'Serati Ma',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: 'antdesign@alipay.com',
    signature: '海纳百川，有容乃大',
    title: '交互专家',
    group: '蚂蚁集团－某某某事业群－某某平台部－某某技术部－UED',
    tags: [
      { key: '0', label: '很有想法的' },
      { key: '1', label: '专注设计' },
      { key: '2', label: '辣~' },
      {
        key: '3',
        label: '大长腿',
      },
      { key: '4', label: '川妹子' },
      { key: '5', label: '海纳百川' },
    ],
    notifyCount: 12,
    unreadCount: 11,
    country: 'China',
    geographic: {
      province: { label: '浙江省', key: '330000' },
      city: { label: '杭州市', key: '330100' },
    },
    address: '西湖区工专路 77 号',
    phone: '0752-268888888',
  };
}

