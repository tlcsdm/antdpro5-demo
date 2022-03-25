import React, {useEffect, useState} from 'react';
import {Drawer} from 'antd';
import 'antd/dist/antd.min.css';
import {loadContract,} from "@/services/contract/common/contractPreparation";
import ProDescriptions from "@ant-design/pro-descriptions";
import {pdfjs} from 'react-pdf'
import ViewPdf from "@/components/View/ViewPdf";
import Cookies from "js-cookie";

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const ViewApprovalContract = (props: any) => {
  const {isModalVisible, isShowModal, contractId} = props; // 模态框是否显示
  const [contract, setContract] = useState(undefined);
  const [path, setPath] = useState('');

  const handleCancel = () => {
    isShowModal(false);
  };

  //修改时初始化数据
  const initContract = async () => {
    const response = await loadContract({I_ID: contractId});
    setContract({...response.data});
    setPath('/api/contract-system/loadContractFilePdf?V_GUID=' + contractId + '&V_PERCODE=' + Cookies.get('V_PERCODE'));
  };

  //初始化
  useEffect(() => {
    initContract();
  }, []);

  return (
    <Drawer
      title={'合同查看'}
      width={0.9 * document.body.clientWidth}
      visible={isModalVisible}
      onClose={handleCancel}
    >
      <ProDescriptions
        title="合同详情信息"
        column={3}
        bordered
        dataSource={contract}
        columns={[
          {
            title: '项目编号',
            dataIndex: 'V_PROJECTCODE',
          }, {
            title: '项目名称',
            dataIndex: 'V_PROJECTNAME'
          }, {
            title: '合同模版',
            dataIndex: 'V_TEMPLATE',
          }, {
            title: '定制方',
            dataIndex: 'V_SPONSORNAME',
          }, {
            title: '承揽方',
            dataIndex: 'V_CONTRACTORNAME',
          }, {
            title: '金额(元)',
            dataIndex: 'V_MONEY',
            valueType: 'money'
          }, {
            title: '履行起始时间',
            dataIndex: 'V_STARTDATE',
            valueType: 'date'
          }, {
            title: '履行终止时间',
            dataIndex: 'V_ENDDATE',
            valueType: 'date'
          }, {
            title: '计划年份',
            dataIndex: 'V_YEAR',
            valueType: 'dateYear'
          }, {
            title: '合同份数',
            dataIndex: 'I_COPIES',
          }, {
            title: '签审份数',
            dataIndex: 'I_REVIEWCOPIES',
          }, {
            title: '合同编码',
            dataIndex: 'V_CONTRACTCODE',
          }, {
            title: '合同类型',
            dataIndex: 'V_ACCORDANCE',
          }, {
            title: '所属专业',
            dataIndex: 'V_MAJOR',
          }
        ]}
      >
      </ProDescriptions>
      <ViewPdf
        path={path}
        print={'false'}
      />
    </Drawer>
  );
};
export default ViewApprovalContract;
