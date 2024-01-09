<script setup lang="ts">
import {computed} from "vue";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {toTypedSchema} from "@vee-validate/zod";
import * as z from "zod";
import {useForm} from "vee-validate";
import FormMessage from "@/components/ui/form/FormMessage.vue";
import {FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {vAutoAnimate} from '@formkit/auto-animate/vue';
import DialogFooter from "@/components/ui/dialog/DialogFooter.vue";
import {useToast} from "@/components/ui/toast";
import axios from "axios";

const {toast} = useToast();

const props = defineProps(['handleOpen']);
const emit = defineEmits(['update:handleOpen']);

const isOpen = computed({
  get() {
    return props.handleOpen
  },
  set(value) {
    emit('update:handleOpen', value)
  }
});

const zodSchema = toTypedSchema(z.object({
  qq: z.number({required_error: "请输入您的 QQ 号码",invalid_type_error:'请输入数字'}).min(4).max(9999999999),
}));

const form  = useForm({
  validationSchema: zodSchema,
});
const {handleSubmit} = useForm({
  validationSchema: zodSchema,
});

const onSubmit = handleSubmit((values) => {
  sendRecoveryEmail(values.qq.toString());
});

const sendRecoveryEmail = (qq:string) => {
  axios.post("https://www.diving-fish.com/api/maimaidxprober/recovery?qq=" + qq).then(() => {
    toast({
      title: '邮件已发送',
      description: '请前往您的 QQ 邮箱查看',
      variant: 'default',
    })});
  isOpen.value = false;
}

</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>重置账户</DialogTitle>
        <DialogDescription>
          该功能仅限绑定 QQ 的账户使用，我们将会往您的 QQ 邮箱发送账户重置的邮件。
        </DialogDescription>
      </DialogHeader>
      <form v-on:submit="onSubmit">
        <FormField v-slot="{ componentField }" name="qq">
          <FormItem v-auto-animate>
            <FormLabel>qq号</FormLabel>
            <FormControl>
              <Input type="number" v-bind="componentField" />
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
        <DialogFooter class="mt-3">
          <Button type="submit">
            发送邮件
          </Button>
          <Button type="button" v-on:click="isOpen = false" variant="secondary">
            取消
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>
