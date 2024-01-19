<script setup lang="ts">
import MaiProSettings from "@/components/proSettings/maiProSettings.vue";
import { useStore } from '@/store';
import {AccordionContent, AccordionItem, AccordionTrigger, AccordionRoot} from "radix-vue";
const store = useStore();
</script>

<template>
<div>
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
