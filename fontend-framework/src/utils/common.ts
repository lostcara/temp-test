import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';

/**
 * 产生 UUID
 * @returns uuid
 */
export const createUUID = () => {
  return uuidv4();
};

/**
 * 对比两个内容是否全等
 * @param origin 旧数据
 * @param current 新数据
 * @returns true | false
 */
export const isEqual = (origin: any, current: any) => {
  if (origin === current) {
    return true;
  }
  return false;
};

/**
 * 检查图片是否有效
 * @param url 图片地址
 * @returns promise
 */
export const checkImageExists = (url: string) => {
  return new Promise((resolve, reject) => {
    const imgObj: HTMLImageElement = new Image();
    imgObj.src = url;
    imgObj.onload = (res) => {
      resolve(res);
    };
    imgObj.onerror = (err) => {
      reject(err);
    };
  });
};

/**
 * 判断类型为数字类型
 * @param value 数据
 * @returns boolean
 */
export const typeofNumber = (value: any) => {
  return typeof value === 'number';
};

/**
 * 判断类型为字符串类型
 * @param value 数据
 * @returns boolean
 */
export const typeofString = (value: any) => {
  return typeof value === 'string';
};

/**
 * 判断类型为布尔类型
 * @param value 数据
 * @returns boolean
 */
export const typeofBoolean = (value: any) => {
  return typeof value === 'boolean';
};

/**
 * 判断类型为undefined
 * @param value 数据
 * @returns boolean
 */
export const typeofUndefined = (value: any) => {
  return typeof value === 'undefined';
};

/**
 * 判断类型为函数
 * @param value 数据
 * @returns boolean
 */
export const typeofFunction = (value: any) => {
  return typeof value === 'function';
};

/**
 * 判断类型为数组
 * @param value 数据
 * @returns boolean
 */
export const typeofArray = (value: any) => {
  return value && value instanceof Array;
};

/**
 * 判断类型为对象
 * @param value 数据
 * @returns boolean
 */
export const typeofObject = (value: any) => {
  return value && value instanceof Object;
};

/**
 * 判断类型为null
 * @param value 数据
 * @returns boolean
 */
export const typeofNull = (value: any) => {
  // return Object.prototype.toString.call(value).match(/^\[object (.+)\]$/)[1].toLowerCase() === 'NULL';
  return value === null;
};

/**
 * 判断数据是否为null,undefined,空字符串，空数组,空对象
 * @param value 数据
 * @returns booleam
 */
export const isEmpty = (value: any) => {
  if (typeofNull(value)) {
    return true;
  } else if (typeofUndefined(value)) {
    return true;
  } else if (value === '') {
    return true;
  } else if (typeofObject(value) && Object.keys(value).length === 0) {
    return true;
  } else if (typeofArray(value) && value.length === 0) {
    return true;
  }
  return false;
};

/**
 * 判断数据不为null,undefined,空字符串，空数组,空对象
 * @param value 数据
 * @returns booleam
 */
export const isNotEmpty = (value: any) => {
  return !isEmpty(value);
};

/**
 * 图片文件转Base64
 * @param file 图片文件
 * @returns promise
 */
export const convertImageFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject();
    };
  });
};

/**
 * 获取文本文件内容
 * @param file 文本类型文件
 * @returns text
 */
export const readFileText = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = function () {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject();
    };
  });
};

/**
 * 将json写入文件并下载文件
 * @param jsonStr json
 */
