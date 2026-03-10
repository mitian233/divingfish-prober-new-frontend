<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import TutorialDialog from '@/components/auxiliary/TutorialDialog.vue'
import RecoveryDialog from '@/components/auxiliary/RecoveryDialog.vue'
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold">工具</h1>
      <p class="text-muted-foreground">实用工具集合</p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>辅助模块</CardTitle>
        <CardDescription>低优先级辅助功能入口，便于先行前端实测。</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-wrap gap-3">
        <TutorialDialog />
        <RecoveryDialog />
      </CardContent>
    </Card>
  </div>
</template>
