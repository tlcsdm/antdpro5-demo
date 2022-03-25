import React, {useEffect} from 'react';
import {Table, Tag} from 'antd';
import {connect} from 'umi';
import {Dispatch, ModelState} from "@@/plugin-dva/connect";
import {WorkitemData} from "./data";

const {Column} = Table;

interface IWorkitem {
  dispatch: Dispatch;
  workitems: WorkitemData[];
}

const WorkitemTable: React.FC<Partial<IWorkitem>> = (props) => {
  const {workitems, dispatch} = props;
  useEffect(()=>{
    if (dispatch) {
      dispatch({
        type: 'pandoraWorkspace/fetchWorkitems',
        payload: {
          name: 'pandora',
          type: 2
        }
      });
    }
  },[]);
  console.log("=======================================");
  console.log(workitems);
  return (
    <>
      <Table dataSource={workitems} size="middle">
        <Column title="任务名称" dataIndex="name" key="name" render={text => (<a>{text}</a>)}/>
        <Column title="" dataIndex="tags" key="tags"
                render={tags => (
                  <>
                    {tags.map((tag: string) => {
                      let color = tag.length > 5 ? 'geekblue' : 'green';
                      if (tag === 'loser') {
                        color = 'volcano';
                      }
                      return (
                        <Tag color={color} key={tag}>
                          {tag.toUpperCase()}
                        </Tag>
                      );
                    })}
                  </>
                )}/>
      </Table>
    </>
  );
};

export default connect(
  ({
     pandoraWorkspace,
   }: {
    pandoraWorkspace: ModelState;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    workitems: pandoraWorkspace.workitems
  })
)(WorkitemTable);

