<script setup lang="ts">
import TopBar from "./components/topBar.vue";
import Toaster from '@/components/ui/toast/Toaster.vue';
</script>

<template>
  <n-loading-bar-provider>
    <n-message-provider>
      <top-bar />
      <div class="w-full px-5 pt-3">
        <router-view />
      </div>
      <Toaster />
    </n-message-provider>
  </n-loading-bar-provider>
</template>

<style scoped>

</style>
