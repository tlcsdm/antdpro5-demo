import React, {useEffect, useState} from 'react';
import ProForm, {ModalForm} from '@ant-design/pro-form';
import 'antd/dist/antd.min.css';
import ProFormSelect from "@ant-design/pro-form/lib/components/Select";

const PreChooseFirstCandidate = (props: any) => {
  const {isCandidateModalVisible, isShowCandidateModal, candidateDataSource,setCandidate} = props;
  const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单
  const [firstCandidateList, setFristCandidateList] = useState([]);

  //查询第一步候选人
  const onSelectCandidate = async () => {
    const candidateTempList: any = [];
    candidateDataSource.forEach(function (item: any) {
      const tempCandidate: any = {value: item.V_PERCODE, label: item.V_PERNAME};
      candidateTempList.push(tempCandidate);
    });
    setFristCandidateList(candidateTempList);

    if (candidateDataSource.length > 0) {
      formObj.setFieldsValue({['V_CANDIDATE']: candidateDataSource[0].V_PERCODE});
    }
  };

  //初始化
  useEffect(() => {
    onSelectCandidate();
  }, []);

  return (
    <ModalForm
      form={formObj} //const [formObj] = ProForm.useForm(); // 定义Form实例, 用来操作表单
      title={"选择审批人"}
      width="400px"
      labelAlign={"right"} //文本框前面名称的位置
      visible={isCandidateModalVisible} //显示或隐藏
      onVisibleChange={isShowCandidateModal} //设置显示或隐藏
      onFinish={async (value) => { //表单提交 value表单中的值
        setCandidate(value);
        isShowCandidateModal(false);
      }}
    >
      <ProForm.Group>
        <ProFormSelect
          options={firstCandidateList}
          width="sm"
          name="V_CANDIDATE"
          label="下一步审批人"
          rules={[
            {
              required: true,
              message: '下一步审批人为必填项',
            },
          ]}
        />
      </ProForm.Group>
    </ModalForm>
  );
};
export default PreChooseFirstCandidate;
