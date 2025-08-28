# WeSplit - 轻松分账，快乐聚餐

<div align="center">
  <h3>🧾 一个现代化的多人分账 Web 应用</h3>
  <p>让聚餐、旅行、聚会的费用分摊变得简单透明</p>
  
  <img src="https://img.shields.io/badge/React-19.1.1-61dafb?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-3178c6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-7.1.2-646cff?style=flat-square&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind CSS-4.1.12-06b6d4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Zustand-状态管理-ff6b35?style=flat-square" alt="Zustand">
</div>

## ✨ 功能特性

### 🏷️ 分账组管理
- **多分账组支持**：创建、编辑、删除、切换不同的分账组
- **分账组信息**：支持名称、描述等基本信息管理
- **数据隔离**：每个分账组的数据完全独立

### 👥 成员管理
- **成员添加**：快速添加聚餐参与人员
- **智能删除**：保护有付款记录的成员，防止数据丢失
- **头像支持**：支持自定义头像，个性化展示

### 💰 消费记录
- **详细记录**：记录消费项目、金额、付款人、参与者
- **分类管理**：支持餐饮、交通、住宿、娱乐、购物等分类
- **编辑功能**：支持消费记录的修改和删除
- **备注信息**：可添加详细的消费说明

### 🔢 智能分账
- **自动计算**：实时计算每个人的应付/应收金额
- **最优转账**：使用贪心算法生成最少转账次数的结算方案
- **可视化展示**：清晰的个人明细和转账方案展示
- **颜色区分**：蓝色显示总支付，橙色显示应分摊

### 📊 结果导出
- **海报生成**：一键生成精美的分账结果海报
- **高清下载**：支持PNG格式，2倍清晰度
- **完整信息**：包含所有成员明细和转账方案

### 🔒 数据安全
- **本地存储**：所有数据保存在浏览器本地，保护隐私
- **二次确认**：重要操作（删除、清空）都有确认机制
- **数据保护**：防止误删有付款记录的关键数据

## 🛠️ 技术栈

### 前端框架
- **React 19.1.1** - 现代化的用户界面库
- **TypeScript 5.8.3** - 类型安全的JavaScript超集
- **Vite 7.1.2** - 快速的构建工具，支持热更新(HMR)

### 样式与UI
- **Tailwind CSS 4.1.12** - 实用优先的CSS框架
- **@iconify-icon/react** - 丰富的图标库
- **响应式设计** - 完美适配桌面和移动设备

### 状态管理
- **Zustand** - 轻量级状态管理库
- **数据持久化** - 自动保存到localStorage
- **Redux DevTools** - 开发调试支持

### 工具库
- **html2canvas** - 海报生成功能
- **ESLint** - 代码质量检查
- **TypeScript ESLint** - 类型感知的代码检查

## 🚀 快速开始

### 环境要求
- Node.js 16.0 或更高版本
- npm / yarn / pnpm 包管理器

### 安装步骤

1. **克隆项目**
```bash
git clone git@github.com:baiwumm/WeSplit.git
cd we-split
```

2. **安装依赖**
```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

3. **启动开发服务器**
```bash
# 使用 npm
npm run dev

# 或使用 yarn
yarn dev

# 或使用 pnpm
pnpm dev
```

4. **打开浏览器**
访问 `http://localhost:5173` 开始使用

### 构建生产版本
```bash
# 构建
npm run build

# 预览构建结果
npm run preview
```

## 📱 使用指南

### 创建分账组
1. 首次使用会提示创建分账组
2. 输入分账组名称（如"三亚旅行"、"聚餐AA"）
3. 可选择添加描述信息

### 添加成员
1. 在成员管理区域点击"添加成员"
2. 输入成员姓名
3. 可选择上传头像

### 记录消费
1. 在消费记录区域点击"添加消费"
2. 填写消费项目、金额、付款人
3. 选择参与分账的成员
4. 选择消费分类，添加备注

### 查看分账结果
1. 系统自动计算每个人的应付/应收金额
2. 在"个人明细"标签查看详细信息
3. 在"转账方案"标签查看最优转账建议
4. 点击"生成海报"可下载分账结果图片

