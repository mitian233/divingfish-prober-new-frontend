<script setup lang="ts">
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import { useToast } from "@/components/ui/toast";
import { Input } from '@/components/ui/input';
import { toTypedSchema } from '@vee-validate/zod';
import { vAutoAnimate } from '@formkit/auto-animate/vue';
import { useForm } from 'vee-validate';
import {FormControl, FormField, FormItem, FormLabel} from '@/components/ui/form';
import * as z from 'zod';
import { computed, h } from 'vue';
import Button from "@/components/ui/button/Button.vue";
import {$requireSignUp} from "@/store/account.ts";
import axios from "axios";

const {toast} = useToast();

const props = defineProps(['handleOpen']);
const emit = defineEmits(['update:handleOpen']);

const windowStatus = computed({
  get() {
    return props.handleOpen
  },
  set(value) {
    emit('update:handleOpen', value)
  }
});

const formSchema = toTypedSchema(z.object({
  username: z.string(),
  password: z.string(),
}));

const form = useForm({
  validationSchema: formSchema,
});

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

const sendLoginReq = (data:{username:string, password:string}) => {
  axios.post("https://www.diving-fish.com/api/maimaidxprober/login", data)
      .then(() => {
        toast({title: '登录成功', description: '您已成功登录查分器。'})
      })
      .catch((error) => {
        toast({title: '登录失败', description: '错误原因：' + error.response.message, variant: 'destructive'})
      })
}

const onSubmit = handleSubmit((values) => {
  sendLoginReq(values);
  windowStatus.value = false;
  setTimeout(() => {
    window.location.reload();
  }, 1000);
})

</script>

<template>
  <Dialog v-model:open="windowStatus">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>登录</DialogTitle>
        <DialogDescription>
          <p>请使用您的账号密码登录查分器以同步数据。</p>
          <p>如果您还没有账号，请<a class="underline cursor-pointer" v-on:click="$requireSignUp.value = true;windowStatus = false">注册一个</a>。</p>
        </DialogDescription>
      </DialogHeader>
      <form v-on:submit="onSubmit">
        <FormField v-slot="{ componentField }" name="username" :rules="{ required: false }">
          <FormItem v-auto-animate>
            <FormLabel>用户名</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="password" :rules="{ required: false }">
          <FormItem v-auto-animate>
            <FormLabel>密码</FormLabel>
            <FormControl>
              <Input type="password" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <DialogFooter class="mt-3">
          <Button type="submit">
            登录
          </Button>
          <Button type="button" v-on:click="$requireSignUp.value = true;windowStatus = false" variant="secondary">
            注册
          </Button>
          <!--
          <Button type="button" v-on:click="value = false" variant="secondary">
            关闭
          </Button>
          -->
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>
