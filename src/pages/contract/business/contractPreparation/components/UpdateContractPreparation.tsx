import React, {useEffect, useState} from 'react';
import {Button, message} from 'antd';
import ProForm, {ModalForm, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormText} from '@ant-design/pro-form';
import 'antd/dist/antd.min.css';
import {
  insertContract,
  loadContract,
  selectFirstTaskProcCandidate,
  startContractProcess,
  updateContract
} from "@/services/contract/common/contractPreparation";
import moment from "moment";
import {selectMajor} from "@/services/contract/business/major";
import {useModel} from "@@/plugin-model/useModel";
import ProFormUploadButton from "@ant-design/pro-form/lib/components/UploadButton";
import PreChooseSponsor from "@/components/Choose/PreChooseSponsor";
import PreChooseContractor from "@/components/Choose/PreChooseContractor";
import {contractTypeOpinion} from "@/utils/enum";
import PreChooseFirstCandidate from "@/components/Choose/PreChooseFirstCandidate";
import {selectMajorToFlow} from "@/services/contract/business/majorToFlow";
import PreChooseTemplate from "@/components/Choose/PreChooseTemplate";

const UpdateContractPreparation = (props: any) => {
  const {isModalVisible, isShowModal, actionRef, contractId} = props;
  const [contract, setContract] = useState(undefined);// 将表单初始化的值设置成状态, 在编辑的时候, 使用这个状态
  const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单
  const {initialState} = useModel('@@initialState');
  const [fileList, setFileList] = useState([]);  //附件
  const [isSponsorModalVisible, setIsSponsorModalVisible] = useState(false);
  const [isContractorModalVisible, setIsContractorModalVisible] = useState(false);
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [isCandidateModalVisible, setIsCandidateModalVisible] = useState(false);
  const [contractor, setContractor] = useState(undefined);
  const [sponsor, setSponsor] = useState(undefined);
  const [template, setTemplate] = useState(undefined);
  const [candidateDataSource, setCandidateDataSource] = useState([]);
  const [candidate, setCandidate] = useState(undefined);
  const [processDefinitionKey, setProcessDefinitionKey] = useState(undefined);
  const [businessId, setBusinessId] = useState(undefined);

  const isShowSponsorModal = (show: boolean | ((prevState: boolean) => boolean)) => {
    setIsSponsorModalVisible(show);
  };

  const isShowContractorModal = (show: boolean | ((prevState: boolean) => boolean)) => {
    setIsContractorModalVisible(show);
  };

  const isShowCandidateModal = (show: boolean | ((prevState: boolean) => boolean)) => {
    setIsCandidateModalVisible(show);
  };

  const isShowTemplateModal = (show: boolean | ((prevState: boolean) => boolean)) => {
    setIsTemplateModalVisible(show);
  };

  //接收作业区
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
    setBusinessId(contractId);
    const contractData = response.data;
    setContract({...response.data});
    Object.keys(contractData).forEach(key => formObj.setFieldsValue({[`${key}`]: contractData[key]}));
  };

  //初始化
  useEffect(() => {
    onSelectMajor();
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
      startApproval();
    }
  }, [candidate]);

  //form表单提交
  const handleSubmit = async (fields: any) => {
    const hide = message.loading('处理中...');
    let response = [];
    // 对提交后端数据处理
    const newFields = {};
    Object.assign(newFields, fields);
    newFields['V_SPONSORID'] = sponsor !== undefined ? (sponsor as any).I_ID : (contract as any).V_SPONSORID;
    newFields['V_SPONSORCODE'] = sponsor !== undefined ? (sponsor as any).V_SPONSORCODE : (contract as any).V_SPONSORCODE;
    newFields['V_CONTRACTORID'] = contractor !== undefined ? (contractor as any).I_ID : (contract as any).V_CONTRACTORID;
    newFields['V_TEMPLATEID'] =template !== undefined ? (template as any).I_ID : (contract as any).V_TEMPLATEID;
    newFields['V_YEAR'] = moment(fields.V_YEAR).format('YYYY');
    if (contract === undefined) {
      response = await insertContract({...newFields});
    } else {
      newFields['V_STARTDATE'] = moment(fields.V_STARTDATE).format('YYYY-MM-DD');
      newFields['V_ENDDATE'] = moment(fields.V_ENDDATE).format('YYYY-MM-DD');
      response = await updateContract({I_ID: (contract as any).I_ID, ...newFields});
    }
    // TODO 合同附件上传
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('multipartFiles', (file as any).originFileObj);
    });

    hide();
    if (response && response.success) {
      message.success("操作成功");
    } else {
      return false;
    }
    return true;
  };

  //上报
  const submitContractProcess = async () => {
    onSelectMajorFlow(formObj.getFieldValue('V_MAJORID'), formObj.getFieldValue('V_ACCORDANCE'));//流程定义key
  };

  //查询流程定义key
  const onSelectMajorFlow = async (majorId: any, contractType: any) => {
    const majorList = await selectMajorToFlow({V_MAJORID: majorId, V_CONTYPE: contractType});
    onSelectCandidate(majorList.data[0].KEY_);//查询第一步候选人
    setProcessDefinitionKey(majorList.data[0].KEY_);
  };

  //查询第一步候选人
  const onSelectCandidate = async (key: any) => {
    const procCandidateList = await selectFirstTaskProcCandidate({
      processDefinitionKey: key,
      taskDefinitionKey: 'companyLeader',
      orgCode: (initialState as any).currentUser.V_DEPTCODE
    });
    setCandidateDataSource(procCandidateList.data);
    isShowCandidateModal(true);
  };

  //流程上报
  const startApproval = async () => {
    const hide = message.loading('处理中...');
    let response = await startContractProcess({
      I_ID: businessId,
      ASSIGNEE_: 'EMP[' + (candidate as any).V_CANDIDATE + ']',
      PROCESS_DEFINITION_KEY_: processDefinitionKey
    });
    hide();
    if (response && response.success) {
      message.success("操作成功");
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
    <ModalForm
      form={formObj} //const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单
      title={(contract !== undefined ? "修改" : "新增")}
      width="800px"
      labelAlign={"right"} //文本框前面名称的位置
      visible={isModalVisible} //显示或隐藏
      onVisibleChange={isShowModal} //设置显示或隐藏
      onFinish={async (value) => { //表单提交 value表单中的值
        const success = await handleSubmit(value);
        if (success) {
          isShowModal(false);
          if (actionRef.current) {
            actionRef.current.reload();  //提交后刷新Protable
          }
        }
      }}
      submitter={{
        render: (props, defaultDoms) => {
          return [
            ...defaultDoms,
            <Button
              key="ok"
              onClick={() => {
                submitContractProcess();
              }}
            >
              上报
            </Button>,
          ];
        }
      }}
    >
      <ProForm.Group>
        <ProFormText
          label="项目编号"
          width="sm"
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
          label="合同模版"
          width="sm"
          name="V_TEMPLATE"
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
          label="项目名称"
          width="sm"
          name="V_PROJECTNAME"
          rules={[
            {
              required: true,
              message: '项目名称为必填项'
            }
          ]}
        />
        <ProFormText
          label="定作方"
          width="sm"
          name="V_SPONSORNAME"
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
        <ProFormDigit
          label="金额"
          width="sm"
          name="V_MONEY"
          initialValue={0}
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
          label="承揽方"
          width="sm"
          name="V_CONTRACTORNAME"
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
        <ProFormDatePicker
          width="sm"
          name="V_STARTDATE"
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
          width="sm"
          name="V_ENDDATE"
          label="履行终止时间"
          rules={[
            {
              required: true,
              message: '履行终止时间为必填项',
            },
          ]}
          initialValue={moment()}
        />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormDatePicker.Year
          width="sm"
          name="V_YEAR"
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
          width="sm"
          name="I_COPIES"
          initialValue={0}
          min={0}
          fieldProps={{precision: 0}}
          rules={[
            {
              required: true,
              message: '合同份数为必填项',
            },
          ]}
        />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormDigit
          label="签审份数"
          width="sm"
          name="I_REVIEWCOPIES"
          initialValue={0}
          min={0}
          fieldProps={{precision: 0}}
          rules={[
            {
              required: true,
              message: '签审份数为必填项',
            },
          ]}
        />
        <ProFormText
          label="合同编码"
          width="sm"
          name="V_CONTRACTCODE"
          rules={[
            {
              required: true,
              message: '合同编码为必填项'
            }
          ]}
        />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormSelect
          options={contractTypeOpinion}
          width="sm"
          name="V_ACCORDANCE"
          label="合同类型"
          rules={[
            {
              required: true,
              message: '合同类型为必填项',
            },
          ]}
        />
        <ProFormSelect
          options={majorList}
          width="sm"
          name="V_MAJORID"
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
        <ProFormUploadButton
          {...fileProps}
          label="附件"
          title="上传文件"
          getValueFromEvent={normFile}
          fieldProps={{multiple: true}}
        />
      </ProForm.Group>

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
      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isCandidateModalVisible ? (
          ''
        ) : (
          <PreChooseFirstCandidate
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
    </ModalForm>
  );
};
export default UpdateContractPreparation;
