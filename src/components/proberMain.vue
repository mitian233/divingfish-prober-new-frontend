<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {onMounted, ref, watch} from 'vue';
import ChartTable from "@/components/chartTable.vue";
import ChuniTable from "@/components/chuniTable.vue";

/*
import { useCookie } from '@/plugins/useCookie.ts';
const cookie = new useCookie();
*/
const tabModel = ref<string>('maimaiTable');
/*
watch(tabModel, (newVal) => {
  cookie.setCookie('proberTab', newVal, 7);
});

onMounted(() => {
  const cookieTab = cookie.getCookie('proberTab');
  if (cookieTab !== null) {
    tabModel.value = cookieTab.toString();
  }
});
*/
</script>

<template>
<div class="min-h-screen py-5 md:px-10">
<Card>
  <CardHeader>
  </CardHeader>
  <CardContent>
    <Tabs v-model="tabModel">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="maimaiTable">
          舞萌数据表
        </TabsTrigger>
        <TabsTrigger value="chuniTable">
          中二数据表
        </TabsTrigger>
      </TabsList>
      <TabsContent value="maimaiTable">
        <ChartTable />
      </TabsContent>
      <TabsContent value="chuniTable">
        <ChuniTable />
      </TabsContent>
    </Tabs>
  </CardContent>
</Card>
</div>
</template>

<style scoped>

</style>
