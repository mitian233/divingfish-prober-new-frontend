<script setup lang="ts">
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";

import { computed } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
});
</script>

<template>
  <Sheet v-model:open="value">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>查分器使用指南</SheetTitle>
        <SheetDescription>
          <tutorial class="overflow-auto h-[90vh]"/>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
</template>

<style scoped>

</style>
