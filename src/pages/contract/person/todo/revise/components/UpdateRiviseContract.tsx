import React, {useEffect, useState} from 'react';
import {Button, Card, message} from 'antd';
import ProForm, {
  DrawerForm,
  ProFormMoney,
  ProFormSelect,
  ProFormTextArea,
  ProFormUploadDragger
} from '@ant-design/pro-form';
import 'antd/dist/antd.min.css';
import {loadContract, updateContract,} from "@/services/contract/common/contractPreparation";
import PreChooseCandidate from "@/components/Choose/PreChooseCandidate";
import {completeApprove, loadNextUserTaskDefinition, selectApprovalOpinions} from "@/services/contract/person/approval";
import {selectMajor} from "@/services/contract/business/major";
import {useModel} from "@@/plugin-model/useModel";
import ProFormText from "@ant-design/pro-form/lib/components/Text";
import ProFormDigit from "@ant-design/pro-form/lib/components/Digit";
import ProFormDatePicker from "@ant-design/pro-form/lib/components/DatePicker";
import moment from "moment";
import {contractTypeOpinion} from "@/utils/enum";
import PreChooseTemplate from "@/components/Choose/PreChooseTemplate";
import PreChooseSponsor from "@/components/Choose/PreChooseSponsor";
import PreChooseContractor from "@/components/Choose/PreChooseContractor";
import {loadTemplateHtml} from "@/services/contract/business/template";
import {loadContractFileJson} from "@/services/contract/business/contractFile";

