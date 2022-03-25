import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.min.css';
import {Button, Image} from 'antd';
import Modal from "antd/es/modal/Modal";
import Cookies from "js-cookie";

const ViewProcessDiagram = (props: any) => {
  const {isProcessDiagramModalVisible, isShowProcessDiagramModal, procInstanceId} = props;
  const [processInstanceId, setProcessInstanceId] = useState(undefined);

  //初始化
  useEffect(() => {
    setProcessInstanceId(procInstanceId);
  }, []);

  const handleCancel = () => {
    isShowProcessDiagramModal(false);
  };

  return (
    <Modal
      title={'查看流程图'}
      width="500px"
      visible={isProcessDiagramModalVisible}
      footer={[<Button key="close" type="primary" onClick={handleCancel}>关闭</Button>,]}
      onCancel={handleCancel}
    >
      <Image
        width={400}
        height={500}
        src={"/api/contract-system/loadProcessInstanceDiagram?processInstanceId=" + processInstanceId + '&V_PERCODE=' + Cookies.get('V_PERCODE') + '&random=' + Math.random()}
      />
    </Modal>
  );
};
export default ViewProcessDiagram;
