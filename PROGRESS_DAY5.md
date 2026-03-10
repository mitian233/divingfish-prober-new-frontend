# 第五阶段进度：计算器组件与中二节奏准备

## 状态：进行中

## 本次完成的组件

### 1. CalculatorDialog (计算器对话框)
- **文件**: `src/features/maimai/components/CalculatorDialog.vue`
- **功能**:
  - ✅ 分数线/绝赞分布计算（简化版）
  - ✅ Rating线计算（按定数/按达成率/按Rating）
  - ✅ 从谱面自动填入音符数据
  - ✅ 目标达成率容错计算

### 2. 差异记录文档
- **文件**: `DIFF_LOG.md`
- **记录内容**:
  - V2 vs V3 功能差异
  - 已简化/移除的功能列表
  - UI/交互差异
  - 技术债务

## 构建状态
```
✅ 构建成功（2613个模块，1.54秒）
   MaimaiView.js: 133.14 kB (gzip: 35.12 kB)
```

## V2 vs V3 功能差异摘要

### 已移除/简化功能
| 功能 | 状态 | 说明 |
|------|------|------|
| 谱面统计弹窗 (ECharts) | ❌ 移除 | 原版点击"拟合难度"显示饼图 |
| 歌曲详情Tooltip | ❌ 移除 | ID、Artist、BPM等 |
| DX分数星级显示 | ❌ 移除 | 原版显示☆1-5 |
| 高级筛选设置 | ⏳ 待实现 | 自定义列、FC/FS筛选等 |
| 牌子查询 | ⏳ 待实现 | PlateQualifier组件 |
| 分数模式切换表格 | ⚠️ 简化 | 0+/100-/101-模式 |

### 保留的核心功能
| 功能 | 状态 |
|------|------|
| 登录/注册/登出 | ✅ |
| 数据导入/导出 | ✅ |
| SD/DX成绩表格 | ✅ |
| 等级/定数筛选 | ✅ |
| 搜索功能 | ✅ |
| 编辑达成率 | ✅ |
| 查看封面 | ✅ |
| 解锁全曲 | ✅ |
| Rating计算 | ✅ |
| 分数计算器 | ✅ (简化版) |

## 文件结构更新
```
src/features/maimai/components/
├── CalculatorDialog.vue    # 新增：计算器组件
├── ChartTable.vue
├── FilterSlider.vue
├── LoginDialog.vue
├── RegisterDialog.vue
├── ImportDialog.vue
├── ExportDialog.vue
├── EditAchievementDialog.vue
├── CoverDialog.vue
└── UnlockAllDialog.vue
```

## 下一步计划
1. 实现 ProSettings 高级筛选组件
2. 开始 Phase 4：中二节奏页面迁移
3. 添加 ECharts 谱面统计图表
4. 优化移动端适配

## 技术债务
1. **ECharts依赖**: 需要添加实现谱面统计图表
2. **分页排序**: ChartTable需要添加分页和排序功能
3. **移动端适配**: 对话框和表格需要更好的移动端体验
4. **类型完善**: 部分类型定义需要补充
