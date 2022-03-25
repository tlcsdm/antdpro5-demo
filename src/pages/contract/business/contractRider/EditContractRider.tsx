import 'antd/dist/antd.min.css';
import {Button, Divider, message, Popconfirm, Table} from 'antd';
import React, {useEffect, useState} from "react";
import {
  deleteContractRider,
  downloadContractRider,
  downloadContractRiderByGuid,
  selectContractRider
} from "@/services/contract/business/contractRider";
import {ModalForm} from '@ant-design/pro-form';

const EditContractRider = (props: any) => {
  const {isContractRiderModalVisible, isShowContractRiderModal, riderGuid, type} = props;
  const [dataSource, setDataSource] = useState([]); //数据源
  const [guid, setGuid] = useState(undefined);

  const onSelectContractRider = async (id: any) => {
    const response = await selectContractRider({V_GUID: id});
    setDataSource(response.data);
  };

  //初始化
  useEffect(() => {
    onSelectContractRider(riderGuid);
    setGuid(riderGuid);
  }, []);

  //删除
  const handleRemove = async (id: any, filePath: any) => {
    const hide = message.loading('正在删除');
    if (!id) return true;
    try {
      await deleteContractRider({I_ID: id, V_FILEPATH: filePath});
      hide();
      message.success('删除成功，即将刷新');
      onSelectContractRider(guid);
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  };

  //下载
  const downloadRider = async (id: any, filePath: any, fileName: any) => {
    downloadContractRider({
      I_ID: id,
      V_FILEPATH: filePath,
      V_FILENAME: fileName
    });
  };

  //批量下载
  const downloadBatchRider = async () => {
    downloadContractRiderByGuid({
      V_GUID: guid,
    });
  };

  const columns = [
    {
      title: '附件名',
      dataIndex: 'V_FILENAME',
      width: 250,
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'I_ID',
      width: 150,
      hideInSearch: true,
      valueType: 'option',
      render: (_: any, record: any) => [
        <>
          <a key={record.I_ID} onClick={() => downloadRider(record.I_ID, record.V_FILEPATH, record.V_FILENAME)}>下载</a>
          {(type === '管理') &&
          (<>
              <Divider type="vertical" style={{display: ((type === '管理') ? 'inline' : 'none')}}/>
              <Popconfirm key={record.I_ID} title="确认删除？" okText="确认" cancelText="取消" onConfirm={() => {
                handleRemove(record.I_ID, record.V_FILEPATH)
              }}>
                <a href="#">删除</a>
              </Popconfirm>
            </>
          )}
        </>
      ],
    }
  ];

  return (
    <ModalForm
      title={type + "合同附件"}
      width="800px"
      visible={isContractRiderModalVisible} //显示或隐藏
      onVisibleChange={isShowContractRiderModal} //设置显示或隐藏
      submitter={{
        submitButtonProps: {
          style: {
            display: 'none',
          },
        },
        render: (props, defaultDoms) => {
          return [
            ...defaultDoms,
            <Button
              key="批量下载"
              type={"primary"}
              disabled={dataSource.length === 0}
              onClick={async () => {
                downloadBatchRider();
              }}
            >
              批量下载
            </Button>,
          ];
        }
      }}
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey='I_ID'
        pagination={false}
      />

    </ModalForm>
  );
};
export default EditContractRider;
