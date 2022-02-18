export const successEnum = {
  1: {text: '成功', status: 'Success'},
  0: {text: '失败', status: 'Error'},
};

export const statusEnum = {
  1: {text: '启用', status: 'Success'},
  0: {text: '停用', status: 'Error'},
};

export const yesNoEnum = {
  1: {text: '是', status: 'Success'},
  0: {text: '否', status: 'Default'},
};

export const yesNoTextEnum = {
  是: {
    text: '是',
    status: 'Success',
  },
  否: {
    text: '否',
    status: 'Default',
  },
};

//是否
export const yesNoOpinion = [{value: '是', label: '是'}, {value: '否', label: '否'}];
export const yesNoDigitOpinion = [{value: '1', label: '是'}, {value: '0', label: '否'}];
//信用等级
export const creditOpinion = [{value: '好', label: '好'}, {value: '一般', label: '一般'}, {
  value: '不合格',
  label: '不合格'
}, {value: '暂未评价', label: '暂未评价'}];
export const successOpinion = [{value: '1', label: '成功'}, {value: '0', label: '失败'}];
//地区
export const dqOpinion = [{value: '鞍山', label: '鞍山'}, {value: '弓长岭', label: '弓长岭'}];
//机构类型
export const deptTypeOpinion = [
  {value: '公司部门', label: '公司部门'},
  {value: '厂矿', label: '厂矿'},
  {value: '厂矿部门', label: '厂矿部门'},
  {value: '厂矿车间', label: '厂矿车间'}
];