const UpdateRiviseContract = (props: any) => {
  const {isModalVisible, isShowModal, actionRef, contractId, tId, definitionKey} = props;
  const [contract, setContract] = useState({});// 将表单初始化的值设置成状态, 在编辑的时候, 使用这个状态
  const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单
  const [fileList, setFileList] = useState([]);  //附件
  const [isSponsorModalVisible, setIsSponsorModalVisible] = useState(false);
  const [isContractorModalVisible, setIsContractorModalVisible] = useState(false);
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [isCandidateModalVisible, setIsCandidateModalVisible] = useState(false);
  const [candidateDataSource, setCandidateDataSource] = useState([]);
  const [nextUserTaskDefinition, setNextUserTaskDefinition] = useState([]);
  const [candidate, setCandidate] = useState(undefined);
  const [processDefinitionKey, setProcessDefinitionKey] = useState(undefined);
  const [taskId, setTaskId] = useState(undefined);
  const {initialState} = useModel('@@initialState');
  const [contractor, setContractor] = useState(undefined);
  const [sponsor, setSponsor] = useState(undefined);
  const [template, setTemplate] = useState(undefined);
  const [html, setHtml] = useState('');

  const isShowSponsorModal = (show: boolean | ((prevState: boolean) => boolean)) => {
    setIsSponsorModalVisible(show);
  };

  const isShowContractorModal = (show: boolean | ((prevState: boolean) => boolean)) => {
    setIsContractorModalVisible(show);
  };

  const isShowTemplateModal = (show: boolean | ((prevState: boolean) => boolean)) => {
    setIsTemplateModalVisible(show);
  };

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

  //专业
  const [majorList, setMajorList] = useState([]);
  const onSelectMajor = async () => {
    const deptMarjorList = await selectMajor({
      V_DEPTCODE: (initialState as any).currentUser.V_DEPTCODE,
    });
    const deptMajorTempList: any = [];
    deptMarjorList.data.forEach(function (item: any) {
      const tempMajor: any = {value: item.I_ID, label: item.V_NAME};
      deptMajorTempList.push(tempMajor);
    });
    setMajorList(deptMajorTempList);
  };

  //修改时初始化数据
  const initContract = async () => {
    const response = await loadContract({I_ID: contractId});
    setTaskId(tId);
    setProcessDefinitionKey(definitionKey);
    const contractData = response.data;
    setContract({...response.data});
    Object.keys(contractData).forEach(key => formObj.setFieldsValue({[`${key}`]: contractData[key]}));
    //模版初始化
    const resp = await loadTemplateHtml({
      I_ID: contractData['V_TEMPLATEID']
    });
    const V_HTML = resp.data.V_HTML && decodeURIComponent(resp.data.V_HTML);
    setHtml(V_HTML);
    //初始化模版值
    const res = await loadContractFileJson({
      V_GUID: contractData['I_ID']
    });
    if (!res.data || !res.data.V_JSON) return;
    let json = JSON.parse(res.data.V_JSON);
    let index = V_HTML.indexOf('contenteditable="true"');
    let sum = 0;
    while (index > -1) {
      index = V_HTML.indexOf('contenteditable="true"', index + 1);
      sum++
    }
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
    onSelectMajor();  //专业
    onSelectApprovalOpinion(); //常用意见
    if (contractId !== undefined) {
      initContract();
    }
  }, []);

  // @ts-ignore
  useEffect(async () => {
    if (sponsor !== undefined) {
      formObj.setFieldsValue({
        V_SPONSORNAME: (sponsor as any).V_SPONSORNAME
      });
    }
  }, [sponsor]);

  // @ts-ignore
  useEffect(async () => {
    if (contractor !== undefined) {
      formObj.setFieldsValue({
        V_CONTRACTORNAME: (contractor as any).V_NAME
      });
    }
  }, [contractor]);

  // @ts-ignore
  useEffect(async () => {
    if (template !== undefined) {
      formObj.setFieldsValue({
        V_TEMPLATE: (template as any).V_NAME
      });
    }
  }, [template]);

  // @ts-ignore
  useEffect(async () => {
    if (candidate !== undefined) {
      confirm('同意'); //确认
    }
  }, [candidate]);

  //form表单提交
  const handleSubmit = async (fields: any) => {
    const hide = message.loading('处理中...');
    let response = [];
    // 对提交后端数据处理
    const formData = new FormData();
    fileList.forEach(file => {// 合同附件上传
      formData.append('multipartFiles', (file as any).originFileObj);
    });
    Object.keys(fields).forEach(function (key) {
      if (`${key}` !== 'V_YEAR' && `${key}` !== 'V_STARTDATE' && `${key}` !== 'V_ENDDATE') {
        formData.append(`${key}`, fields[key]);
      }
    });
    formData.append('V_SPONSORID', sponsor !== undefined ? (sponsor as any).I_ID : (contract as any).V_SPONSORID);
    formData.append('V_SPONSORCODE', sponsor !== undefined ? (sponsor as any).V_SPONSORCODE : (contract as any).V_SPONSORCODE);
    formData.append('V_CONTRACTORID', contractor !== undefined ? (contractor as any).CONTRACTOR_ID : (contract as any).V_CONTRACTORID);
    formData.append('V_TEMPLATEID', template !== undefined ? (template as any).V_TEMPLATEID : (contract as any).V_TEMPLATEID);
    formData.append('V_YEAR', moment(fields.V_YEAR).format('YYYY'));
    formData.append('V_STARTDATE', moment(fields.V_STARTDATE).format('YYYY-MM-DD'));
    formData.append('V_ENDDATE', moment(fields.V_ENDDATE).format('YYYY-MM-DD'));
    formData.append('I_ID', (contract as any).I_ID);
    //组装json
    let index = html.indexOf('contenteditable="true"');
    let sum = 0;
    while (index > -1) {
      index = html.indexOf('contenteditable="true"', index + 1);
      sum++
    }
    let json = '{';
    for (let i = 0; i < sum; i++) {
      let key = 'CON_' + (i + 1);
      let sp = document.querySelector('#' + key) as HTMLInputElement;
      let cont = sp.innerText.trim();
      json += ('"' + key + '": ' + (cont.length > 0 ? '"' + sp.innerText.trim() + '"' : '""'));
      if (i !== sum - 1) {
        json += ',';
      }
    }
    json += '}';
    formData.append('V_JSON', json);
    response = await updateContract(formData);

    hide();
    if (response && response.success) {
      message.success("操作成功");
    } else {
      return false;
    }
    return true;
  };

  //同意
  const approve = async () => {
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

  //文件数据
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    setFileList(e.fileList);
    return e && e.fileList;
  };
  const fileProps = {
    name: 'file',
    beforeUpload: () => {
      return false;
    },
  };

  return (
    <DrawerForm
      form={formObj} //const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单
      title={"合同待修订"}
      width={0.9 * document.body.clientWidth}
      labelAlign={"right"} //文本框前面名称的位置
      visible={isModalVisible} //显示或隐藏
      onVisibleChange={isShowModal} //设置显示或隐藏
      drawerProps={{
        maskClosable: false
      }}
      onFinish={async (value) => { //表单提交 value表单中的值
        await handleSubmit(value);
      }}
      submitter={{
        searchConfig: {
          submitText: '保存',
          resetText: '取消',
        },
        render: (props, defaultDoms) => {
          return [
            ...defaultDoms,
            <Button
              key="同意"
              onClick={async () => {
                if (formObj.getFieldsValue(['V_APPROVAL_OPINIONS']).V_APPROVAL_OPINIONS === undefined) {
                  formObj.setFieldsValue({
                    V_APPROVAL_OPINIONS: '同意'
                  });
                }
                const success = await approve();
                // @ts-ignore
                if (success) {
                  isShowModal(false);
                  if (actionRef.current) {
                    actionRef.current.reload();  //提交后刷新Protable
                  }
                }
              }}
            >
              同意
            </Button>,
            <Button
              key="驳回"
              onClick={async () => {
                if (formObj.getFieldsValue(['V_APPROVAL_OPINIONS']).V_APPROVAL_OPINIONS === undefined) {
                  message.warning('审批意见为空！')
                } else {
                  const success = await reject();
                  // @ts-ignore
                  if (success) {
                    isShowModal(false);
                    if (actionRef.current) {
                      actionRef.current.reload();  //提交后刷新Protable
                    }
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
      <ProForm.Group>
        <ProFormText
          label="项目编号"
          width="md"
          name="V_PROJECTCODE"
          //readonly={(contract !== undefined)}
          rules={[
            {
              required: true,
              message: '项目编号为必填项'
            }
          ]}
        />
        <ProFormText
          label="项目名称"
          width="md"
          name="V_PROJECTNAME"
          rules={[
            {
              required: true,
              message: '项目名称为必填项'
            }
          ]}
        />
        <ProFormText
          label="合同模版"
          width="md"
          name="V_TEMPLATE"
          disabled
          placeholder={'请选择'}
          rules={[
            {
              required: true,
              message: '合同模版为必填项'
            }
          ]}
          addonAfter={<a onClick={() => isShowTemplateModal(true)}>选择</a>}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          label="合同编码"
          width="md"
          name="V_CONTRACTCODE"
          rules={[
            {
              required: true,
              message: '合同编码为必填项'
            }
          ]}
        />
        <ProFormMoney
          label="金额(元)"
          width="md"
          name="V_MONEY"
          initialValue={0}
          locale="zh-CN"
          min={0}
          fieldProps={{precision: 2}}
          rules={[
            {
              required: true,
              message: '金额为必填项',
            },
          ]}
        />
        <ProFormText
          label="定制方"
          width="md"
          name="V_SPONSORNAME"
          disabled
          placeholder={'请选择'}
          rules={[
            {
              required: true,
              message: '定作方为必填项'
            }
          ]}
          addonAfter={<a onClick={() => isShowSponsorModal(true)}>选择</a>}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDatePicker
          name="V_STARTDATE"
          width="md"
          label="履行起始时间"
          rules={[
            {
              required: true,
              message: '履行起始时间为必填项',
            },
          ]}
          initialValue={moment()}
        />
        <ProFormDatePicker
          name="V_ENDDATE"
          width="md"
          label="履行终止时间"
          rules={[
            {
              required: true,
              message: '履行终止时间为必填项',
            },
          ]}
          initialValue={moment()}
        />
        <ProFormText
          label="承揽方"
          width="md"
          name="V_CONTRACTORNAME"
          disabled
          placeholder={'请选择'}
          rules={[
            {
              required: true,
              message: '承揽方为必填项'
            }
          ]}
          addonAfter={<a onClick={() => isShowContractorModal(true)}>选择</a>}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDatePicker.Year
          name="V_YEAR"
          width="md"
          label="计划年份"
          initialValue={Date.now()}
          rules={[
            {
              required: true,
              message: '计划年份为必填项',
            },
          ]}/>
        <ProFormDigit
          label="合同份数"
          width="md"
          name="I_COPIES"
          initialValue={6}
          min={0}
          fieldProps={{precision: 0}}
          rules={[
            {
              required: true,
              message: '合同份数为必填项',
            },
          ]}
        />
        <ProFormDigit
          label="签审份数"
          width="md"
          name="I_REVIEWCOPIES"
          initialValue={3}
          min={0}
          fieldProps={{precision: 0}}
          rules={[
            {
              required: true,
              message: '签审份数为必填项',
            },
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          options={contractTypeOpinion}
          name="V_ACCORDANCE"
          width="md"
          label="合同类型"
          rules={[
            {
              required: true,
              message: '合同类型为必填项',
            },
          ]}
          initialValue={'中标'}
        />
        <ProFormSelect
          options={majorList}
          name="V_MAJORID"
          width="md"
          label="所属专业"
          rules={[
            {
              required: true,
              message: '所属专业为必填项',
            },
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormUploadDragger
          {...fileProps}
          label="附件"
          width="md"
          getValueFromEvent={normFile}
          fieldProps={{multiple: true}}
        />
        <ProFormSelect
          options={approvalOpinionList}
          width="md"
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
          width="md"
          name="V_APPROVAL_OPINIONS"
        />
      </ProForm.Group>
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

      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isTemplateModalVisible ? (
          ''
        ) : (
          <PreChooseTemplate
            isTemplateModalVisible={isTemplateModalVisible}
            isShowTemplateModal={isShowTemplateModal}
            setTemplate={setTemplate}
          />
        )
      }

      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isSponsorModalVisible ? (
          ''
        ) : (
          <PreChooseSponsor
            isSponsorModalVisible={isSponsorModalVisible}
            isShowSponsorModal={isShowSponsorModal}
            setSponsor={setSponsor}
          />
        )
      }
      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isContractorModalVisible ? (
          ''
        ) : (
          <PreChooseContractor
            isContractorModalVisible={isContractorModalVisible}
            isShowContractorModal={isShowContractorModal}
            setContractor={setContractor}
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
export default UpdateRiviseContract;
