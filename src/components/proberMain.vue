<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {ref} from 'vue';

const defaultTab = ref<string>('maimaiTable');
</script>

<template>
<div class="min-h-screen py-5 md:px-10">
<Card>
  <CardHeader>
  </CardHeader>
  <CardContent>
    <Tabs :default-value="defaultTab">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="maimaiTable">
          舞萌数据表
        </TabsTrigger>
        <TabsTrigger value="chuniTable">
          中二数据表
        </TabsTrigger>
      </TabsList>
      <TabsContent value="maimaiTable">
        DataTable1
      </TabsContent>
      <TabsContent value="chuniTable">
        DataTable2
      </TabsContent>
    </Tabs>
  </CardContent>
</Card>
</div>
</template>

<style scoped>

</style>
