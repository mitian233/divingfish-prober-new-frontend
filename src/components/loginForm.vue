<script setup lang="ts">
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import { toast } from "@/components/ui/toast";
import { Input } from '@/components/ui/input';
import { toTypedSchema } from '@vee-validate/zod';
import { vAutoAnimate } from '@formkit/auto-animate/vue';
import { useForm } from 'vee-validate';
import {FormControl, FormField, FormItem, FormLabel} from '@/components/ui/form';
import * as z from 'zod';
import { computed, h, ref } from 'vue';
import Button from "@/components/ui/button/Button.vue";
import RegForm from "@/components/regForm.vue";

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

const onSubmit = handleSubmit((values) => {
  toast({
    title: 'You submitted the following values:',
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  })
})

const regFormTrigger = ref<boolean>(false);

</script>

<template>
  <Dialog v-model:open="value">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>登录</DialogTitle>
        <DialogDescription>
          <p>请使用您的账号密码登录查分器以同步数据。</p>
          <p>如果您还没有账号，请<a class="underline cursor-pointer" v-on:click="regFormTrigger = true;value = false">注册一个</a>。</p>
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
        <DialogFooter>
          <Button type="submit">
            登录
          </Button>
          <Button type="button" v-on:click="regFormTrigger = true;value = false" variant="secondary">
            注册
          </Button>
          <Button type="button" v-on:click="value = false" variant="secondary">
            关闭
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
  <reg-form v-model:handle-open="regFormTrigger"/>
</template>

<style scoped>

</style>
