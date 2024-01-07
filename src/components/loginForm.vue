<script setup lang="ts">
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";

const emits = defineEmits<any>(['onSwitch'])

</script>

<template>
  <Sheet v-model:open="">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>登陆/注册</SheetTitle>
        <SheetDescription>

        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
</template>

<style scoped>

</style>
