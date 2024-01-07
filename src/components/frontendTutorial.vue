<script setup lang="ts">
import {ComponentInternalInstance, getCurrentInstance, h} from "vue";
import tutorial from './tutorial.vue';

const { appContext } = getCurrentInstance() as ComponentInternalInstance;
const proxy = appContext.config.globalProperties;

const handleTutorial = () => {
  proxy.$nUseDialog.info({
    title: '查分器网页使用指南',
    content: () => {
      return(
          h('div',[
            h(tutorial),
          ])
      )}
  })
}
</script>

<template>
  <n-button v-on:click="handleTutorial">查分器网页使用指南</n-button>
</template>

<style scoped>

</style>
