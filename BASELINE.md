# maimaidx-prober Web 功能基线文档

> 本文档记录重构前（Vue 2 版本）的完整功能清单，作为迁移验收依据。
> 创建日期：2026-03-09

---

## 1. 功能模块清单

### 1.1 认证模块 (Auth)

#### 功能点
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| 登录 | 用户名 + 密码登录 | 登录成功后显示用户名，获取用户数据 |
| 注册 | 用户名（≥4字符）+ 密码 + 确认密码 | 注册成功后自动同步当前数据 |
| 登出 | 清除 JWT token | 登出后状态变为"未登录"，页面刷新 |

#### 相关代码
- `MainPage.vue`: `login()`, `register()`, `logout()`, `invokeRegister()`
- API 端点：
  - `POST /api/maimaidxprober/login`
  - `POST /api/maimaidxprober/register`

---

### 1.2 舞萌DX (Maimai) 模块

#### 1.2.1 数据拉取与同步
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| 获取乐曲数据 | 拉取所有乐曲元数据 | 显示乐曲列表，包含定数、难度等信息 |
| 获取用户成绩 | 拉取登录用户的成绩记录 | 显示用户的达成率、DX分数等 |
| 获取相对难度 | 拉取谱面统计信息 | 显示拟合难度、平均达成率等 |
| 数据同步 | 上传本地修改到服务器 | 修改后自动同步，显示同步成功提示 |

#### 相关代码
- `fetchMusicData()` - 获取乐曲和成绩数据
- `sync()` - 同步成绩到服务器
- API 端点：
  - `GET /api/maimaidxprober/music_data`
  - `GET /api/maimaidxprober/player/records`
  - `GET /api/maimaidxprober/chart_stats`
  - `POST /api/maimaidxprober/player/update_records`
  - `POST /api/maimaidxprober/player/update_record`

#### 1.2.2 成绩展示
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| SD/DX 分类 | 按 SD 和 DX 分类显示 | 两个 Tab 分别显示旧谱和 DX 谱 |
| 成绩排序 | 按 DX Rating 降序排列 | 正确计算并显示排名 |
| Rating 计算 | 计算底分（SD 35 + DX 15） | 正确显示总分和筛选后的 Rating |
| 成绩详情 | 显示：排名、封面、曲名、难度、定数、达成率、DX Rating、拟合难度 | 表格正确显示所有字段 |
| 封面查看 | 点击查看大图 | 弹窗显示乐曲封面 |

#### 相关代码
- 计算属性：`sdData`, `dxData`, `sdDisplay`, `dxDisplay`, `sdRa`, `dxRa`
- `computeRecord()` - 计算单条记录的 Rating
- `ScoreCoefficient.js` - Rating 系数计算

#### 1.2.3 数据导入
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| 导入源代码 | 粘贴网页源代码解析成绩 | 正确解析并合并到现有记录 |
| 数据合并 | 新旧记录智能合并 | 相同歌曲相同难度的记录更新，新增记录追加 |
| 自动同步 | 导入后自动上传 | 导入成功后自动同步到服务器 |

#### 相关代码
- `flushData()` - 触发导入
- `pageToRecordList()` - 解析网页源代码
- `merge()` - 合并记录

#### 1.2.4 数据筛选
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| 文字搜索 | 按曲名搜索 | 实时筛选匹配的乐曲 |
| 达成率筛选 | 滑块筛选达成率范围 | 正确过滤指定范围的记录 |
| 定数筛选 | 筛选指定定数范围 | 正确过滤指定定数的记录 |
| 难度筛选 | 筛选指定难度等级 | 支持 Basic 到 Re:MASTER 筛选 |
| FC/FS 筛选 | 筛选 FC/FS 状态 | 正确过滤 FC/FS 记录 |
| 高级设置 | 多条件组合筛选 | 支持复杂的组合条件 |

#### 相关代码
- `FilterSlider.vue` - 筛选滑块组件
- `ProSettings.vue` - 高级设置组件

