import mongoose from "mongoose";

/**
 * 示例模型
 *
 * 这是一个示例模型文件，演示如何创建 Mongoose 数据模型。
 * 参考此文件创建你自己的模型：
 *
 * 1. 导入 mongoose
 * 2. 定义 Schema（包含字段类型、验证规则等）
 * 3. 创建模型并导出
 *
 * 使用步骤：
 * 1. 复制此文件并重命名为你的模型名称
 * 2. 修改 Schema 定义以匹配你的数据需求
 * 3. 更新 collection 名称
 * 4. 在路由文件中导入使用
 */

// 定义 Schema
const exampleSchema = new mongoose.Schema(
  {
    // 字符串字段示例 - 必填
    title: {
      type: String,
      required: true,
      trim: true, // 自动去除首尾空格
    },

    // 字符串字段示例 - 可选
    description: {
      type: String,
      required: false,
      default: "", // 默认值
    },

    // 数字字段示例
    age: {
      type: Number,
      required: false,
      min: 0, // 最小值验证
      max: 150, // 最大值验证
    },

    // 布尔字段示例
    isActive: {
      type: Boolean,
      default: true,
    },

    // 数组字段示例
    tags: {
      type: [String],
      default: [],
    },

    // 日期字段示例
    birthDate: {
      type: Date,
      required: false,
    },

    // 对象字段示例
    metadata: {
      type: {
        createdBy: String,
        ipAddress: String,
      },
      required: false,
    },

    // 自动时间戳
    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // 集合名称（MongoDB 中的表名）
    collection: "examples",

    // 启用时间戳（自动管理 createdAt 和 updatedAt）
    timestamps: true,

    // 版本控制 (默认为 "__v")
    versionKey: "__v",
  }
);

// 创建索引（可选，用于提高查询性能）
exampleSchema.index({ title: 1 }); // 单字段索引
exampleSchema.index({ createdAt: -1 }); // 降序索引
exampleSchema.index({ title: 1, isActive: 1 }); // 复合索引

// 创建模型
const Example = mongoose.model("Example", exampleSchema);

// 导出模型
export { Example };

/**
 * 常见字段类型参考：
 *
 * String     - 字符串
 * Number     - 数字
 * Boolean    - 布尔值
 * Date       - 日期
 * Array      - 数组
 * Object     - 对象
 * Mixed      - 混合类型
 * ObjectId   - MongoDB ObjectId
 * Buffer     - 二进制数据
 *
 * 常见选项：
 *
 * required   - 是否必填
 * default    - 默认值
 * unique     - 是否唯一
 * index      - 是否创建索引
 * enum       - 枚举值
 * min/max    - 最小值/最大值
 * trim       - 去除首尾空格
 * lowercase  - 转换为小写
 * uppercase  - 转换为大写
 * validate   - 自定义验证函数
 */
