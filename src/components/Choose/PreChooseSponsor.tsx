import React, {useEffect} from 'react';
import 'moment/locale/zh-cn'
import Modal from "antd/es/modal/Modal";
import ProList from '@ant-design/pro-list';
import {selectSponsor} from "@/services/contract/business/sponsor";
import {Button} from "antd";

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const PreChooseSponsor = (props: any) => {
  const {isSponsorModalVisible} = props; // 模态框是否显示
  const {isShowSponsorModal} = props; // 操作模态框显示隐藏的方法
  const {setSponsor} = props;

  const handleCancel = () => {
    isShowSponsorModal(false);
  };

  //useEffect参数为空数组时仅初始化执行一次
  useEffect(() => {

  }, []);

  return (
    // 布局标签
    <Modal
      title={'选择定作方'}
      width="1000px"
      visible={isSponsorModalVisible}
      onCancel={handleCancel}
      footer={[<Button key="close" type="primary" onClick={handleCancel}>关闭</Button>,]}
    >
      <ProList<any>
        search={{}}
        rowKey="I_ID"
        split={true}
        headerTitle="定作方列表"
        grid={{column: 3}}
        request={async (params) => {   //调用请求加载表格数据， 默认自动加载 params为Search的查询条件参数
          const newParams = {};
          //可对params传参进行进一步处理后再调用查询
          Object.assign(newParams, params);
          return await selectSponsor({...newParams, V_STATUS: '1'});
        }}
        onItem={(record: any) => {
          return {
            onClick: () => {
              setSponsor(record);
              handleCancel();
            },
          };
        }}
        pagination={false}
        showActions="hover"
        metas={{
          title: {
            dataIndex: 'V_SPONSORNAME',
            title: '定作方名称',
          }
        }}
      />
    </Modal>
  );
};

export default PreChooseSponsor;
