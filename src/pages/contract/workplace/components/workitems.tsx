import React from 'react';
import {Badge, Card, Tabs} from 'antd';
import {AuditOutlined, FormOutlined, UnorderedListOutlined} from '@ant-design/icons';

import WorkitemTable from './workitemtable';
import {Dispatch, ModelState} from "@@/plugin-dva/connect";
import {WorkitemData} from "./data";
import {connect} from "umi";

const {TabPane} = Tabs;

interface IWorkitem {
  dispatch: Dispatch;
  workitems: WorkitemData[];
}

const Workitem: React.FC<IWorkitem> = (props) => {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {workitems, dispatch} = props;

  return (
    <>
      <Card
        style={{marginBottom: 24}}
        bordered={false}
      >
        <Tabs defaultActiveKey="5">
          <TabPane
            tab={
              <span>
                                <FormOutlined/>
                                <Badge count={5} offset={[10, 0]}>待办任务</Badge>
                            </span>
            }
            key="1"
          >
            <WorkitemTable type="1"/>
          </TabPane>
          <TabPane
            tab={
              <span>
                                <UnorderedListOutlined/>可办任务
                            </span>
            }
            key="2"
          >
            <WorkitemTable type="2"/>
          </TabPane>
          <TabPane
            tab={
              <span>
                                <AuditOutlined/>已办任务
                            </span>
            }
            key="3"
          >
            <WorkitemTable type="3"/>
          </TabPane>

        </Tabs>
      </Card>
    </>
  );

};

const mapStateToProps = (state: any)=>{
  return { state }
};

export default connect(mapStateToProps)(Workitem);
