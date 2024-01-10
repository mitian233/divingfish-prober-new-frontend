<script setup lang="ts">
import {topBar} from "./components";
import Toaster from '@/components/ui/toast/Toaster.vue';

</script>

<template>
  <n-loading-bar-provider>
    <n-message-provider>
      <top-bar />
      <div class="w-full">
        <router-view />
      </div>
      <Toaster />
    </n-message-provider>
  </n-loading-bar-provider>
</template>

<style scoped>

</style>
