<script setup lang="ts">
import ChuniProSettings from "@/components/proSettings/chuniProSettings.vue";
</script>

<template>
<div>
  <Accordion type="single" class="w-full" collapsible>
    <AccordionItem key="ProSettingsChuni" value="ProSettingsChuni">
      <AccordionTrigger>高级筛选</AccordionTrigger>
      <AccordionContent>
        <ChuniProSettings />
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</div>
</template>

<style scoped>

</style>
