# 第四阶段进度：舞萌DX页面模块化迁移完成 & 中二节奏迁移准备

## 状态：第三阶段完成（85%），第四阶段准备中

---

## 一、重构状态总览

### 阶段完成情况

| 阶段 | 状态 | 完成度 |
|------|------|--------|
| 阶段0：基线冻结 | ✅ 完成 | 100% |
| 阶段1：工程脚手架与UI基座 | ✅ 完成 | 100% |
| 阶段2：领域逻辑与API | ✅ 完成 | 100% |
| 阶段3：Maimai页面迁移 | 🔄 进行中 | 85% |
| 阶段4：Chunithm页面迁移 | ⏳ 待开始 | 5% |
| 阶段5：联调回归切换 | ⏳ 待开始 | 0% |

---

## 二、功能逻辑实现核查

### ✅ 已完成功能

#### 舞萌DX模块

| 功能 | 实现文件 | 验收状态 |
|------|----------|----------|
| 登录/注册/登出 | `LoginDialog.vue`, `RegisterDialog.vue`, `auth.ts` | ✅ 已验证 |
| 数据拉取与同步 | `maimaiStore.ts`, `maimaiService.ts` | ✅ 已验证 |
| SD/DX成绩表格 | `ChartTable.vue` | ✅ 已验证 |
| Rating计算 (B35+B15) | `recordCalculator.ts`, `maimaiStore.ts` | ✅ 已验证 |
| 网页源代码导入 | `ImportDialog.vue`, `parser.ts` | ✅ 已验证 |
| CSV导出 (GBK/UTF-8) | `ExportDialog.vue`, `csv.ts` | ✅ 已验证 |
| 等级/定数筛选 | `FilterSlider.vue` | ✅ 已验证 |
| 多字段搜索 | `ChartTable.vue` | ✅ 已验证 |
| 编辑达成率 | `EditAchievementDialog.vue` | ✅ 已验证 |
| 查看封面 | `CoverDialog.vue` | ✅ 已验证 |
| 解锁全曲 | `UnlockAllDialog.vue`, `merge.ts` | ✅ 已验证 |
| 数据合并 | `domain/merge.ts` | ✅ 已验证 |

#### 基础设施

| 模块 | 文件 | 状态 |
|------|------|------|
| Pinia状态管理 | `stores/`, `store/maimaiStore.ts`, `store/chuniStore.ts` | ✅ |
| API Client | `lib/api.ts` | ✅ |
| CSV工具 | `lib/csv.ts` | ✅ |
| 导入解析器 | `features/import/domain/parser.ts` | ✅ |
| 路由配置 | `app/router.ts` | ✅ |

### ❌ 未实现功能

#### 舞萌DX模块缺失

| 功能 | 优先级 | 计划文件 | 备注 |
|------|--------|----------|------|
| CalculatorDialog | P1 | `features/maimai/components/CalculatorDialog.vue` | 计算器对话框，ChartTable已预留触发点 |
| ProSettings | P1 | `features/maimai/components/ProSettings.vue` | 高级筛选，核心功能 |
| PlateQualifier | P2 | `features/maimai/components/PlateQualifier.vue` | 牌子查询 |
| 谱面统计可视化 | P2 | `features/maimai/components/StatsDialog.vue` | 需集成ECharts |
| 数据恢复 | P3 | `features/auth/components/Recovery.vue` | 从历史恢复 |

#### 中二节奏模块缺失

| 功能 | 状态 | 计划文件 |
|------|------|----------|
| ChuniView.vue | 仅占位符 | 需完整实现 |
| ChuniTable.vue | 未创建 | `features/chuni/components/ChuniTable.vue` |
| 导入功能 | 未实现 | `features/chuni/components/ImportDialog.vue` |
| 导出功能 | 未实现 | 复用 `lib/csv.ts` |
| 筛选功能 | 未实现 | `features/chuni/components/FilterSlider.vue` |
| OP计算器 | 未实现 | `features/chuni/components/CalculatorDialog.vue` |
| Store | ✅ 已实现 | `store/chuniStore.ts` |
| Service | ✅ 已实现 | `services/chuniService.ts` |
| Domain | ✅ 已实现 | `domain/recordCalculator.ts` |

#### 其他功能缺失

| 功能 | 优先级 | 计划文件 |
|------|--------|----------|
| 用户资料 | P3 | `features/auth/components/Profile.vue` |
| 反馈系统 | P3 | `components/dashboard/FeedbackDialog.vue` |
| 投票系统 | P3 | `components/dashboard/VoteBox.vue` |
| 教程组件 | P3 | `components/dashboard/Tutorial.vue` |
| 消息公告 | P3 | `components/dashboard/Message.vue` |
| 开发者令牌 | P3 | `features/auth/components/DeveloperToken.vue` |
| DashboardLayout | 未实现 | `layouts/DashboardLayout.vue` |

