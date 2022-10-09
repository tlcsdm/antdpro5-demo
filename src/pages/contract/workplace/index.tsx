import { Button ,Avatar, Card, Col, List, Skeleton, Row, Statistic, Tabs, Badge, Progress, Typography } from 'antd';
import React, { Component } from 'react';
import  { Dispatch} from 'umi';
import { Link, connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';
import  { ModalState } from './model';
import EditableLinkGroup from './components/EditableLinkGroup';
import styles from './style.less';
import { Table, Tag } from 'antd';
import  { ActivitiesType, CurrentUser, NoticeType, RadarDataType } from './data.d';
import {
  UnorderedListOutlined,
  FormOutlined,
  AuditOutlined,
  FieldTimeOutlined,
  DropboxOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  FacebookOutlined,
  LinkedinOutlined,
  FileTextOutlined,
  FileDoneOutlined,
  MoneyCollectOutlined,
  SettingOutlined,
  EditOutlined, CalendarOutlined,
} from '@ant-design/icons';

import logo_oa from '../../../assets/systemicons/公文管理系统.png';
import logo_eam from '../../../assets/systemicons/设备管理系统.png';
import logo_bi from '../../../assets/systemicons/财务共享中心.png';

const { Meta } = Card;
const { TabPane } = Tabs;

const data = [
  {
    title: '2021-02-25',
    description: '矿业公司3楼视频会议',
  },
  {
    title: '2021-02-26',
    description: '去齐大山铁矿调研工作',
  },
  {
    title: '2021-02-26',
    description: '参加中国钢铁金融衍生品国际大会',
  },
];
const dataflow = [
  {
    title: '工作内容',
    description: '工作目标、任务。计划应规定出在一定时间内所完成的目标',
  },
  {
    title: '工作方法',
    description: '采取措施、策略。要明确何时实现目标和完成任务',
  },
  {
    title: '工作分工',
    description: '工作负责。这是指执行计划的工作程序和时间安排',
  },
];

const data1 = [
  '2021年1月份设备考核明细',
  '工程设备保障部9月份考核明细',
  '工程设备保障部8月份考核明细',
];
const data2 = [
  '会议纪要202023 工程设备保障部',
  '会议纪要202022 工程设备保障部',
  '会议纪要202021 工程设备保障部',
];
const data3 = [
  '检修协力选矿工艺耐磨管道综合性能提升',
  '关于检修安全管理工作的几点要求',
  '关于做好检修和工程项目施工期间新冠肺',
];
const data4 = [
  '矿业公司2021年2月第4周设备检修计划',
  '矿业公司2021年2月第3周设备检修计划',
  '矿业公司2021年2月第2周设备检修计划',
];
const data5 = [
  '2021.2.19维修计划放行明细已放行项目',
  '2021.2.18维修计划放行明细已放行项目',
  '2021.2.9维修计划放行明细已放行项目',
];
const data6 = [
  '设备专项考核2020年166号',
  'xx有限公司固定资产投资项目',
  '2020年xx新修订公文',
];
const links = [
  {
    title: '常用链接1',
    href: './test',
  },
  {
    title: '常用链接2',
    href: '',
  },
  {
    title: '常用链接3',
    href: '',
  },
  {
    title: '常用链接4',
    href: '',
  },
  {
    title: '常用链接5',
    href: '',
  },
  {
    title: '常用链接6',
    href: '',
  },
];

const operationTabList2 = [
  {
    key: 'gw',
    tab: (
      <span>
        已订阅
      </span>
    ),
  },
  {
    key: 'ht',
    tab: (
      <span>
        可订阅
      </span>
    ),
  },
];

const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    width: 5,
    render: (text) => <Badge status="processing" />,
  },
  {
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: '',
    key: 'tags',
    dataIndex: 'tags',
    align: 'right',
    render: (tags) => <Tag color="orange">{tags}</Tag>,
  },
];

const data0 = [
  {
    key: '1',
    name: '关于参加鞍钢集团审计和巡视发现问题专项培训的通知 ',
    tags: ['公文系统'],
  },
  {
    key: '2',
    name: '关于调整参加在职员工人事档案整理工作培训时间的通知',
    tags: ['设备系统'],
  },
  {
    key: '3',
    name: '关于召开2020年度矿业公司基层党委书记抓党建工作述职评议会的通知',
    tags: ['财务共享'],
  },
];

interface WorkplaceProps {
  currentUser?: CurrentUser;
  projectNotice: NoticeType[];
  activities: ActivitiesType[];
  radarData: RadarDataType[];
  dispatch: Dispatch<any>;
  currentUserLoading: boolean;
  projectLoading: boolean;
  activitiesLoading: boolean;
}

const PageHeaderContent: React.FC<{ currentUser: CurrentUser }> = ({ currentUser }) => {
  const loading = currentUser && Object.keys(currentUser).length;
  if (!loading) {
    return <Skeleton avatar paragraph={{ rows: 1 }} active />;
  }
  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size="large" src={'https://img0.baidu.com/it/u=1489807627,808259306&fm=26&fmt=auto&gp=0.jpg'} />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>早安， xxx ，祝您开心每一天！</div>
        <div>xx有限公司/执行总经理</div>
      </div>
    </div>
  );
};

