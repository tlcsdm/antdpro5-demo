import {Button, Card} from 'antd';
import React, {useEffect} from 'react';
import 'moment/locale/zh-cn'
import Modal from "antd/es/modal/Modal";

const ViewHtml = (props: any) => {
  const {title, html, handleCancel, isModalVisible} = props;

  //useEffect参数为空数组时仅初始化执行一次
  useEffect(() => {

  }, []);

  return (
    <Modal
      title={title || false}
      width={0.9 * document.body.clientWidth}
      visible={isModalVisible}
      footer={[<Button key="close" type="primary" onClick={handleCancel}>关闭</Button>]}
      onCancel={handleCancel}
    >
      <Card>
        <div dangerouslySetInnerHTML={{__html: html}}>
        </div>
      </Card>
    </Modal>
  );
};

export default ViewHtml;