#### 1.2.5 数据编辑
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| 修改达成率 | 弹窗修改单条记录的达成率 | 修改后重新计算 Rating，同步到服务器 |
| 查看封面 | 点击查看乐曲封面大图 | 弹窗显示封面图片 |
| 计算器填充 | 将谱面数据填入计算器 | 一键填入音符数量，用于计算理论分 |

#### 相关代码
- `editRow()`, `finishEditRow()` - 编辑成绩
- `coverRow()` - 查看封面
- `calculatorRow()` - 填充计算器

#### 1.2.6 导出功能
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| 导出 CSV | 导出成绩为 CSV 文件 | 支持 GBK/UTF-8 编码，正确导出所有字段 |

#### 相关代码
- `exportToCSV()` - 导出 CSV
- `GBK.js` - GBK 编码处理

#### 1.2.7 全曲解锁
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| 解锁所有谱面 | 显示所有谱面的定数信息 | 标记为 block 状态，不可编辑 |

#### 相关代码
- `mergeOnAllMode()` - 解锁全曲

#### 1.2.8 计算器工具
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| 理论分计算 | 计算理论达成率和 DX 分 | 根据音符数量计算理论分 |
| 目标分计算 | 计算目标达成率所需分数 | 输入目标达成率，计算所需分数 |

#### 相关代码
- `Calculators.vue` - 计算器组件

#### 1.2.9 牌子查询
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| 查询可获得的牌子 | 分析成绩，列出符合条件的牌子 | 正确识别所有可获得的牌子 |

#### 相关代码
- `PlateQualifier.vue` - 牌子查询组件

---

### 1.3 中二节奏 (Chunithm) 模块

#### 1.3.1 数据拉取与同步
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| 获取乐曲数据 | 拉取所有乐曲元数据 | 显示乐曲列表 |
| 获取用户成绩 | 拉取登录用户的成绩记录 | 显示用户的分数、Rating 等 |

#### 相关代码
- `fetchChunithmUserData()` - 获取中二数据
- API 端点：
  - `GET /api/chunithmprober/music_data`
  - `GET /api/chunithmprober/player/records`

#### 1.3.2 成绩展示
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| B30/N20 分类 | 按 Best 30 和 New 20 分类 | 两个 Tab 分别显示 |
| Rating 计算 | 计算 Rating（B30 + N20）/ 50 | 正确显示 Rating |
| 成绩排序 | 按 Rating 降序排列 | 正确显示排名 |

#### 相关代码
- 计算属性：`chuniB30Record`, `chuniN20Record`, `chuniB30Rating`, `chuniN20Rating`

#### 1.3.3 数据筛选
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| 文字搜索 | 按曲名搜索 | 实时筛选 |
| 分数筛选 | 筛选分数范围 | 正确过滤 |
| 定数筛选 | 筛选指定定数范围 | 正确过滤 |
| 高级设置 | 多条件组合筛选 | 支持复杂条件 |

#### 相关代码
- `FilterSlider.vue` - 筛选滑块（复用）
- `ProSettingsChuni.vue` - 中二高级设置

#### 1.3.4 导出功能
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| 导出 CSV | 导出成绩为 CSV 文件 | 支持 GBK/UTF-8 编码 |

#### 相关代码
- `exportToCSVChuni()` - 导出中二 CSV

#### 1.3.5 全曲解锁
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| 解锁所有谱面 | 显示所有谱面信息 | 标记为不可编辑 |

#### 相关代码
- `unlockAllChuni()` - 解锁中二全曲

#### 1.3.6 OP 计算器
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| 计算 Over Power | 计算中二的 OP 值 | 正确计算并显示 OP |

#### 相关代码
- `ChuniOverPowerCalculators.vue` - OP 计算器组件

---

### 1.4 其他功能

#### 1.4.1 用户资料
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| 显示用户名 | 显示当前登录用户 | 登录后正确显示 |
| 显示统计数据 | 显示 Rating、牌子等 | 正确计算并显示 |

