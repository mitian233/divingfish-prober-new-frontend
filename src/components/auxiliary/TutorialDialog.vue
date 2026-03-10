<script setup lang="ts">
import { shallowRef } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const open = shallowRef(false)

const sections = [
  {
    title: '登录并同步数据',
    content: '用于登录账号并同步云端分数；注册账号也在该入口。',
  },
  {
    title: '导入数据',
    content: '舞萌支持页面源代码导入；中二支持 JSON / CSV 导入。',
  },
  {
    title: '导出 CSV',
    content: '可导出当前成绩，GBK 编码适合 Excel 打开。',
  },
  {
    title: '牌子查询',
    content: '可查看指定版本下 Master 或全难度的制霸进度。',
  },
  {
    title: '筛选与高级设置',
    content: '可按等级/定数、FC/FS、评级、版本、分类组合筛选。',
  },
  {
    title: '计算器与拟合难度',
    content: '支持分数/Rating/OP 计算，拟合难度可查看统计分布图。',
  },
  {
    title: '解锁全曲',
    content: '仅用于查看未游玩谱面的信息，不会写回账号。',
  },
]
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline">使用指南</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[900px] max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>查分器网页使用指南</DialogTitle>
      </DialogHeader>
      <div class="space-y-4 text-sm leading-6">
        <p class="text-muted-foreground">
          这是一份精简版快速指南，先掌握主流程，再按需深入工具页。
        </p>
        <section v-for="section in sections" :key="section.title" class="space-y-1">
          <h3 class="font-semibold text-base">{{ section.title }}</h3>
          <p class="text-muted-foreground">{{ section.content }}</p>
        </section>
      </div>
    </DialogContent>
  </Dialog>
</template>
