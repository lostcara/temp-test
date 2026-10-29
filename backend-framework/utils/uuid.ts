/**
 * 生成 16 位随机字符串 UUID
 * @returns 16 位随机字符串
 */
export const generateShortUUID = (): string => {
  // 使用时间戳 + 随机字符生成 16 位 UUID
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  
  // 前 8 位：时间戳的后 8 位（转换为 62 进制）
  const timestamp = Date.now().toString(36).slice(-8);
  result += timestamp.padStart(8, '0');
  
  // 后 8 位：随机字符
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result.slice(0, 16);
};

/**
 * 验证是否为有效的 16 位 UUID
 * @param id 要验证的 ID
 * @returns 是否为有效的 UUID
 */
export const isValidShortUUID = (id: string): boolean => {
  return typeof id === 'string' && id.length === 16 && /^[0-9a-zA-Z]{16}$/.test(id);
};