#### 相关代码
- `Profile.vue` - 用户资料组件

#### 1.4.2 反馈系统
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| 提交反馈 | 用户提交意见和建议 | 成功提交后显示提示 |

#### 相关代码
- `sendFeedback()` - 发送反馈
- API: `POST /api/maimaidxprober/feedback`

#### 1.4.3 投票系统
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| 为乐曲投票 | 用户为喜欢的乐曲投票 | 成功投票后显示提示 |

#### 相关代码
- `VoteBox.vue` - 投票组件

#### 1.4.4 数据恢复
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| 恢复数据 | 从历史记录恢复数据 | 成功恢复后更新列表 |

#### 相关代码
- `Recovery.vue` - 恢复组件

#### 1.4.5 教程与指南
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| 使用指南 | 显示使用说明 | 正确跳转到指南页面 |
| 新手教程 | 显示功能引导 | 正确显示教程内容 |

#### 相关代码
- `Tutorial.vue` - 教程组件

#### 1.4.6 消息公告
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| 显示消息 | 显示系统消息和公告 | 正确显示消息内容 |

#### 相关代码
- `Message.vue` - 消息组件

#### 1.4.7 开发者令牌
| 功能 | 说明 | 验收标准 |
|------|------|----------|
| 生成令牌 | 生成开发者 API 令牌 | 正确生成并显示令牌 |

#### 相关代码
- `DeveloperToken.vue` - 开发者令牌组件

---

## 2. 关键流程回归测试清单

### 2.1 登录流程
```
1. 打开网站
2. 点击"登录并同步数据"按钮
3. 输入用户名和密码
4. 点击"登录"按钮
5. 验收点：
   ✓ 显示"登录成功"提示
   ✓ 显示用户名（非"未登录"）
   ✓ 自动加载舞萌 DX 和中二节奏数据
   ✓ 数据正确显示在表格中
```

### 2.2 注册流程
```
1. 点击"登录并同步数据"按钮
2. 点击"立即注册"按钮
3. 输入用户名（≥4字符）、密码、确认密码
4. 点击"注册"按钮
5. 验收点：
   ✓ 显示"注册成功，数据已同步完成"提示
   ✓ 自动登录
   ✓ 已导入的数据同步到新账号
```

### 2.3 导入数据流程
```
1. 点击"导入数据"按钮
2. 粘贴网页源代码
3. 点击"确定"按钮
4. 验收点：
   ✓ 显示"数据已同步完成"提示（已登录时）
   ✓ 成绩列表更新
   ✓ Rating 重新计算
   ✓ 新记录正确显示
```

### 2.4 筛选流程
```
1. 使用筛选滑块设置达成率范围
2. 使用搜索框搜索曲名
3. 启用高级设置，设置多个筛选条件
4. 验收点：
   ✓ 表格实时更新显示筛选结果
   ✓ 显示筛选后的 Rating 计算
   ✓ 高级设置条件正确组合
```

### 2.5 编辑成绩流程
```
1. 在成绩表格中点击"修改"按钮
2. 输入新的达成率
3. 点击"确定"按钮
4. 验收点：
   ✓ 显示"修改成功"提示
   ✓ 达成率更新
   ✓ Rating 重新计算
   ✓ 已登录时数据同步到服务器
```

### 2.6 导出 CSV 流程
```
1. 点击"导出为 CSV"按钮
2. 选择编码（GBK 或 UTF-8）
3. 点击"导出"按钮
4. 验收点：
   ✓ 文件下载成功
   ✓ 文件内容包含所有成绩记录
   ✓ 编码正确（GBK 可用 Excel 打开）
```

### 2.7 查看封面流程
```
1. 在成绩表格中点击"查看封面"按钮
2. 验收点：
   ✓ 弹窗显示封面图片
   ✓ 图片正确加载
```