export const writeJSONToFile = (jsonStr: string, fileName = 'data') => {
  // 创建Blob对象
  const blob = new Blob([jsonStr], { type: "application/json" });
  // 创建临时URL
  const url = URL.createObjectURL(blob);
  // 创建一个链接元素
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}_${Date.now()}.json`;
  // 模拟点击下载链接
  link.click();
  // 释放临时URL资源
  URL.revokeObjectURL(url);
};

/**
 * 防抖
 * @param fn 需要防抖事件
 */
export const debounce = (fn:any, delay: number = 200) => {
  let timer: any;
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      return fn(...args);
    }, delay);
  };
};

/**
 * 节流
 * @param fn 需要节流事件
 */
export const throttle = (fn: any, delay: number = 200) => {
  let startTime = Date.now();
  return (...args: any[]) => {
    const curTime = Date.now();
    const interval = delay - (curTime - startTime);
    if (interval <= 0) {
      startTime = Date.now();
      return fn(...args);
    }
  };
};

/**
 * 过滤选项
 * @param input 输入内容
 * @param option 选项
 * @returns 选中过滤值
 */
export const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

/**
 * 比较两个对象或者数组是否相同
 * @param obj1 对象或数组
 * @param obj2 对象或数组
 * @returns boolean
 */
export const isEqualOfObject = (obj1: any, obj2: any) => {
  // 如果两个对象引用相同，则它们相等
  if (obj1 === obj2) return true;

  // 如果类型不同，则它们不相等
  if (typeof obj1 !== typeof obj2) return false;

  // 如果其中一个是 null，则它们相等（因为 null === null）
  if (obj1 === null || obj2 === null) return obj1 === obj2;

  // 如果其中一个是基本类型且值相同，则它们相等
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
      return obj1 === obj2;
  }

  // 如果对象的键数量不同，则它们不相等
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  // 递归地检查每个属性或元素是否相等
  for (const key of keys1) {
      if (!isEqual(obj1[key], obj2[key])) return false;
  }

  return true;
};

/**
 * 获取图片文件通过地址
 * @param imagePath 图片地址
 * @param fileName 图片名
 * @returns 图片文件
 */
export const fetchImageAsFile = (imagePath: string, fileName: string) => {
  return fetch(imagePath)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.blob();
    })
    .then(blob => {
      return new File([blob], fileName, { type: 'image/jpeg' }); // 假设图片是jpeg格式
    });
};

/**
 * 通过 value 找到对应的 attr
 * @param value value
 * @param options 选项
 * @param attr 属性
 * @returns 数据
 */
export const showOptionsOfAttr = (value: string, options: any, attr: string) => {
  return options && options.find((k: any) => k.value === value)?.[attr];
};

/**
 * 从原始数组中过滤出对应的键值
 * @param group 原始数组
 * @param key 键
 * @param value 值
 * @returns 数组
 */
export const filterKeyValueInArray = (group: any[], key: string, value: string) => {
  return group.filter((k: any) => k[key] === value);
};

export const displayRender = ({ labels }: { labels: string[] }) => {
  return labels[labels.length - 1];
};

export const filter = (inputValue: string, path: any[]) => {
  return path.some((option) => option.label.indexOf(inputValue) > -1);
};

/**
 * 判断当前用户是否有权限
 * @param value 权限参数
 */
// export const devidePermissions = (value: string[]) => {
//   const permissions = store.getters['user/permissions'];
//   if (value && value instanceof Array && value.length > 0) {
//     const permissionFlag = value;

//     const hasPermissions = permissions.some((permission) => {
//       return PERMISSIONS_OF_ADMIN === permission || permissionFlag.includes(permission);
//     });

//     return hasPermissions;
//   } else {
//     message.error('请设置操作权限标签值');
//     return false;
//   }
// };

/**
 * 将扁平数据转化为树形数组
 * @param group 扁平数组
 * @param key key
 * @param parentKey 父key
 * @returns 树形数组
 */
export const changeAryToTreeAry = (group: any[], key = 'id', parentKey = 'parentId') => {
  const rootItems = [];
  const lookup: any = {};

  for (const item of group) {
    const itemId = item[key];
    const parentId = item[parentKey];

    if (!lookup[itemId]) {
      lookup[itemId] = { ['children']: [] };
    };
    lookup[itemId] = { ...item, children: lookup[itemId]['children'] };

    const parent = parentId ? lookup[parentId] : null;
    if (parent) {
      if (!parent.children) {
        parent.children = [];
      };
      parent.children.push(lookup[itemId]);
    } else {
      rootItems.push(lookup[itemId]);
    }
  }

  // 递归函数，用于清理空的children属性
  function cleanEmptyChildren(node: any) {
    if (node.children && node.children.length === 0) {
      delete node.children;
    } else {
      for (const child of node.children) {
        cleanEmptyChildren(child);
      }
    }
  }

  // 清理所有根节点的子树中的空children属性
  for (const rootItem of rootItems) {
    cleanEmptyChildren(rootItem);
  }

  return rootItems;
};

/**
 * 将树形数组扁平化
 * @param tree 树形数组
 * @returns 扁平数组
 */
export const flattenTree = (tree: any[]) => {
  const result: any = []; // 用于存储扁平化后的节点
  
  // 递归函数，用于遍历树的节点
  function traverse(node: any) {
    if (node) {
      // 将当前节点添加到结果数组中
      result.push(node);
      
      // 如果节点有子节点，则递归遍历子节点
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(traverse);
      }
    }
  }
  
  // 遍历树的根节点（或每个根节点，如果树是一个森林）
  tree.forEach(traverse);
  
  return result;
};

/**
 * 通过value获取树形数组中的父元素id
 * @param key value
 * @param tree 树形数组
 * @param attr 匹配属性
 * @returns 父元素id
 */
export const getParentKeyWithAttr = (
  key: string | number,
  tree: any[],
  attr: string
): string | number | undefined => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: any) => item[attr] === key)) {
        parentKey = node[attr];
      } else if (getParentKeyWithAttr(key, node.children, attr)) {
        parentKey = getParentKeyWithAttr(key, node.children, attr);
      }
    }
  }
  return parentKey;
};

/**
 * 通过id获取树形数组中所有的父元素id
 * @param tree 树形数组
 * @param targetId 目标值
 * @param key 匹配属性
 * @param parentKey 父 匹配元素
 * @returns 所有父元素id
 */
export const findAncestorKeysInTreeAry = (tree: any[], targetId: string, key = 'id', parentKey = 'parentId'): any[] => {
  // 辅助函数，用于在树形结构中递归查找父节点
  function findParents(node: any) {
    const parentIds: any[] = [];

    // 如果当前节点有父节点ID（即不是根节点）
    if (node[parentKey] !== null && node[parentKey] !== undefined && node[parentKey] !== targetId) {
      // 将父节点ID添加到数组中
      parentIds.push(node[parentKey]);

      // 递归查找父节点的父节点
      const parentNode = tree.find(parentNode => parentNode[key] === node[parentKey]);
      if (parentNode) {
        // 将父节点的父节点ID添加到数组中（如果存在）
        parentIds.push(...findParents(parentNode));
      }
    }

    return parentIds;
  }

  // 在树形结构中查找目标节点
  const targetNode = tree.find(node => node[key] === targetId);

  // 如果找到了目标节点，则查找它的所有父节点ID
  if (targetNode) {
    return [targetNode[key], ...findParents(targetNode)];
  } else {
    // 如果没有找到目标节点，返回一个空数组
    return [];
  }
};

// 验证是否为blob格式
export const blobValidate = (data: any) => {
  return data.type !== 'application/json';
};

/**
 * 下载文件
 * @param filestream blob文件流
 */
export const downloadFile = (filestream: any, fileName: string) => {
  const isBlob = blobValidate(filestream);
  if (isBlob) {
    const blob = new Blob([filestream]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = decodeURI(fileName); // fileName 是你想要的文件名
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); // 下载完成后移除元素
  }
};

/**
 * 导出数据为 Excel 文件
 * @param data 要导出的数据数组
 * @param columns 列配置 [{ title: '列名', dataIndex: '字段名' }]
 * @param fileName 文件名（不含扩展名）
 */
export const exportToExcel = (
  data: any[],
  columns: Array<{ title: string; dataIndex: string }>,
  fileName: string = '导出数据',
) => {
  try {
    // 准备表头
    const headers = columns.map((col) => col.title);

    // 准备数据行
    const rows = data.map((item) => {
      return columns.map((col) => {
        const value = item[col.dataIndex];
        // 处理空值
        if (value === null || value === undefined) {
          return '';
        }
        // 处理对象和数组
        if (typeof value === 'object') {
          return JSON.stringify(value);
        }
        return value;
      });
    });

    // 创建工作簿
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // 设置列宽
    const colWidths = columns.map(() => ({ wch: 20 }));
    worksheet['!cols'] = colWidths;

    // 创建工作簿并添加工作表
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // 导出文件
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  } catch (error) {
    console.error('导出 Excel 失败:', error);
    throw error;
  }
};
