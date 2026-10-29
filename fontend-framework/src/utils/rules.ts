import { RuleObject } from 'ant-design-vue/es/form/interface';

// 手机号码 - 正则
export const PATTERN_PHONE = /^1[3-9]{1}\d{9}$/;

// IP - 正则
export const PATTERN_IP =
  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

// 密码 - 正则
export const PATTERN_PASSWORD =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\\/])+[a-zA-Z\d~!@#$%^&*()_+`\-={}:";'<>?,.\\/]{8,16}$/;

// 输入内容 - 正则 （字符必须为中文或英文或数字）
export const PATTERN_WORD_LETTER_NUMBER = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;

// 输入内容 - 正则 （字符必须为中文或英文或数字,中间可包含空格）
export const PATTERN_RD_LETTER_S_NUMBER =
  /^[a-zA-Z0-9\u4e00-\u9fa5]+[a-zA-Z0-9\u4e00-\u9fa5\s]*[a-zA-Z0-9\u4e00-\u9fa5]+$/;

// 输入内容 - 正则 （字符必须为英文或数字）
export const PATTERN_LETTER_NUMBER = /^[a-zA-Z0-9]+$/;

// 输入内容 - 正则 （字符必须为数字）
export const PATTERN_NUMBER = /^[0-9]+$/;

// 正则 （正整数）
export const PATTERN_POSITIVE_INTEGER_NUMBER = /^[1-9]\d*$/;

// 正则 （字母）
export const PATTERN_LETTER = /^[a-zA-Z]*$/;

// 正则 （小写字母）
export const PATTERN_LOWERCASE_LETTERS = /^[a-z]*$/;

// 正则 （邮箱）
export const PATTERN_EMAIL = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// rtsp 正则
export const PATTERN_RTSP_ONE =
  /^rtsp:\/\/([a-z]{0,10}:.{0,10}@)?(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
export const PATTERN_RTSP_TWO =
  /^rtsp:\/\/([a-z]{0,10}:.{0,10}@)?(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]):[0-9]{1,5}/;
export const PATTERN_RTSP_THREE =
  /^rtsp:\/\/([a-z]{0,10}:.{0,10}@)?(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\//;
export const PATTERN_RTSP_FOUR =
  /^rtsp:\/\/[0-9a-zA-Z]*:[0-9a-zA-Z]*@((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}:[0-9]*\/[a-zA-Z0-9]*/;

// 表单规则
export const RULE_8_16 = {
  min: 8,
  max: 16,
  message: '长度必须在8-16个字符以内',
};

export const RULE_8_16_NOMSG = {
  min: 8,
  max: 16,
  message: '',
};

export const RULE_2_30 = {
  min: 2,
  max: 30,
  message: '长度必须在2-30个字符以内',
};

export const RULE_1_30 = {
  min: 1,
  max: 30,
  message: '长度必须在1-30个字符以内',
};

export const RULE_2_30_NOMSG = {
  min: 2,
  max: 30,
  message: '',
};

export const RULE_2_50 = {
  min: 2,
  max: 50,
  message: '长度必须在2-50个字符以内',
};

export const RULE_1_200 = {
  min: 1,
  max: 200,
  message: '长度必须在1-200个字符以内',
};

export const RULE_2_255 = {
  min: 2,
  max: 255,
  message: '长度必须在2-255个字符以内',
};

// 表单校验 (字母)
export const RULE_LETTER = {
  pattern: PATTERN_LETTER,
  message: '字符必须为字母',
};

// 表单校验 （小写字母）
export const RULE_LOWERCASE_LETTERS = {
  pattern: PATTERN_LOWERCASE_LETTERS,
  message: '字符必须为小写字母',
};

// 表单校验 （正整数）
export const RULE_POSITIVE_INTEGER_NUMBER = {
  pattern: PATTERN_POSITIVE_INTEGER_NUMBER,
  message: '字符必须为正整数',
};

export const RULE_NUMBER = {
  pattern: PATTERN_NUMBER,
  message: '字符必须为数字',
};

// 表单校验 （密码）
export const RULE_PASSWORD = {
  pattern: PATTERN_PASSWORD,
  message: '密码必须包含字母、数字、特殊符号且在8-16位以内,不得输入空格',
};

export const RULE_WORD_LETTER_NUMBER = {
  pattern: PATTERN_WORD_LETTER_NUMBER,
  message: '字符必须为中文或英文或数字',
};

export const RULE_WORD_S_LETTER_NUMBER = {
  pattern: PATTERN_RD_LETTER_S_NUMBER,
  message: '字符必须为中文或英文或数字,中间可包含空格',
};

export const RULE_LETTER_NUMBER = {
  pattern: PATTERN_LETTER_NUMBER,
  message: '字符必须为英文或数字',
};

// 表单校验 （备注）
export const RULE_REMARK = {
  max: 50,
  message: '长度不得超过50个字符!',
};

// 表单校验 （邮箱）
export const RULE_EMAIL = {
  pattern: PATTERN_EMAIL,
  message: '请输入正确的邮箱!',
};

// 表单校验 （手机号）
export const RULE_PHONE = {
  pattern: PATTERN_PHONE,
  message: '请输入正确的手机号码!',
};

export const RULE_PASSWORD_NOMSG = {
  pattern: PATTERN_PASSWORD,
  message: '',
};

export const validatorRtsp = (_: RuleObject, value: string) => {
  if (!value) {
    return Promise.resolve();
  } else if (PATTERN_RTSP_ONE.test(value)) {
    return Promise.resolve();
  } else if (PATTERN_RTSP_TWO.test(value)) {
    return Promise.resolve();
  } else if (PATTERN_RTSP_THREE.test(value)) {
    return Promise.resolve();
  } else if (PATTERN_RTSP_FOUR.test(value)) {
    return Promise.resolve();
  } else {
    return Promise.reject('请输入合理的rstp');
  }
};

export const validatorWhiteSpace = async (_: RuleObject, value: string) => {
  if (!value) {
    return Promise.resolve();
  }
  if (typeof value === 'string' && value.indexOf(' ') !== -1) {
    return Promise.reject('不得输入空格');
  }
  return Promise.resolve();
};

export const validatorWhiteSpaceNoMsg = async (_: RuleObject, value: string) => {
  if (!value) {
    return Promise.resolve();
  }
  if (value.indexOf(' ') !== -1) {
    return Promise.reject('');
  }
  return Promise.resolve();
};

export const Legal_noWhiteSpace = {
  validator: validatorWhiteSpace,
};

export const Legal_noWhiteSpace_noMsg = {
  validator: validatorWhiteSpaceNoMsg,
};

export const Legal_IP = {
  pattern: PATTERN_IP,
  message: '请输入正确的ip地址',
};

export const Legal_Phone = {
  pattern: PATTERN_PHONE,
  message: '请输入合理的11位数字',
};

export const Legal_RTSP = {
  validator: validatorRtsp,
};