### 2.8 全曲解锁流程
```
1. 点击"解锁全曲"按钮
2. 在确认对话框中点击"解锁"
3. 验收点：
   ✓ 显示所有谱面（包括未游玩的）
   ✓ 新增谱面标记为 block 状态
   ✓ 定数信息正确显示
   ✓ block 状态的谱面不可编辑
```

### 2.9 牌子查询流程
```
1. 点击牌子查询按钮
2. 选择牌子类型
3. 验收点：
   ✓ 正确列出符合条件的乐曲
   ✓ 显示完成进度
```

### 2.10 切换舞萌/中二表格流程
```
1. 点击"切换到中二节奏成绩表格"按钮
2. 验收点：
   ✓ 表格切换为中二节奏数据
   ✓ 中二数据正确显示
   ✓ 可以切换回舞萌 DX 表格
```

### 2.11 登出流程
```
1. 点击"登出"按钮
2. 在确认对话框中点击"登出"
3. 验收点：
   ✓ 显示"已登出"提示
   ✓ 用户名变为"未登录"
   ✓ 页面刷新
```

---

## 3. 功能等价对照表

### 3.1 核心功能映射

| 旧代码位置 | 功能 | 新代码位置（规划） |
|-----------|------|-------------------|
| `MainPage.vue` - `login()` | 登录 | `features/auth/services/authService.ts` |
| `MainPage.vue` - `register()` | 注册 | `features/auth/services/authService.ts` |
| `MainPage.vue` - `logout()` | 登出 | `features/auth/services/authService.ts` |
| `MainPage.vue` - `fetchMusicData()` | 获取舞萌数据 | `features/maimai/services/maimaiService.ts` |
| `MainPage.vue` - `fetchChunithmUserData()` | 获取中二数据 | `features/chuni/services/chuniService.ts` |
| `ScoreCoefficient.js` | Rating 计算 | `features/maimai/domain/scoreCoefficient.ts` |
| `MainPage.vue` - `computeRecord()` | 成绩计算 | `features/maimai/domain/recordCalculator.ts` |
| `MainPage.vue` - `merge()` | 数据合并 | `features/maimai/domain/merge.ts` |
| `MainPage.vue` - `pageToRecordList()` | 导入解析 | `features/import/domain/parser.ts` |
| `MainPage.vue` - `exportToCSV()` | CSV 导出（舞萌） | `lib/csv.ts` |
| `MainPage.vue` - `exportToCSVChuni()` | CSV 导出（中二） | `lib/csv.ts` |
| `GBK.js` | GBK 编码 | `lib/gbk.ts` |
| `MainPage.vue` - `mergeOnAllMode()` | 全曲解锁（舞萌） | `features/maimai/domain/unlock.ts` |
| `MainPage.vue` - `unlockAllChuni()` | 全曲解锁（中二） | `features/chuni/domain/unlock.ts` |

### 3.2 UI 组件映射

| 旧组件 | 功能 | 新组件（规划） |
|--------|------|---------------|
| `MainPage.vue` | 主页面 | `views/MaimaiView.vue` + `views/ChuniView.vue` |
| `ChartTable.vue` | 舞萌成绩表格 | `features/maimai/components/ChartTable.vue` |
| `ChuniTable.vue` | 中二成绩表格 | `features/chuni/components/ChuniTable.vue` |
| `FilterSlider.vue` | 筛选滑块 | `components/ui/FilterSlider.vue` |
| `ProSettings.vue` | 舞萌高级设置 | `features/maimai/components/ProSettings.vue` |
| `ProSettingsChuni.vue` | 中二高级设置 | `features/chuni/components/ProSettings.vue` |
| `Calculators.vue` | 计算器 | `features/maimai/components/Calculators.vue` |
| `ChuniOverPowerCalculators.vue` | OP 计算器 | `features/chuni/components/Calculators.vue` |
| `PlateQualifier.vue` | 牌子查询 | `features/maimai/components/PlateQualifier.vue` |
| `Profile.vue` | 用户资料 | `features/auth/components/Profile.vue` |
| `VoteBox.vue` | 投票 | `components/dashboard/VoteBox.vue` |
| `Recovery.vue` | 数据恢复 | `features/auth/components/Recovery.vue` |
| `Tutorial.vue` | 教程 | `components/dashboard/Tutorial.vue` |
| `Message.vue` | 消息 | `components/dashboard/Message.vue` |
| `Advertisement.vue` | 广告 | `components/dashboard/Advertisement.vue` |
| `Agreement.vue` | 用户协议 | `components/dashboard/Agreement.vue` |
| `DeveloperToken.vue` | 开发者令牌 | `features/auth/components/DeveloperToken.vue` |
| `ViewBadge.vue` | 访问徽章 | `components/dashboard/ViewBadge.vue` |

