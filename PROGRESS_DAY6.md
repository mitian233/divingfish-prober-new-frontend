# 第六阶段进度：中二节奏页面模块化迁移（第一版）

## 状态：已完成

## 本次完成内容

### 1. ChuniView 完整接入
- **文件**: `src/views/ChuniView.vue`
- **功能**:
  - ✅ 拉取中二乐曲数据与用户成绩
  - ✅ B30 / N20 双标签页展示
  - ✅ 底分与筛选后 Rating 实时展示
  - ✅ 曲名搜索
  - ✅ 难度/定数筛选（复用 FilterSlider）
  - ✅ 导出弹窗与解锁全曲弹窗接入

### 2. ChuniTable 组件
- **文件**: `src/features/chuni/components/ChuniTable.vue`
- **功能**:
  - ✅ 基于 TanStack DataTable 的中二成绩表格
  - ✅ 排名/乐曲名/难度/定数/分数/Rating 列
  - ✅ 分数评级标签（S/SS/SSS 等）
  - ✅ FC 标签显示
  - ✅ 支持表格内分页、排序、列显隐

### 3. 中二导出与全曲解锁
- **文件**:
  - `src/features/chuni/components/ExportDialog.vue`
  - `src/features/chuni/components/UnlockAllDialog.vue`
  - `src/features/chuni/store/chuniStore.ts`
- **功能**:
  - ✅ CSV 导出（GBK/UTF-8）
  - ✅ 解锁中二全曲（补齐缺失谱面，默认分数 0）

### 4. DataTable 通用能力增强（承接第五天遗留）
- **文件**: `src/components/ui/data-table/DataTable.vue`
- **改进**:
  - ✅ 列头点击排序交互
  - ✅ 列显隐下拉菜单
  - ✅ 与现有分页/搜索能力兼容

## 结构更新
```
src/
├── features/chuni/components/
│   ├── ChuniTable.vue         # 新增
│   ├── ExportDialog.vue       # 新增
│   └── UnlockAllDialog.vue    # 新增
├── views/
│   └── ChuniView.vue          # 完整实现
└── components/ui/data-table/
    └── DataTable.vue          # 增强：排序 + 列显隐
```

## 当前验收结果（第六天）

- [x] 中二数据拉取流程
- [x] 中二 B30/N20 成绩展示流程
- [x] 中二筛选流程（等级/定数 + 搜索）
- [x] 中二导出流程
- [x] 中二全曲解锁流程

## 下一步（第七天建议）
1. 中二高级筛选（ProSettingsChuni）
2. 中二 OP 计算器迁移
3. 中二导入流程迁移（如需与旧版完全等价）
