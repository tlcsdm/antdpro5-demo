import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.min.css';
import {Button, Image} from 'antd';
import Modal from "antd/es/modal/Modal";
import Cookies from "js-cookie";

const InsertProcessDefinition = (props: any) => {
  const {isModalDiagramVisible, isShowDiagramModal, deploymentId} = props;
  const [deployId, setDeployId] = useState(undefined);
  //初始化
  useEffect(() => {
    setDeployId(deploymentId);
  }, []);

  const handleCancel = () => {
    isShowDiagramModal(false);
  };

  return (
    <Modal
      title={'查看流程图'}
      width="500px"
      visible={isModalDiagramVisible}
      footer={[<Button key="close" type="primary" onClick={handleCancel}>关闭</Button>,]}
      onCancel={handleCancel}
    >
      <Image
        width={400}
        height={500}
        src={"/api/contract-system/loadProcessDefinitionDiagramByDeploymentId?deploymentId=" + deployId + '&V_PERCODE=' + Cookies.get('V_PERCODE') + '&random=' + Math.random()}
      />
    </Modal>
  );
};
export default InsertProcessDefinition;