### 3.3 数据结构映射

| 旧数据 | 说明 | 新数据结构（规划） |
|--------|------|-------------------|
| `records[]` | 舞萌成绩记录 | `MaimaiRecord[]` in `features/maimai/types.ts` |
| `chuni_records[]` | 中二成绩记录 | `ChuniRecord[]` in `features/chuni/types.ts` |
| `music_data[]` | 舞萌乐曲数据 | `MaimaiMusicData[]` in `features/maimai/types.ts` |
| `chuni_data[]` | 中二乐曲数据 | `ChuniMusicData[]` in `features/chuni/types.ts` |
| `music_data_dict{}` | 舞萌乐曲字典 | `Map<string, MaimaiMusicData>` |
| `chuni_data_dict{}` | 中二乐曲字典 | `Map<string, ChuniMusicData>` |
| `chart_stats{}` | 谱面统计 | `ChartStats` in `types/common.ts` |
| `chart_combo{}` | 音符数量 | `ChartCombo` in `features/maimai/types.ts` |

---

## 4. API 端点清单

### 4.1 舞萌 DX API
| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/maimaidxprober/login` | POST | 用户登录 |
| `/api/maimaidxprober/register` | POST | 用户注册 |
| `/api/maimaidxprober/music_data` | GET | 获取乐曲数据 |
| `/api/maimaidxprober/player/records` | GET | 获取用户成绩 |
| `/api/maimaidxprober/player/update_records` | POST | 批量更新成绩 |
| `/api/maimaidxprober/player/update_record` | POST | 更新单条成绩 |
| `/api/maimaidxprober/chart_stats` | GET | 获取谱面统计 |
| `/api/maimaidxprober/feedback` | POST | 提交反馈 |

### 4.2 中二节奏 API
| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/chunithmprober/music_data` | GET | 获取乐曲数据 |
| `/api/chunithmprober/player/records` | GET | 获取用户成绩 |
| `/api/chunithmprober/latest_version` | GET | 获取最新版本 |

---

## 5. 验收标准总结

### 5.1 功能验收
- [ ] 所有核心流程可正常运行且行为等价
- [ ] 舞萌 DX 和中二节奏数据正确显示
- [ ] 所有筛选功能正常工作
- [ ] 导入导出功能正确
- [ ] 编辑功能正确且自动同步

### 5.2 UI 验收
- [ ] Dashboard 风格布局
- [ ] 响应式设计，支持移动端
- [ ] 使用 shadcn-vue 组件
- [ ] 交互流畅，无明显性能问题

### 5.3 数据验收
- [ ] Rating 计算结果一致
- [ ] 数据结构正确转换
- [ ] API 调用正确
- [ ] 状态管理正确

---

## 6. 已知问题和技术债务

### 6.1 当前问题
1. 单文件过大（MainPage.vue 1300+ 行）
2. 缺少类型定义（JavaScript 无 TypeScript）
3. 状态管理混乱（组件内 data 过多）
4. 缺少测试覆盖

### 6.2 需要改进
1. 将大文件拆分为模块
2. 添加 TypeScript 类型定义
3. 使用 Pinia 进行状态管理
4. 添加单元测试和集成测试

---

**文档版本**: 1.0  
**最后更新**: 2026-03-09
