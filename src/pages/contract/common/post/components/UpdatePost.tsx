import React, {useEffect, useState} from 'react';
import ProForm, {ProFormDigit, ProFormSelect, ProFormText} from '@ant-design/pro-form';
import {Drawer, message, Skeleton} from 'antd';
import {insertPost, loadPost, updatePost} from '@/services/contract/common/post';
import 'antd/dist/antd.min.css';
import {yesNoDigitOpinion} from "@/utils/enum";

const UpdatePost = (props: any) => {
  const [formObj] = ProForm.useForm();// 定义Form实例, 用来操作表单
  const {isPostModalVisible} = props; // 模态框是否显示
  const {isShowPostModal} = props; // 操作模态框显示隐藏的方法
  const {editId} = props;
  const {treeKey} = props;
  const {title} = props;
  const type = editId == '' ? '新增' : '修改';
  const [initialValues, setInitialValues] = useState(undefined);

  // @ts-ignore
  useEffect(async () => {
    if (editId != '') {
      const rep = await loadPost({I_ID: editId});
      setInitialValues({...rep.data});
    } else {
      formObj.setFieldsValue({V_ISADMIN: '0'});
      formObj.setFieldsValue({I_ORDER: 1});
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
      rep = await insertPost({...values, V_POSTCODE_UP: treeKey});
    } else {
      rep = await updatePost({...values, I_ID: editId});
    }

    if (rep && rep.success) {
      isShowPostModal(false, true);
      message.success(`${type}成功`)
    }
  };

  return (
    <Drawer
      title={`${type}岗位`}
      visible={isPostModalVisible} //设置显示或隐藏
      onClose={() => isShowPostModal(false, false)} //取消/关闭触发
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
              label="上级岗位"
            />
            <ProFormText
              name="V_POSTCODE"
              label="岗位编码"
              placeholder="请输入岗位编码"
              rules={[
                {
                  required: true,
                  message: '岗位编码为必填项'
                }
              ]}
            />
            <ProFormText
              name="V_POSTNAME"
              label="岗位名称"
              placeholder="请输入岗位名称"
              rules={[
                {
                  required: true,
                  message: '岗位名称为必填项'
                }
              ]}
            />
            <ProFormSelect
              options={yesNoDigitOpinion}
              name="V_ISADMIN"
              label="是否为管理员"
            />
            <ProFormDigit
              name="I_ORDER"
              label="显示顺序"
              min={1}
              //max={99999}
              fieldProps={{precision: 0}}// 小数位数
              rules={[
                {
                  required: false,
                  message: '显示顺序为必填项'
                }
              ]}
            />
          </ProForm>
        )
      }
    </Drawer>
  );
};
export default UpdatePost;
