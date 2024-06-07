<script setup lang="ts">
import {topBar} from "./components";
import Toaster from '@/components/ui/toast/Toaster.vue';
import { NConfigProvider } from 'naive-ui';
import { zhCN, dateZhCN } from 'naive-ui';

</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <n-loading-bar-provider>
            <top-bar />
            <div class="w-full">
              <router-view />
            </div>
            <Toaster />
          </n-loading-bar-provider>
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style scoped>

</style>
