# maimaidx-prober-v3

舞萌DX | 中二节奏查分器 - 重构版本

## 技术栈

- **框架**: Vue 3.5 + TypeScript 5.9
- **构建工具**: Vite 7.3
- **路由**: Vue Router 4.6
- **状态管理**: Pinia 3.0
- **UI 组件**: shadcn-vue (Reka UI + Tailwind CSS v4)
- **样式**: Tailwind CSS 4.2 + CSS Variables
- **图标**: lucide-vue-next

## 项目结构

```
src/
├── app/                    # 应用配置
│   └── router.ts          # 路由配置
├── components/            # 组件
│   └── ui/               # shadcn-vue UI 组件
├── features/             # 功能模块
│   ├── auth/            # 认证模块
│   ├── maimai/          # 舞萌DX模块
│   └── chuni/           # 中二节奏模块
├── layouts/              # 布局组件
│   └── DashboardLayout.vue
├── lib/                  # 工具库
│   └── utils.ts
├── stores/               # Pinia stores
│   ├── auth.ts
│   └── index.ts
├── views/                # 页面视图
│   ├── OverviewView.vue
│   ├── MaimaiView.vue
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

## 文档

- [BASELINE.md](./BASELINE.md) - 功能基线文档
- [PROGRESS_DAY1.md](./PROGRESS_DAY1.md) - 第一天进度
- [PROGRESS_DAY2.md](./PROGRESS_DAY2.md) - 第二天进度

## 重构进度

- ✅ 阶段 0: 基线冻结
- ✅ 阶段 1: 工程脚手架与 UI 基座
- 🚧 阶段 2: 先迁移领域逻辑与 API（进行中）
- ⏳ 阶段 3: Maimai 页面模块化迁移
- ⏳ 阶段 4: Chunithm 页面模块化迁移
- ⏳ 阶段 5: 联调、回归、切换

## 许可证

MIT
