<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/components/ui/card';
</script>

<template>
<div class="min-h-screen py-5 md:px-10">
<Card>
  <CardHeader>
  </CardHeader>
  <CardContent>
    <n-tabs type="segment" animated>
      <n-tab-pane name="maimaiTable" tab="舞萌数据表">
        DataTable
      </n-tab-pane>
      <n-tab-pane name="chuniTable" tab="中二数据表">
        DataTable
      </n-tab-pane>
    </n-tabs>
  </CardContent>
</Card>
</div>
</template>

<style scoped>

</style>
