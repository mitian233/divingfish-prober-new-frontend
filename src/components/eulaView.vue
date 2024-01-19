<script setup lang="ts">
import {computed} from "vue";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog";

const props = defineProps(['handleOpen']);
const emit = defineEmits(['update:handleOpen']);

const value = computed({
  get() {
    return props.handleOpen
  },
  set(value) {
    emit('update:handleOpen', value)
  }
});
</script>

<template>
  <Dialog v-model:open="value">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>用户协议</DialogTitle>
        <DialogDescription>
          <p>如果您不同意本条款，您将无法正常使用舞萌 DX 查分器的相关功能。</p>
        </DialogDescription>
      </DialogHeader>
      <div class="h-[60vh] overflow-auto">
        <p>
          尊敬的用户，感谢您选择使用舞萌 DX 查分器。<br>
          为了保障您的权益和确保您的信息安全，我们制定了以下用户协议，请您仔细阅读并同意以下条款：<br><br>
          1. 注册和账号安全<br>
          1.1 为了使用完整的账号功能，您需注册一个账号并同意用户协议。<br>
          1.2 您应对您的账号和密码负有保密责任，请勿将其提供给任何第三方。<br>
          1.3 如您发现有任何未经授权使用您账号的情况，应立即通知我们。<br><br>
          2. 公开成绩信息风险<br>
          2.1 在本网站上公开您的成绩信息时，存在被不怀好意的攻击者利用并进行网络攻击的风险，成绩掩码并不能完全防止攻击者的攻击。<br>
          2.2 请您谨慎选择公开成绩信息，并对因此造成的任何风险和后果承担责任。如果您想要公开您的成绩信息，请在个人资料界面取消勾选“禁止其他人查询我的成绩”。<br><br>
          3. 网络攻击风险免责<br>
          3.1 本网站将采取合理的技术手段保护您的信息安全，但无法完全消除网络攻击的风险。<br>
          3.2 如果因为您在使用本网站时泄露了个人信息而导致被攻击，我们将不承担任何责任。<br><br>
          4. 其他<br>
          4.1 本协议适用中华人民共和国的法律法规。<br><br>
          <NText type="error">如果您不同意本条款，您将无法正常使用舞萌 DX 查分器的相关功能。</NText>
        </p>
      </div>
      <DialogFooter>
        <Button @click="value = false">已读</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>
