import React, { useState } from 'react';
import { Modal } from 'antd';

class DialogCustom extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      isOpen: props.visible
    }
  }

  close=()=>{
    this.setState({
      isOpen: false
    })
  }

  render() {

    return (
      <>
        <Modal title="Basic Modal" visible={this.state.isOpen} footer={null} maskClosable={true} 
        onCancel={this.close} >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </>
    );

  }

}

export default DialogCustom;