const ExtraContent: React.FC<{}> = () => (
  <div className={styles.extraContent}>
    <div className={styles.statItem}>
      <Statistic
        title="待办任务"
        value={124}
        prefix={<FormOutlined />}
        valueStyle={{ color: '#cf1322' }}
      />
    </div>
    <div className={styles.statItem}>
      <Statistic
        title="可办任务"
        value={56}
        prefix={<UnorderedListOutlined />}
        valueStyle={{ color: '#3f8600' }}
      />
    </div>
    <div className={styles.statItem}>
      <Statistic
        title="已办任务"
        value={614}
        prefix={<AuditOutlined />}
        valueStyle={{ color: '#3f8600' }}
      />
    </div>
  </div>
);

class Workplace extends Component<WorkplaceProps> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAndworkplace/init',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAndworkplace/clear',
    });
  }

  renderActivities = (item: ActivitiesType) => {
    const events = item.template.split(/@\{([^{}]*)\}/gi).map((key) => {
      if (item[key]) {
        return (
          <a href={item[key].link} key={item[key].name}>
            {item[key].name}
          </a>
        );
      }
      return key;
    });
    return (
      <List.Item key={item.id}>
        <List.Item.Meta
          avatar={<Avatar src={item.user.avatar} />}
          title={
            <span>
              <a className={styles.username}>{item.user.name}</a>
              &nbsp;
              <span className={styles.event}>{events}</span>
            </span>
          }
          description={
            <span className={styles.datetime} title={item.updatedAt}>
              {moment(item.updatedAt).fromNow()}
            </span>
          }
        />
      </List.Item>
    );
  };

  render() {
    const { currentUser, projectNotice, radarData } = this.props;

    if (!currentUser || !currentUser.userid) {
      return null;
    }
    return (
      <PageContainer
        content={<PageHeaderContent currentUser={currentUser} />}
        extraContent={<ExtraContent />}
      >
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card style={{ marginBottom: 24 }} bordered={false}>
              <Tabs defaultActiveKey="5">
                <TabPane  style={{ paddingTop: 20,paddingLeft:10,paddingRight:10,paddingBottom:25 }}
                  tab={
                    <span>
                      <FormOutlined />

                      <Badge count={5} offset={[10, 0]}>
                        待办任务
                      </Badge>
                    </span>
                  }
                  key="1"
                >
                  <div className="site-card-wrapper">
                    <Row gutter={16}>
                      <Col span={8}>
                        <Card

                          hoverable
                          actions={[

                            <span><CalendarOutlined key="edit" /> 2021.3.4</span>,
                            <Button danger type="dashed" shape="round" icon={<EditOutlined />} size="small" >办理</Button>,
                          ]}
                        >
                          <Meta avatar={<Avatar src={logo_oa} />} title="公文系统" description="关于参加xx集团审计和巡视发现问题专项培训的通知" />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card
                          hoverable
                          actions={[

                            <span><CalendarOutlined key="edit" /> 2021.3.4</span>,
                            <Button danger shape="round" icon={<EditOutlined />} size="small" >办理</Button>,
                          ]}
                        >
                          <Meta avatar={<Avatar src={logo_eam} />} title="设备系统" description="关于调整参加在职员工人事档案整理工作培训时间的通知" />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card
                          hoverable
                          actions={[

                            <span><CalendarOutlined key="edit" /> 2021.3.4</span>,
                            <Button danger type="primary" shape="round" icon={<EditOutlined />} size="small" >办理</Button>,
                          ]}
                        >
                          <Meta avatar={<Avatar src={logo_bi} />}  title="财务共享" description="关于召开2020年度矿业公司基层党委书记抓党建工作述职评议会的通知" />
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <UnorderedListOutlined />
                      可办任务
                    </span>
                  }
                  key="2"
                >
                  <Table showHeader={false} columns={columns} dataSource={data0} size="middle" />
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <AuditOutlined />
                      已办任务
                    </span>
                  }
                  key="3"
                >
                  <Table showHeader={false} columns={columns} dataSource={data0} size="middle" />
                </TabPane>
              </Tabs>
            </Card>

            <Card
              title="业务中心"
              style={{ marginBottom: 24 }}
              className={styles.tabsCard}
              bordered={false}
            >
              <Tabs defaultActiveKey="5">
                <TabPane
                  tab={
                    <span>
                      <FileTextOutlined />
                      公文管理系统
                    </span>
                  }
                  key="1"
                >
                  <Tag icon={<TwitterOutlined />} color="#55acee">
                    公文查询
                  </Tag>
                  <Tag icon={<YoutubeOutlined />} color="#cd201f">
                    通知公告
                  </Tag>
                  <Tag icon={<FacebookOutlined />} color="#3b5999">
                    规章制度
                  </Tag>
                  <Tag icon={<LinkedinOutlined />} color="#55acee">
                    全文搜索
                  </Tag>
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <FileDoneOutlined />
                      合同管理系统
                    </span>
                  }
                  key="2"
                >
                  <Tag icon={<TwitterOutlined />} color="#55acee">
                    合同台账
                  </Tag>
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <MoneyCollectOutlined />
                      财务共享平台
                    </span>
                  }
                  key="3"
                >
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <DropboxOutlined />
                      物资管控平台
                    </span>
                  }
                  key="4"
                >
                  <Tag icon={<TwitterOutlined />} color="#55acee">
                    物资计划
                  </Tag>
                  <Tag icon={<YoutubeOutlined />} color="#cd201f">
                    备件领用分析
                  </Tag>
                  <Tag icon={<FacebookOutlined />} color="#3b5999">
                    自主采购统计
                  </Tag>
                  <Tag icon={<YoutubeOutlined />} color="#cd201f">
                    备件领用分析
                  </Tag>
                  <Tag icon={<FacebookOutlined />} color="#3b5999">
                    采购合同一览表
                  </Tag>
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <SettingOutlined />
                      EAM
                    </span>
                  }
                  key="5"
                >
                  <Tag icon={<TwitterOutlined />} color="#55acee">
                    重点备件生命周期跟踪
                  </Tag>
                  <Tag icon={<YoutubeOutlined />} color="#cd201f">
                    精密点检报告
                  </Tag>
                  <Tag icon={<FacebookOutlined />} color="#3b5999">
                    日修工单统计
                  </Tag>
                  <Tag icon={<LinkedinOutlined />} color="#55acee">
                    大修工程明细
                  </Tag>
                  <Tag icon={<YoutubeOutlined />} color="#cd201f">
                    重点设备跟踪
                  </Tag>
                  <Tag icon={<FacebookOutlined />} color="#3b5999">
                    维检工程明细
                  </Tag>
                  <Tag icon={<LinkedinOutlined />} color="#55acee">
                    零固工程统计
                  </Tag>
                  <Tag icon={<FacebookOutlined />} color="#3b5999">
                    维修预算台账
                  </Tag>

                  <Tag style={{ marginTop: 14 }} icon={<LinkedinOutlined />} color="#55acee">
                    设备运行分析
                  </Tag>
                </TabPane>
              </Tabs>
            </Card>

            <Card title="协同办公" style={{ marginBottom: 24 }} bordered={false}>
              <List
                itemLayout="horizontal"
                dataSource={dataflow}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<a href="https://ant.design">{item.title}</a>}
                      description={item.description}
                    />
                    <List.Item.Meta title="开始时间" description="2021-02-24" />
                    <div style={{ width: 170 }}>
                      <Progress percent={30} size="small" />
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            <div className="site-card-wrapper" style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Card title="情况通报" bordered={false}>
                    <List
                      size="small"
                      dataSource={data1}
                      renderItem={(item) => <List.Item>{item}</List.Item>}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="会议纪要" bordered={false}>
                    <List
                      size="small"
                      dataSource={data2}
                      renderItem={(item) => <List.Item>{item}</List.Item>}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="重点工作" bordered={false}>
                    <List
                      size="small"
                      dataSource={data3}
                      renderItem={(item) => <List.Item>{item}</List.Item>}
                    />
                  </Card>
                </Col>
              </Row>
            </div>

            <div className="site-card-wrapper">
              <Row gutter={16}>
                <Col span={8}>
                  <Card title="定修管理" bordered={false}>
                    <List
                      size="small"
                      dataSource={data4}
                      renderItem={(item) => <List.Item>{item}</List.Item>}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="维修工程" bordered={false}>
                    <List
                      size="small"
                      dataSource={data5}
                      renderItem={(item) => <List.Item>{item}</List.Item>}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="规章制度" bordered={false}>
                    <List
                      size="small"
                      dataSource={data6}
                      renderItem={(item) => <List.Item>{item}</List.Item>}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{ marginBottom: 24 }}
              bordered={false}
              title="日程管理"
              loading={radarData.length === 0}
            >
              <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{ backgroundColor: '#87d068' }}
                          icon={<FieldTimeOutlined />}
                        />
                      }
                      title={<a href="https://ant.design">{item.title}</a>}
                      description={item.description}
                    />
                  </List.Item>
                )}
              />
            </Card>

            <Card
              title="报表"
              style={{ marginBottom: 24 }}
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList2}
              onTabChange={this.onTabChange}
            >
              <div className={styles.members}>
                <Row gutter={48}>
                  {projectNotice.map((item) => (
                    <Col span={12} key={`members-item-${item.id}`}>
                      <Link to={item.href}>
                        <Avatar src={item.logo} size="small" />
                        <span className={styles.member}>{item.member}</span>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card>

            <Card
              style={{ marginBottom: 24 }}
              title="快速开始 / 便捷导航"
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              <EditableLinkGroup onAdd={() => {}} links={links} linkElement={Link} />
            </Card>
          </Col>
        </Row>
      </PageContainer>
    );
  }
}

export default connect(
  ({
    dashboardAndworkplace: { currentUser, projectNotice, activities, radarData },
  }: {
    dashboardAndworkplace: ModalState;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    currentUser,
    projectNotice,
    activities,
    radarData,
  }),
)(Workplace);
