<script setup lang="ts">
import {ref} from 'vue';
import type { FormInst } from 'naive-ui';

import {account} from "../store/account.ts";

const formRef = ref<FormInst | null>(null)
const formValue = ref<any>({
  name:account.username,
  pass:account.password
})
const formRule = {
  name:{
    required: true,
    message: '请输入用户名',
    trigger: ['input', 'blur']
  },
  pass:{
    required: true,
    message: '请输入密码',
    trigger: ['input', 'blur']
  }
}

</script>

<template>
<div>
  <n-message-provider>
    <n-form ref="formRef" label-width="80" :model="formValue" :rules="formRule" :size="'medium'">
      <n-form-item label="用户名/邮箱" path="name">
        <n-input v-model:value="formValue.name" placeholder="输入用户识别字符串" />
      </n-form-item>
      <n-form-item label="密码" path="pass">
        <n-input v-model:value="formValue.pass" placeholder="输入密码" type="password"/>
      </n-form-item>
    </n-form>
  </n-message-provider>
</div>
</template>

<style scoped>

</style>