---

## 三、已完成的组件

### 1. 主视图集成
- **MaimaiView.vue** (`src/views/MaimaiView.vue`) - 277行
  - 集成 Pinia 状态管理 (useMaimaiStore, useAuthStore)
  - 登录/注册/登出功能
  - 数据导入/导出功能
  - SD/DX 标签页切换与筛选
  - 搜索功能
  - 解锁全曲功能
  - Rating 计算（SD 35 + DX 15）

### 2. 数据表格组件
- **ChartTable.vue** (`src/features/maimai/components/ChartTable.vue`) - 322行
  - 显示成绩记录，格式化输出
  - 封面图片展示
  - 难度标签（带颜色区分）
  - FC/FS 标签
  - 评级标签 (SSS+, SSS, SS+)
  - DX Rating 显示（悬停显示下一Rating信息）
  - 拟合难度展示
  - 操作按钮（查看封面、编辑、填入计算器）
  - 搜索/筛选功能

### 3. 筛选组件
- **FilterSlider.vue** (`src/features/maimai/components/FilterSlider.vue`) - 129行
  - 等级范围滑块 (1-15+)
  - 定数范围滑块 (1.0-15.5)
  - 等级/定数筛选切换
  - 暴露筛选方法供父组件调用

### 4. 对话框组件
- **LoginDialog.vue** - 105行 - 用户登录表单（含验证）
- **RegisterDialog.vue** - 122行 - 用户注册表单（含密码确认，自动同步数据）
- **ImportDialog.vue** - 85行 - 解析并导入页面数据
- **ExportDialog.vue** - 72行 - 导出CSV（支持GBK/UTF-8编码）
- **EditAchievementDialog.vue** - 84行 - 编辑单曲达成率
- **CoverDialog.vue** - 60行 - 显示歌曲封面图片
- **UnlockAllDialog.vue** - 46行 - 解锁全曲确认对话框

### 5. 类型定义
- 更新 `src/features/maimai/types/index.ts`
  - 添加 `artist`、`bpm`、`from`、`genre` 到 `basic_info`
  - 添加 `charter` 到 `MaimaiChart`
  - 添加 `diff_data`、`dist`、`fc_dist`、`cnt` 到统计类型

### 6. 领域逻辑
- **scoreCoefficient.ts** - Rating系数计算表
- **recordCalculator.ts** - 成绩计算、排序、封面路径
- **merge.ts** - 数据合并、解锁全曲、构建字典

---

## 四、新增 shadcn-vue 组件

| 组件 | 用途 |
|------|------|
| `button` | 按钮 |
| `card` | 卡片容器 |
| `dialog` | 对话框 |
| `tabs` | 标签页 |
| `input` | 输入框 |
| `label` | 标签 |
| `checkbox` | 复选框 |
| `slider` | 筛选范围选择 |
| `textarea` | 导入数据输入 |
| `tooltip` | 表格信息提示 |
| `select` | 下拉选择 |

---

## 五、代码统计

```
文件                              行数
─────────────────────────────────────
MaimaiView.vue                     277
ChartTable.vue                     322
FilterSlider.vue                   129
RegisterDialog.vue                 122
LoginDialog.vue                    105
ImportDialog.vue                    85
EditAchievementDialog.vue           84
ExportDialog.vue                    72
CoverDialog.vue                     60
UnlockAllDialog.vue                 46
─────────────────────────────────────
舞萌DX组件总计                   1,302

领域逻辑:
  scoreCoefficient.ts              ~150
  recordCalculator.ts              ~200
  merge.ts                         ~150
  parser.ts                        ~120

状态管理:
  maimaiStore.ts                   ~136
  chuniStore.ts                     ~84
  auth.ts                           ~50

服务层:
  maimaiService.ts                 ~100
  chuniService.ts                   ~60
  api.ts                            ~50
```

---

## 六、构建状态

```
✅ 构建成功（2611个模块，1.48秒）
   MaimaiView.js: 121.63 kB (gzip: 32.19 kB)
```

---

## 七、文件结构

