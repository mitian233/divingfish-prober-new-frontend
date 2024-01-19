<script setup lang="ts">
import ChuniProSettings from "@/components/proSettings/chuniProSettings.vue";
import {AccordionContent, AccordionItem, AccordionRoot, AccordionTrigger} from "radix-vue";
</script>

<template>
<div>
  <AccordionRoot type="single" class="w-full" collapsible>
    <AccordionItem key="ProSettingsChuni" value="ProSettingsChuni">
      <AccordionTrigger>高级筛选</AccordionTrigger>
      <AccordionContent>
        <ChuniProSettings />
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</div>
</template>

<style scoped>

</style>
