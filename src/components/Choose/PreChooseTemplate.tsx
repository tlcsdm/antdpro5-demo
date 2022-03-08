import React, {useEffect, useRef, useState} from 'react';
import 'moment/locale/zh-cn'
import Modal from "antd/es/modal/Modal";
import {Button, Table} from "antd";
import ProTable, {ActionType} from "@ant-design/pro-table";
import {selectTemplateAndType} from "@/services/contract/common/contractPreparation";
import {TableListItem} from '@/utils/tableType';
import {ProColumns} from "@ant-design/pro-table/es/typing";

let rowList: any[] = [];  //选中的行
let contractTemplateList: any = {};  //合同范本数据
let keyList: any = [];  //展开行的所有key值
let templateList: any = [];  //查询数据返回值
let nestedFieldData: any = [];  //嵌套表格字段
let nestedData: any[] = [];  //嵌套表格数据
let nestedField: any = {};  //嵌套表格字段集合
let nestedFieldTemp: any[] = [];  //嵌套表格字段集合临时存储
let flag: any = true;  //是否加载表格

/* React.FC<>的在typescript使用的一个泛型，FC就是FunctionComponent的缩写，是函数组件，在这个泛型里面可以使用useState */
const PreChooseTemplate = (props: any) => {
  const {isTemplateModalVisible, isShowTemplateModal, setTemplate} = props;
  const [defaultCode, setDefaultCode] = useState(undefined); //默认展开key
  const formRef = useRef();
  const actionRef = useRef<ActionType>();

  const handleCancel = () => {
    isShowTemplateModal(false);
  };

  //useEffect参数为空数组时仅初始化执行一次
  useEffect(() => {
    onSelectTemplate();
  }, []);


  //查询合同范本
  const [outerData, setOuterData] = useState([]); //返回的所有外层数据
  const onSelectTemplate = () => {
    // 这里异步请求后台将数据拿到
    selectTemplateAndType({}).then(function (val) {
      if (val.data != '' && val.data != null) {
        templateList = val.data;
        extendedTableData(templateList); //嵌套表格拼接
      } else {
        flag = false;
      }
    })
  };

  //嵌套表格拼接
  let outData: any = [];  //外部表头数据
  const extendedTableData = async (data: any[]) => {
    keyList = [];  //清空数组
    setOuterData([]);
    // @ts-ignore
    if (data == '' || data == null) {
      flag = false;
    }
    outData = [];
    if (data.length > 0) {
      outData.push({'V_TYPENAME': 0});//添加第一条数据(合同范本类型)
      //循环得到合同范本类型
      for (let i = 0; i < data.length; i++) {
        flag = false;
        let num = 0;
        const tempTemplateCode = data[i].V_TYPENAME; //当前合同范本类型
        for (let k = 0; k < data.length; k++) {//遍历得到数组项个数
          if (data[k].V_TYPENAME == tempTemplateCode) {
            num++;
          }
        }

        for (let j = 0; j < outData.length; j++) {  //判断outData里是否存在当前合同范本类型
          if (tempTemplateCode != outData[j].V_TYPENAME) {
            flag = true;
          } else {
            flag = false;
            break;
          }
        }

        if (flag) {//拼接外层表格数据
          outData.push({
            'V_TYPENAME': tempTemplateCode,
            'V_NAME': '合同范本:' + '【' + data[i].V_TYPENAME + '】' + '(' + num + ')' + '项'
          });
        }

      }

      outData.shift();//移除数组第一项
      setOuterData(outData);
      let nestedTempData: any[] = [];  //嵌套表格临时数据存储
      nestedFieldData = [];
      //获得所有嵌套表格数据
      for (let q = 0; q < outData.length; q++) {
        contractTemplateList[outData[q].V_TYPENAME] = q;
        nestedTempData = [];
        keyList.push(outData[q].V_TYPENAME);
        for (let p = 0; p < data.length; p++) {
          // @ts-ignore
          if (outData[q].V_TYPENAME == data[p].V_TYPENAME) {
            nestedTempData.push(data[p]);
          }
        }
        nestedData.push(nestedTempData);
      }
      setDefaultCode(keyList);
      let x = 1; //序号
      //嵌套表格循环对应数据
      for (let m = 0; m < nestedData.length; m++) {
        nestedFieldTemp = [];
        for (let n = 0; n < nestedData[m].length; n++) {
          nestedField = [];
          nestedField = {
            index: x++,
            I_ID: nestedData[m][n].I_ID,
            V_NAME: nestedData[m][n].V_NAME,
          };
          nestedFieldTemp.push(nestedField);
        }
        nestedFieldData.push(nestedFieldTemp);
        flag = false;  //允许加载表格
      }
    } else {
      flag = false;
    }
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'RN',
      valueType: 'select',
      width: 50,
      hideInSearch: true
    }, {
      title: '合同范本',
      dataIndex: 'V_NAME',
      hideInSearch: true,
      width: 300,
      render: (text, row, index) => {
        return {
          children: text,
          props: {colSpan: 5}
        }
      }
    }];


  //嵌套子表Table
  const expandedRowRender = (item: any) => {
    let columns = [
      {
        dataIndex: 'index',
        width: 60
      },
      {
        dataIndex: 'I_ID',
        hidden: true,
        width: 0.00001,
        render: () => {
          return {attrs: {colSpan: 0}}
        }
      }, {
        dataIndex: 'V_NAME',
        width: 300,
      }];
    let nestedTableData = [];
    if (nestedFieldData[contractTemplateList[item.V_TYPENAME]]) {//如果合同范本类型相同,循环加载dataSource数据
      for (let i = 0; i < nestedFieldData[contractTemplateList[item.V_TYPENAME]].length; i++) {
        nestedTableData.push(nestedFieldData[contractTemplateList[item.V_TYPENAME]][i]);
      }
    }
    return <Table columns={columns} rowKey="index" showHeader={false}
                  style={{fontWeight: "lighter", overflow: 'hidden'}}
                  dataSource={nestedTableData} pagination={false}
                  rowSelection={{
                    type: 'radio',
                    onSelect: (record: any, selected: any) => {
                      if (selected) {
                        rowList.push(record);
                      } else {
                        for (let i = 0; i < rowList.length; i++) {
                          if (record.I_ID == rowList[i].I_ID) {
                            rowList.splice(i, 1);
                          }
                        }
                      }
                      setTemplate(record);
                      handleCancel();
                    },
                  }}/>;
  };

  return (
    // 布局标签
    <Modal
      title={'选择合同范本'}
      width="1000px"
      visible={isTemplateModalVisible}
      onCancel={handleCancel}
      footer={[<Button key="close" type="primary" onClick={handleCancel}>关闭</Button>,]}
    >
      <ProTable<TableListItem>
        tableStyle={{height: '600px', overflowX: 'scroll', fontWeight: 'bolder'}}
        columnEmptyText={false}//空值不显示（-）
        columns={columns}
        dataSource={outerData}
        actionRef={actionRef}  // 用于触发刷新操作等
        formRef={formRef}
        search={false}
        // @ts-ignore
        request={async (params: any) => {
          const newParams = {};
          Object.assign(newParams, params);
          const response = await selectTemplateAndType({...newParams});
          templateList = response.data;
          await extendedTableData(templateList);
        }}
        rowKey="V_TYPENAME"
        pagination={false}
        manualRequest={true}
        expandable={{expandedRowRender}}  //嵌套子表Table
        expandedRowRender={record => expandedRowRender(record)}
        dateFormatter="string"
        //headerTitle="合同范本列表"
        options={false}
        defaultExpandedRowKeys={keyList}
        expandedRowKeys={defaultCode}
        onExpand={(expanded: boolean, record: TableListItem) => { //展开子表
          if (expanded) {   //展开
            keyList.push((record as any).V_TYPENAME);
            setDefaultCode(keyList);
          } else {
            keyList = keyList.filter((v: any) => {
              return v !== (record as any).V_TYPENAME;
            });
            setDefaultCode(keyList);
          }
        }}

      />
    </Modal>
  );
};

export default PreChooseTemplate;