### 管理分账组
- **切换分账组**：点击导航栏的"切换组"按钮
- **编辑分账组**：点击分账组名称旁的编辑图标
- **删除分账组**：在导航栏或切换菜单中点击删除按钮
- **创建新分账组**：点击"新建组"按钮

## 📂 项目结构

```
src/
├── components/           # React组件
│   ├── ui/              # 基础UI组件
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   ├── business/        # 业务组件
│   │   ├── PersonManagement.tsx
│   │   ├── ExpenseTracking.tsx
│   │   ├── SettlementDetails.tsx
│   │   └── PosterGenerator.tsx
│   └── forms/           # 表单组件
│       ├── AddPersonForm.tsx
│       ├── AddExpenseForm.tsx
│       └── ...
├── pages/               # 页面组件
│   └── HomePage.tsx
├── store/               # 状态管理
│   └── useAppStore.ts
├── types/               # TypeScript类型定义
│   └── index.ts
├── utils/               # 工具函数
│   └── index.ts
├── App.tsx              # 根组件
├── main.tsx             # 应用入口
└── index.css            # 全局样式
```

## 🧮 分账算法

### 计算逻辑
1. **统计支付**：计算每个人的总支付金额
2. **计算分摊**：根据参与情况计算每个人应分摊的金额
3. **计算余额**：支付金额 - 应分摊金额 = 净余额
   - 正数：应收款（别人欠你的）
   - 负数：应付款（你欠别人的）
   - 零：已平衡

### 最优转账算法
使用贪心算法生成最少转账次数的结算方案：
1. 将所有人按应收/应付金额排序
2. 最大应收者与最大应付者配对
3. 转账金额为两者绝对值的较小值
4. 重复直到所有人余额为零

## 🎨 设计规范

### 颜色规范
- **蓝色系**：总支付金额展示（浅蓝色背景、蓝色边框、深蓝色文字）
- **橙色系**：应分摊金额展示（浅橙色背景、橙色边框、深橙色文字）
- **绿色系**：应收金额显示
- **红色系**：应付金额显示、危险操作按钮
- **灰色系**：已结清状态、禁用状态

### 交互规范
- **二次确认**：所有删除操作都需要确认
- **视觉反馈**：按钮悬停、加载状态、操作结果提示
- **数据保护**：防止删除有付款记录的关键数据

## 🔧 开发指南

### 代码规范
- 使用 TypeScript 确保类型安全
- 遵循 ESLint 代码风格规范
- 组件采用函数式编程，使用 React Hooks
- 使用 Tailwind CSS 进行样式开发

### 状态管理
- 使用 Zustand 进行全局状态管理
- 数据自动持久化到 localStorage
- 支持 Redux DevTools 调试

### 组件开发
- 基础组件放在 `components/ui/` 目录
- 业务组件放在 `components/business/` 目录
- 表单组件放在 `components/forms/` 目录
- 保持组件单一职责，提高复用性

## 📋 可用脚本

```bash
# 开发服务器
npm run dev          # 启动开发服务器 (http://localhost:5173)

# 构建
npm run build        # 构建生产版本
npm run preview      # 预览构建结果

# 代码检查
npm run lint         # 运行 ESLint 检查
```

## 🌟 特色亮点

### 💡 智能化
- 自动计算最优转账方案，减少转账次数
- 智能保护有付款记录的成员数据
- 实时分账计算，无需手动刷新

### 🎯 用户体验
- 现代化界面设计，操作直观简单
- 响应式设计，完美支持移动设备
- 详细的操作反馈和错误提示

### 🛡️ 数据安全
- 本地存储，保护用户隐私
- 二次确认机制，防止误操作
- 数据关联性检查，保证数据完整性

### 📈 扩展性
- 模块化组件架构，易于维护和扩展
- TypeScript 类型安全，减少运行时错误
- 标准化的代码规范和项目结构

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- React 团队提供的优秀框架
- Tailwind CSS 的实用优先设计理念
- Zustand 简洁优雅的状态管理方案
- 所有开源贡献者的无私奉献

---

<div align="center">
  <p>如果这个项目对你有帮助，请给一个 ⭐️ 支持一下！</p>
  <p>Made with ❤️ by WeSplit Team</p>
</div>