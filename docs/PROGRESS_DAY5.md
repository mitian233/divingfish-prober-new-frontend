# 第五阶段进度：计算器组件与数据表格重构

## 状态：进行中

## 本次完成的组件

### 1. CalculatorDialog (计算器对话框)
- **文件**: `src/features/maimai/components/CalculatorDialog.vue`
- **功能**:
  - ✅ 分数线/绝赞分布计算（简化版）
  - ✅ Rating线计算（按定数/按达成率/按Rating）
  - ✅ 从谱面自动填入音符数据
  - ✅ 目标达成率容错计算

### 2. DataTable (数据表格组件)
- **文件**: `src/components/ui/data-table/DataTable.vue`
- **技术**: TanStack Table (@tanstack/vue-table)
- **功能**:
  - ✅ 分页控制（每页10/20/30/50/100条）
  - ✅ 全局搜索过滤
  - ✅ 列排序（框架支持）
  - ✅ 列可见性切换（框架支持）
  - ✅ 行选择（框架支持）
  - ✅ 行展开（框架支持）
  - ✅ TypeScript泛型支持

### 3. ChartTable 重构
- **文件**: `src/features/maimai/components/ChartTable.vue`
- **改进**:
  - ✅ 使用 TanStack Table 替代静态表格
  - ✅ 内置分页功能
  - ✅ 内置全局搜索
  - ✅ 保留所有原有功能（Rating提示、FC/FS标签等）

### 4. 差异记录文档
- **文件**: `DIFF_LOG.md`
- **更新**: 记录DataTable改进

## 新增依赖

```json
{
  "@tanstack/vue-table": "^8.x"
}
```

## 构建状态
```
✅ 构建成功（2618个模块，1.57秒）
   MaimaiView.js: 189.32 kB (gzip: 51.26 kB)
```

## TanStack DataTable 特性

### 已集成功能
| 功能 | 状态 | 说明 |
|------|------|------|
| 分页 | ✅ | 每页条数可选，上一页/下一页 |
| 全局搜索 | ✅ | 支持字符串匹配 |
| 列定义 | ✅ | 使用 ColumnDef 泛型 |
| 自定义单元格渲染 | ✅ | 使用 h() 函数渲染 |

### 可扩展功能（框架已支持）
| 功能 | 状态 | 说明 |
|------|------|------|
| 列排序 | ⚠️ | 需添加排序UI |
| 列可见性切换 | ⚠️ | 需添加DropdownMenu |
| 行选择 | ⚠️ | 需添加Checkbox列 |
| 行展开 | ⚠️ | 需添加展开内容 |
| 列固定 | ⚠️ | 左侧/右侧固定列 |

## 文件结构更新
```
src/
├── components/ui/
│   └── data-table/
│       ├── DataTable.vue      # 新增：通用数据表格
│       └── index.ts
├── features/maimai/components/
│   ├── CalculatorDialog.vue
│   └── ChartTable.vue         # 重构：使用DataTable
└── lib/
    └── utils.ts               # 更新：添加valueUpdater
```

## 下一步计划
1. 添加 DataTable 列排序UI
2. 添加 DataTable 列可见性切换
3. 实现 ProSettings 高级筛选组件
4. 开始 Phase 4：中二节奏页面迁移
5. 添加 ECharts 谱面统计图表

## 技术债务
1. **ECharts依赖**: 需要添加实现谱面统计图表
2. **列排序UI**: DataTable需要添加排序按钮
3. **移动端适配**: 对话框和表格需要更好的移动端体验
4. **类型完善**: 部分类型定义需要补充
