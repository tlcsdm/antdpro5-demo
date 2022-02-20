import React, {useEffect, useState} from 'react';
import ProForm, {ProFormSelect, ProFormText} from '@ant-design/pro-form';
import {Drawer, message, Skeleton} from 'antd';
import {insertDept, loadDept, updateDept} from '@/services/contract/common/dept';
import 'antd/dist/antd.min.css';
import {deptTypeOpinion, dqOpinion, yesNoOpinion} from "@/utils/enum";

const UpdateDept = (props: any) => {
  const [formObj] = ProForm.useForm();// 定义Form实例, 用来操作表单
  const {isDeptModalVisible, isShowDeptModal, editId, treeKey, title} = props;
  const type = editId == '' ? '新增' : '修改';
  const [initialValues, setInitialValues] = useState(undefined);

  // @ts-ignore
  useEffect(async () => {
    if (editId != '') {
      const rep = await loadDept({I_ID: editId});
      setInitialValues({...rep.data});
    } else {
      formObj.setFieldsValue({V_PRODUCE: '否'});
      formObj.setFieldsValue({V_DQ: '鞍山'});
      formObj.setFieldsValue({V_DLFR: '正常'});
      formObj.setFieldsValue({V_DEPTTYPE: '公司部门'});
    }
    formObj.setFieldsValue({menuSuperName: title});
  }, []);

  /**
   * 提交表单, 执行编辑或者添加
   *
   * @param values
   * @returns {Promise<void>}
   */
  const handleSubmit = async (values: any) => {
    let rep;
    if (editId == '') {
      rep = await insertDept({...values, V_DEPTCODE_UP: treeKey});
    } else {
      rep = await updateDept({...values, I_ID: editId});
    }

    if (rep && rep.success) {
      isShowDeptModal(false, true);
      message.success(`${type}成功`)
    }
  };

  return (
    <Drawer
      title={`${type}组织机构`}
      visible={isDeptModalVisible} //设置显示或隐藏
      onClose={() => isShowDeptModal(false, false)} //取消/关闭触发
      width={746}
      destroyOnClose={true} //关闭时销毁 Modal 里的子元素
    >
      {
        // 只有是编辑的情况下, 并且要显示的数据还没有返回, 才显示骨架屏
        initialValues === undefined && editId !== '' ? (
          <Skeleton active={true} paragraph={{rows: 4}}/>
        ) : (
          <ProForm
            form={formObj}
            initialValues={initialValues}
            onFinish={(values) => handleSubmit(values)}
          >
            <ProFormText
              readonly={true}
              name="menuSuperName"
              label="上级组织机构"
            />
            <ProFormText
              name="V_DEPTCODE"
              label="组织机构编码"
              placeholder="请输入组织机构编码"
              disabled={editId}
              rules={[
                {
                  required: true,
                  message: '组织机构编码为必填项'
                }
              ]}
            />
            <ProFormText
              name="V_DEPTNAME"
              label="组织机构名称"
              placeholder="请输入组织机构名称"
              rules={[
                {
                  required: true,
                  message: '组织机构名称为必填项'
                }
              ]}
            />
            <ProFormText
              name="V_DEPTNAME_FULL"
              label="组织机构全称"
              rules={[
                {
                  required: true,
                  message: '组织机构全称为必填项'
                }
              ]}
            />
            <ProFormSelect
              options={deptTypeOpinion}
              name="V_DEPTTYPE"
              label="组织机构类型"
            />
            <ProFormSelect
              options={yesNoOpinion}
              name="V_PRODUCE"
              label="是否主体生产单位"
            />
            <ProFormText
              name="V_DLFR"
              label="单位性质"
            />
            <ProFormSelect
              options={dqOpinion}
              name="V_DQ"
              label="地区"
            />
          </ProForm>
        )
      }
    </Drawer>
  );
};
export default UpdateDept;
