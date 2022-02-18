import {Button} from 'antd';
import React, {useEffect} from 'react';
import 'moment/locale/zh-cn'
import Modal from "antd/es/modal/Modal";
import {selectDictionary} from "@/services/contract/common/dictionary";
import ProList from "@ant-design/pro-list";

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const PreChooseDictionary = (props: any) => {
  const {isDictionaryModalVisible} = props; // 模态框是否显示
  const {isShowDictionaryModal} = props; // 操作模态框显示隐藏的方法
  const {setDictionary} = props;
  const {dictionaryType} = props;

  const handleCancel = () => {
    isShowDictionaryModal(false);
  };

  //useEffect参数为空数组时仅初始化执行一次
  useEffect(() => {

  }, []);

  return (
    // 布局标签
    <Modal
      title={`选择${dictionaryType}`}
      width="1000px"
      visible={isDictionaryModalVisible}
      footer={[<Button key="close" type="primary" onClick={handleCancel}>关闭</Button>,]}
      onCancel={handleCancel}
    >
      <ProList<any>
        search={{}}
        rowKey="I_ID"
        split={true}
        headerTitle={false}
        grid={{column: 3}}
        request={async (params) => {   //调用请求加载表格数据， 默认自动加载 params为Search的查询条件参数
          const newParams = {};
          //可对params传参进行进一步处理后再调用查询
          Object.assign(newParams, params);
          return await selectDictionary({...newParams, V_DICTIONARYTYPE: dictionaryType});
        }}
        onItem={(record: any) => {
          return {
            onClick: () => {
              setDictionary(record);
              handleCancel();
            },
          };
        }}
        pagination={false}
        showActions="hover"
        metas={{
          title: {
            dataIndex: 'V_NAME',
            title: `${dictionaryType}`,
          }
        }}
      />
    </Modal>
  );
};

export default PreChooseDictionary;
