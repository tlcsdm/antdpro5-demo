import React, {useEffect, useState} from 'react';
import {Button, Card, message} from 'antd';
import ProForm, {DrawerForm, ProFormSelect, ProFormTextArea} from '@ant-design/pro-form';
import 'antd/dist/antd.min.css';
import {loadContract,} from "@/services/contract/common/contractPreparation";
import PreChooseCandidate from "@/components/Choose/PreChooseCandidate";
import {completeApprove, loadNextUserTaskDefinition, selectApprovalOpinions} from "@/services/contract/person/approval";
import ProDescriptions from "@ant-design/pro-descriptions";
import {loadTemplateHtml} from "@/services/contract/business/template";
import {loadContractFileJson} from "@/services/contract/business/contractFile";

const UpdateApprovalContract = (props: any) => {
  const {isModalVisible, isShowModal, actionRef, contractId, tId, definitionKey} = props;
  const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单
  const [isCandidateModalVisible, setIsCandidateModalVisible] = useState(false);
  const [candidateDataSource, setCandidateDataSource] = useState([]);
  const [nextUserTaskDefinition, setNextUserTaskDefinition] = useState([]);
  const [candidate, setCandidate] = useState(undefined);
  const [processDefinitionKey, setProcessDefinitionKey] = useState(undefined);
  const [taskId, setTaskId] = useState(undefined);
  const [html, setHtml] = useState('');
  const [contract, setContract] = useState(undefined);

  const isShowCandidateModal = (show: boolean | ((prevState: boolean) => boolean)) => {
    setIsCandidateModalVisible(show);
  };

  //常用意见
  const [approvalOpinionList, setApprovalOpinionList] = useState([]);
  const onSelectApprovalOpinion = async () => {
    const approvalOpinionList = await selectApprovalOpinions({});
    const approvalOpinionTempList: any = [];
    approvalOpinionList.data.forEach(function (item: any) {
      const tempMajor: any = {value: item.I_ID, label: item.V_OPINIONS};
      approvalOpinionTempList.push(tempMajor);
    });
    setApprovalOpinionList(approvalOpinionTempList);
  };

  const onChangeOpinion = (label: any) => {
    formObj.setFieldsValue({['V_APPROVAL_OPINIONS']: label});
  };

  //修改时初始化数据
  const initContract = async () => {
    const response = await loadContract({I_ID: contractId});
    const contractData = response.data;
    setContract({...response.data});
    //模版初始化
    const resp = await loadTemplateHtml({
      I_ID: contractData['V_TEMPLATEID']
    });
    const V_HTML = resp.data.V_HTML && decodeURIComponent(resp.data.V_HTML);
    let index = V_HTML.indexOf('contenteditable="true"');
    let sum = 0;
    while (index > -1) {
      index = V_HTML.indexOf('contenteditable="true"', index + 1);
      sum++
    }
    //只读
    setHtml(V_HTML.replace(/contenteditable="true"/g, ''));
    //初始化模版值
    const res = await loadContractFileJson({
      V_GUID: contractData['I_ID']
    });
    if (!res.data || !res.data.V_JSON) return;
    let json = JSON.parse(res.data.V_JSON);
    for (let i = 0; i < sum; i++) {
      let key = 'CON_' + (i + 1);
      let sp = document.querySelector('#' + key) as HTMLInputElement;
      if (json[key] && json[key] !== '') {
        //优化显示
        if (sp.innerText.length > json[key].length) {
          sp.innerText = json[key] + sp.innerText.substring(json[key].length - 1);
        } else {
          sp.innerText = json[key];
        }
      }
    }
  };

  //初始化
  useEffect(() => {
    onSelectApprovalOpinion(); //常用意见
    if (contractId !== undefined) {
      setTaskId(tId);
      setProcessDefinitionKey(definitionKey);
      initContract();
    }
  }, []);


  // @ts-ignore
  useEffect(async () => {
    if (candidate !== undefined) {
      confirm('同意'); //确认
    }
  }, [candidate]);

  //同意
  const approve = async (fields: any) => {
    onSelectNextUserTaskDefinition(); //获得下一个用户任务节点
  };

  //获得下一个用户任务节点
  const onSelectNextUserTaskDefinition = async () => {
    const procCandidateList = await loadNextUserTaskDefinition({
      taskId: taskId,
      approval: 'approve',
    });
    setCandidateDataSource(procCandidateList.data.candidateList);
    setNextUserTaskDefinition(procCandidateList.data);
    if (procCandidateList.data.taskName == '结束') {
      end();  //办结
    } else {
      isShowCandidateModal(true);
    }
  };

  //办结
  const end = async () => {
    confirm('办结'); //确认
  };

  //驳回
  const reject = async () => {
    if (processDefinitionKey === "companyManager") {           //TODO
      message.warning('现在是发起状态，不能驳回!')
    } else {
      confirm('驳回'); //确认
    }
  };

  //流程确认
  const confirm = async (approvalInfo: any) => {
    let assigneeList = [];
    let assigneeNameList = [];
    if ((nextUserTaskDefinition as any).taskName !== undefined) {
      if (nextUserTaskDefinition != null && (nextUserTaskDefinition as any).taskName != '结束') {
        assigneeList.push('EMP[' + (candidate as any).value + ']');
        assigneeNameList.push((candidate as any).label);
      }
    }

    let info = approvalInfo + ', 下一步流程处理人: ' + assigneeNameList;

    if (approvalInfo == '办结') {
      info = '办结';
    }

    if (approvalInfo == '驳回') {
      info = approvalInfo + ', 下一步流程处理人: 流程发起人';
    }

    const hide = message.loading('处理中... [' + info + ']');

    let response = await completeApprove({
      TASK_ID_: taskId,
      APPROVAL_: approvalInfo === '驳回' ? 'reject' : 'approve',
      ASSIGNEE_: assigneeList.join(','),
      ASSIGNEE_LIST: assigneeList,
      APPROVAL_MEMO_: formObj.getFieldsValue(['V_APPROVAL_OPINIONS']).V_APPROVAL_OPINIONS
    });
    hide();
    if (response && response.success) {
      message.success("操作成功! [" + (approvalInfo == '驳回' ? ('成功! 驳回至起草人') : (nextUserTaskDefinition as any).taskName == '结束' ? '流程办结成功!' : '流程审批成功!') + ']');
      isShowModal(false);
      if (actionRef.current) {
        actionRef.current.reload();  //提交后刷新Protable
      }
    } else {
      return false;
    }
    return true;
  };

  return (
    <DrawerForm
      form={formObj} //const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单
      title={"合同待办"}
      width={0.9 * document.body.clientWidth}
      labelAlign={"right"} //文本框前面名称的位置
      visible={isModalVisible} //显示或隐藏
      onVisibleChange={isShowModal} //设置显示或隐藏
      onFinish={async (value) => { //表单提交 value表单中的值
        if (formObj.getFieldsValue(['V_APPROVAL_OPINIONS']).V_APPROVAL_OPINIONS === undefined) {
          formObj.setFieldsValue({
            V_APPROVAL_OPINIONS: '同意'
          });
        }
        const success = await approve(value);
        // @ts-ignore
        if (success) {
          isShowModal(false);
          if (actionRef.current) {
            actionRef.current.reload();  //提交后刷新Protable
          }
        }
      }}
      submitter={{
        searchConfig: {
          submitText: '同意',
          resetText: '取消',
        },
        render: (props, defaultDoms) => {
          return [
            ...defaultDoms,
            <Button
              key="驳回"
              onClick={async () => {
                const success = await reject();
                // @ts-ignore
                if (success) {
                  isShowModal(false);
                  if (actionRef.current) {
                    actionRef.current.reload();  //提交后刷新Protable
                  }
                }
              }}
            >
              驳回
            </Button>,
          ];
        }
      }}
    >

      <ProFormSelect
        options={approvalOpinionList}
        width="lg"
        name="V_OPINIONS"
        label="常用意见"
        fieldProps={{
          onChange(value, options) {
            // @ts-ignore
            onChangeOpinion(options.label);
          }
        }}
      />
      <ProFormTextArea
        label="处理意见"
        width="lg"
        name="V_APPROVAL_OPINIONS"
        /*rules={[
          {
            required: true,
            message: '处理意见为必填项'
          }
        ]}*/
      />

      <ProDescriptions
        title="合同详情信息"
        column={3}
        bordered
        dataSource={contract}
        columns={[
          {
            title: '项目编号',
            dataIndex: 'V_PROJECTCODE',
          }, {
            title: '项目名称',
            dataIndex: 'V_PROJECTNAME',
          }, {
            title: '合同模版',
            dataIndex: 'V_TEMPLATE',
          }, {
            title: '定制方',
            dataIndex: 'V_SPONSORNAME',
          }, {
            title: '承揽方',
            dataIndex: 'V_CONTRACTORNAME',
          }, {
            title: '金额(元)',
            dataIndex: 'V_MONEY',
            valueType: 'money'
          }, {
            title: '履行起始时间',
            dataIndex: 'V_STARTDATE',
            valueType: 'date'
          }, {
            title: '履行终止时间',
            dataIndex: 'V_ENDDATE',
            valueType: 'date'
          }, {
            title: '计划年份',
            dataIndex: 'V_YEAR',
            valueType: 'dateYear'
          }, {
            title: '合同份数',
            dataIndex: 'I_COPIES',
          }, {
            title: '签审份数',
            dataIndex: 'I_REVIEWCOPIES',
          }, {
            title: '合同编码',
            dataIndex: 'V_CONTRACTCODE',
          }, {
            title: '合同类型',
            dataIndex: 'V_ACCORDANCE',
          }, {
            title: '所属专业',
            dataIndex: 'V_MAJOR',
          }
        ]}
      >
      </ProDescriptions>

      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isCandidateModalVisible ? (
          ''
        ) : (
          <PreChooseCandidate
            isCandidateModalVisible={isCandidateModalVisible}
            isShowCandidateModal={isShowCandidateModal}
            candidateDataSource={candidateDataSource}
            setCandidate={setCandidate}
          />
        )
      }
      <Card>
        <div dangerouslySetInnerHTML={{__html: html}}>
        </div>
      </Card>
    </DrawerForm>
  );
};
export default UpdateApprovalContract;
