import React, {useEffect, useState} from 'react';
import ProForm, {ModalForm} from '@ant-design/pro-form';
import 'antd/dist/antd.min.css';
import ProFormSelect from "@ant-design/pro-form/lib/components/Select";
import {message} from "antd";

const PreChooseCandidate = (props: any) => {
  const {isCandidateModalVisible, isShowCandidateModal, candidateDataSource,setCandidate} = props;
  const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单
  const [candidateList, setCandidateList] = useState([]);
  const [temCandidate, setTempCandidate] = useState([]);

  //查询候选人
  const onSelectCandidate = async () => {
    const candidateTempList: any = [];
    candidateDataSource.forEach(function (item: any) {
      const tempCandidate: any = {value: item.V_PERCODE, label: item.V_PERNAME};
      candidateTempList.push(tempCandidate);
    });
    setCandidateList(candidateTempList);
    setTempCandidate(candidateTempList[0]);

    if (candidateDataSource.length > 0) {
      formObj.setFieldsValue({['V_CANDIDATE']: candidateDataSource[0].V_PERCODE});
    }else{
      message.info('未找到下一步审批人!');
    }
  };

  //初始化
  useEffect(() => {
    onSelectCandidate();
  }, []);

  const onChangeCandidate = (value: any) => {
    setTempCandidate(value);
  };

  return (
    <ModalForm
      form={formObj} //const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单
      title={"选择审批人"}
      width="400px"
      labelAlign={"right"} //文本框前面名称的位置
      visible={isCandidateModalVisible} //显示或隐藏
      onVisibleChange={isShowCandidateModal} //设置显示或隐藏
      onFinish={async (value) => { //表单提交 value表单中的值
        setCandidate(temCandidate);
        isShowCandidateModal(false);
      }}
    >
      <ProForm.Group>
        <ProFormSelect
          options={candidateList}
          width="sm"
          name="V_CANDIDATE"
          label="下一步审批人"
          rules={[
            {
              required: true,
              message: '下一步审批人为必填项',
            },
          ]}
          fieldProps={{
            onChange(value, options) {
              // @ts-ignore
              onChangeCandidate(options);
            }
          }}
        />
      </ProForm.Group>
    </ModalForm>
  );
};
export default PreChooseCandidate;
