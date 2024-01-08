<script setup lang="ts">
import {computed, h, ref} from "vue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {toTypedSchema} from "@vee-validate/zod";
import * as z from "zod";
import {useForm} from "vee-validate";
import {toast} from "@/components/ui/toast";
import {FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import FormMessage from "@/components/ui/form/FormMessage.vue";
import {vAutoAnimate} from '@formkit/auto-animate/vue';
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import EulaView from "@/components/eulaView.vue";
import FormDescription from "@/components/ui/form/FormDescription.vue";

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

const zodSchema = toTypedSchema(z.object({
  username: z.string({required_error: "请输入用户名",}).min(3).max(20),
  password: z.string({required_error: "请设置一个密码",}).min(6).max(20),
  passwordConfirm: z.string({required_error: "请重复您的密码",}).min(6).max(20),
  readEULA: z.boolean({required_error: "您需要同意我们的用户协议才能使用查分器",}).default(false),
}));

const form = useForm({
  validationSchema: zodSchema,
});

const {handleSubmit} = useForm({
  validationSchema: zodSchema,
});
const submitDialogMsg = ref<string>('');

const submitData = ref<{ username: string, password: string, passwordConfirm: string, readEULA: boolean }>({});
const submitToServer = (data: { username: string, password: string, passwordConfirm: string, readEULA: boolean }) => {
  let phraseData = data;
  if (!data.readEULA) {
    phraseData.readEULA = true;
  }
  toast({
    title: 'You submitted the following values:',
    description: h('pre', {class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4'}, h('code', {class: 'text-white'}, JSON.stringify(phraseData, null, 2))),
  })
};

const onSubmit = handleSubmit((values) => {
  submitData.value = values;
  if (!values.readEULA) {
    confirmTrigger.value = true;
  } else {
    submitToServer(submitData.value);
    windowStatus.value = false;
  }
});

const eulaTrigger = ref<boolean>(false);
const confirmTrigger = ref<boolean>(false);
</script>

<template>
  <Dialog v-model:open="windowStatus">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>注册</DialogTitle>
        <DialogDescription>
          <p>注册一个新的查分器账号用以使用网站所有功能。</p>
        </DialogDescription>
      </DialogHeader>
      <form v-on:submit="onSubmit">
        <FormField v-slot="{ componentField }" name="username">
          <FormItem v-auto-animate>
            <FormLabel>用户名</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="password">
          <FormItem v-auto-animate>
            <FormLabel>密码</FormLabel>
            <FormControl>
              <Input type="password" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="passwordConfirm">
          <FormItem v-auto-animate>
            <FormLabel>确认密码</FormLabel>
            <FormControl>
              <Input type="password" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
        <FormField v-slot="{ value, handleChange }" name="readEULA" type="checkbox">
          <FormItem v-auto-animate class="mt-3 flex flex-row items-start gap-x-3 space-y-0 rounded-md border p-4">
            <FormControl class="my-4">
              <Checkbox v-bind:checked="value" v-on:update:checked="handleChange"/>
            </FormControl>
            <div class="space-y-1 leading-none">
              <FormLabel>我已阅读并同意查分器的用户协议</FormLabel>
              <FormDescription>
                具体用户协议详细请 <a class="cursor-pointer underline font-bold"
                                      v-on:click="eulaTrigger = true">点击这里</a>
              </FormDescription>
              <FormMessage/>
            </div>
          </FormItem>
        </FormField>
        <DialogFooter>
          <Button type="submit">
            注册
          </Button>
          <Button type="button" v-on:click="windowStatus = false" variant="secondary">
            关闭
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
  <eula-view v-model:handle-open="eulaTrigger"/>
  <Dialog :open="confirmTrigger">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>确认</DialogTitle>
        <p>若您继续注册表示您同意我们的用户协议，继续吗？</p>
        <DialogFooter>
          <Button type="button" v-on:click="submitToServer(submitData); confirmTrigger = false; windowStatus = false">
            我同意
          </Button>
          <Button type="button" v-on:click="confirmTrigger = false; windowStatus = false" variant="secondary">
            关闭
          </Button>
        </DialogFooter>
      </DialogHeader>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>
