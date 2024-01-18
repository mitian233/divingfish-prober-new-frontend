<script setup lang="ts">
import MaiProSettings from "@/components/proSettings/maiProSettings.vue";
import { useStore } from '@/store';
const store = useStore();
</script>

<template>
<div>
  <Accordion type="single" class="w-full" collapsible>
    <AccordionItem key="ProSettings" value="ProSettings">
      <AccordionTrigger>高级筛选</AccordionTrigger>
      <AccordionContent>
        <MaiProSettings />
      </AccordionContent>
    </AccordionItem>
  </Accordion>

</div>
</template>

<style scoped>

</style>
