<script setup lang="ts">
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {computed} from "vue";

const props = defineProps(['handleOpen']);
const emit = defineEmits(['update:handleOpen']);

const isOpen = computed({
  get() {
    return props.handleOpen
  },
  set(value) {
    emit('update:handleOpen', value)
  }
});
</script>

<template>
  <Sheet v-model:open="isOpen">
    <SheetContent side="bottom">
      <SheetHeader>
        <SheetTitle>我的账户</SheetTitle>
      </SheetHeader>
    </SheetContent>
  </Sheet>
</template>

<style scoped>

</style>