```
src/
├── app/
│   ├── main.ts
│   └── router.ts
├── components/
│   ├── ui/                    # shadcn-vue 组件
│   └── HelloWorld.vue
├── features/
│   ├── auth/
│   │   ├── services/authService.ts
│   │   └── types/index.ts
│   ├── maimai/
│   │   ├── components/
│   │   │   ├── ChartTable.vue
│   │   │   ├── FilterSlider.vue
│   │   │   ├── LoginDialog.vue
│   │   │   ├── RegisterDialog.vue
│   │   │   ├── ImportDialog.vue
│   │   │   ├── ExportDialog.vue
│   │   │   ├── EditAchievementDialog.vue
│   │   │   ├── CoverDialog.vue
│   │   │   └── UnlockAllDialog.vue
│   │   ├── domain/
│   │   │   ├── index.ts
│   │   │   ├── merge.ts
│   │   │   ├── recordCalculator.ts
│   │   │   └── scoreCoefficient.ts
│   │   ├── services/maimaiService.ts
│   │   ├── store/maimaiStore.ts
│   │   └── types/index.ts
│   ├── chuni/
│   │   ├── domain/
│   │   │   ├── index.ts
│   │   │   └── recordCalculator.ts
│   │   ├── services/chuniService.ts
│   │   ├── store/chuniStore.ts
│   │   └── types/index.ts
│   └── import/
│       └── domain/parser.ts
├── lib/
│   ├── api.ts
│   ├── csv.ts
│   ├── utils.ts
│   └── index.ts
├── stores/
│   ├── auth.ts
│   └── index.ts
├── views/
│   ├── MaimaiView.vue         # ✅ 已实现
│   ├── ChuniView.vue          # ⏳ 占位符
│   ├── OverviewView.vue       # ⏳ 占位符
│   ├── ToolsView.vue          # ⏳ 占位符
│   └── SettingsView.vue       # ⏳ 占位符
├── main.ts
├── App.vue
└── style.css
```

---

## 八、下一步计划（第五天）

### 优先级 P0 - 核心功能完善

1. **CalculatorDialog 组件**
   - 文件: `features/maimai/components/CalculatorDialog.vue`
   - 功能: 分数/Rating计算器
   - 触发点: ChartTable 已预留 `@calculator` 事件

2. **ProSettings 组件**
   - 文件: `features/maimai/components/ProSettings.vue`
   - 功能: 高级筛选（难度、FC/FS、评级等组合条件）

### 优先级 P1 - 中二节奏迁移

3. **ChuniView.vue 完整实现**
   - 参考 MaimaiView.vue 结构
   - 复用 FilterSlider 组件
   - 实现 B30/N20 标签页

4. **ChuniTable.vue 组件**
   - 文件: `features/chuni/components/ChuniTable.vue`
   - 功能: 中二成绩表格展示

5. **中二节奏导入/导出**
   - ImportDialog.vue (chuni)
   - 复用 csv.ts 导出逻辑

### 优先级 P2 - 体验增强

6. **DashboardLayout 布局**
   - 文件: `layouts/DashboardLayout.vue`
   - 左侧导航 + 顶栏 + 主内容区

7. **谱面统计可视化**
   - 集成 ECharts
   - 显示难度分布、达成率分布

### 优先级 P3 - 辅助功能

8. **其他功能组件**
   - PlateQualifier (牌子查询)
   - Profile (用户资料)
   - VoteBox (投票)
   - FeedbackDialog (反馈)
   - Tutorial (教程)

---

## 九、风险与问题

### 已解决
- ✅ 数据合并逻辑正确迁移
- ✅ Rating 计算与旧版一致
- ✅ CSV 导出编码支持 GBK

### 待解决
- ⚠️ ProSettings 组件需要完整实现多条件筛选
- ⚠️ 中二节奏页面需要完整UI实现
- ⚠️ Dashboard 布局未实现，当前使用简单页面
- ⚠️ 缺少集成测试验证流程

---

## 十、验收清单

### 舞萌DX核心流程
- [x] 登录流程
- [x] 注册流程
- [x] 导入数据流程
- [x] 筛选流程（基础筛选）
- [ ] 筛选流程（高级筛选）
- [x] 编辑成绩流程
- [x] 导出 CSV 流程
- [x] 查看封面流程
- [x] 全曲解锁流程
- [ ] 计算器流程
- [ ] 牌子查询流程

### 中二节奏核心流程
- [ ] 数据拉取流程
- [ ] 成绩展示流程
- [ ] 筛选流程
- [ ] 导出流程

### 基础设施
- [x] TypeScript 类型定义
- [x] Pinia 状态管理
- [x] API 封装
- [ ] 单元测试
- [ ] 集成测试

---

**文档版本**: 4.0  
**更新日期**: 2026-03-10
