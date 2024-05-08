<script setup lang="ts">
import MaiProSettings from "@/components/proSettings/maiProSettings.vue";
import { useStore } from '@/store';
import {AccordionRoot} from "radix-vue";
import {AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button'
const store = useStore();
</script>

<template>
<div>
  <div class="flex gap-2 flex-col md:flex-row">
    <Button class="w-full" variant="outline">导出CSV</Button>
    <Button class="w-full" variant="outline">解锁全曲</Button>
  </div>
  <AccordionRoot type="single" class="w-full" collapsible>
    <AccordionItem key="ProSettings" value="ProSettings">
      <AccordionTrigger>高级筛选</AccordionTrigger>
      <AccordionContent>
        <MaiProSettings />
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>

</div>
</template>

<style scoped>

</style>
