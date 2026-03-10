# maimaidx-prober-v3

舞萌DX | 中二节奏查分器 - Vue 3 重构版本

## 技术栈

- **框架**: Vue 3.5 + TypeScript 5.9
- **构建工具**: Vite 7.3
- **路由**: Vue Router 4.6
- **状态管理**: Pinia 3.0
- **UI 组件**: shadcn-vue (Reka UI + Tailwind CSS v4)
- **样式**: Tailwind CSS 4.2 + CSS Variables
- **图标**: lucide-vue-next
- **HTTP**: axios
- **通知**: sonner
- **数据表格**: @tanstack/vue-table

## 项目结构

```
src/
├── app/
│   └── router.ts                 # 路由配置
├── components/
│   └── ui/                       # shadcn-vue UI 组件 (100+ 文件)
│       ├── button/
│       ├── card/
│       ├── data-table/           # TanStack Table 数据表格
│       ├── dialog/
│       ├── table/
│       ├── tabs/
│       ├── slider/
│       ├── tooltip/
│       └── ...
├── features/
│   ├── auth/
│   │   ├── services/authService.ts
│   │   └── types/index.ts
│   ├── chuni/
│   │   ├── domain/
│   │   │   ├── index.ts
│   │   │   └── recordCalculator.ts
│   │   ├── services/chuniService.ts
│   │   ├── store/chuniStore.ts
│   │   └── types/index.ts
│   ├── import/
│   │   └── domain/parser.ts
│   └── maimai/
│       ├── components/
│       │   ├── CalculatorDialog.vue
│       │   ├── ChartTable.vue
│       │   ├── CoverDialog.vue
│       │   ├── EditAchievementDialog.vue
│       │   ├── ExportDialog.vue
│       │   ├── FilterSlider.vue
│       │   ├── ImportDialog.vue
│       │   ├── LoginDialog.vue
│       │   ├── RegisterDialog.vue
│       │   └── UnlockAllDialog.vue
│       ├── domain/
│       │   ├── index.ts
│       │   ├── merge.ts
│       │   ├── recordCalculator.ts
│       │   └── scoreCoefficient.ts
│       ├── services/maimaiService.ts
│       ├── store/maimaiStore.ts
│       └── types/index.ts
├── layouts/
│   └── DashboardLayout.vue       # 主布局
├── lib/
│   ├── api.ts                    # Axios 实例
│   ├── csv.ts                    # CSV 导出
│   └── utils.ts                  # 工具函数
├── stores/
│   ├── auth.ts                   # 认证状态
│   └── index.ts
├── views/
│   ├── OverviewView.vue
│   ├── MaimaiView.vue            # 舞萌DX主页面
│   ├── ChuniView.vue
│   ├── ToolsView.vue
│   └── SettingsView.vue
├── App.vue
├── main.ts
└── style.css
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 已实现功能

### 舞萌DX模块
- ✅ 登录/注册/登出
- ✅ 数据导入（从页面源代码解析）
- ✅ CSV导出（GBK/UTF-8编码）
- ✅ SD/DX成绩表格
- ✅ Rating计算（B35 + B15）
- ✅ 等级/定数筛选
- ✅ 搜索功能（曲名、ID、谱师等）
- ✅ 编辑达成率
- ✅ 查看封面图片
- ✅ 解锁全曲
- ✅ 分数/Rating计算器

### 基础设施
- ✅ Pinia状态管理
- ✅ Axios API封装
- ✅ TypeScript类型定义
- ✅ 响应式布局

## 文档

- [BASELINE.md](./BASELINE.md) - 功能基线文档
- [PROGRESS_DAY1.md](./PROGRESS_DAY1.md) - Phase 0 进度
- [PROGRESS_DAY2.md](./PROGRESS_DAY2.md) - Phase 1 进度
- [PROGRESS_DAY3.md](./PROGRESS_DAY3.md) - Phase 2 进度
- [PROGRESS_DAY4.md](./PROGRESS_DAY4.md) - Phase 3 进度
- [PROGRESS_DAY5.md](./PROGRESS_DAY5.md) - Phase 5 进度
- [PROGRESS_DAY6.md](./PROGRESS_DAY6.md) - Phase 4（Chuni）进度
- [DIFF_LOG.md](./DIFF_LOG.md) - V2 vs V3 功能差异记录

## 重构进度

- ✅ **阶段 0**: 基线冻结
- ✅ **阶段 1**: 工程脚手架与 UI 基座
- ✅ **阶段 2**: 先迁移领域逻辑与 API
- ✅ **阶段 3**: Maimai 页面模块化迁移
- 🚧 **阶段 4**: Chunithm 页面模块化迁移（进行中）
- ⏳ **阶段 5**: 联调、回归、切换

## 待实现功能

### 高优先级
- ✅ ProSettings 高级筛选组件
- ✅ 中二节奏页面迁移（第一版）
- ✅ 谱面统计弹窗 (ECharts)
- ✅ 中二导入流程迁移

### 中优先级
- ⏳ ChartTable 详细Tooltip
- ⏳ DX分数星级显示
- ⏳ 牌子查询功能
- ⏳ Profile组件

### 低优先级
- ⏳ 移动端适配优化
- ⏳ 使用指南组件
- ⏳ 数据恢复功能

## 技术债务

1. **中二导入流程**: 与旧版导入行为仍需对齐
2. **ECharts体积**: 已按需加载，后续可继续做 chunk 切分优化
3. **移动端适配**: 对话框和表格需要更好的移动端体验
4. **类型完善**: 部分类型定义需要补充

## 构建信息

```
模块数: 2613
构建时间: ~1.5s
MaimaiView.js: 133.14 kB (gzip: 35.12 kB)
```

## 许可证

MIT
