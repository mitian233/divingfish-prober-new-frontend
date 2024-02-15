<script setup lang="ts">
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose} from "@/components/ui/sheet";
import {Switch} from "@/components/ui/switch";
import {vAutoAnimate} from '@formkit/auto-animate/vue';
import {computed, ref} from "vue";
import SheetDescription from "@/components/ui/sheet/SheetDescription.vue";
import {useForm} from 'vee-validate';
import {toTypedSchema} from '@vee-validate/zod';
import * as z from 'zod';
import {_account} from "@/store";
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form';
import {Popover, PopoverContent, PopoverTrigger,} from '@/components/ui/popover';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Separator from "@/components/ui/separator/Separator.vue";
import {RefreshCcw, ClipboardCopy, Link} from 'lucide-vue-next';
import {useToast} from "@/components/ui/toast";

const {toast} = useToast();

const zodObjProfile = z.object({
  nickname: z.string({required_error: "请设置昵称",}).min(1, {message: '昵称不能为空'}).max(8, {message: '昵称不能超过 8 个字符'})
});

const profileFormSchema = toTypedSchema(zodObjProfile);

const form = useForm({
  validationSchema: profileFormSchema,
});

const props = defineProps(['handleOpen']);
const emit = defineEmits(['update:handleOpen']);

const isOpen = computed({
  get() {
    return props.handleOpen
  },
  set(value) {
    emit('update:handleOpen', value)
  }
})

const generateTokenVisible = ref<boolean>(false);

const copyToClipboard = (str: string) => {
  navigator.clipboard.writeText(str).then(() => {
    toast({title: "已复制到剪贴板"});
  }).catch(() => {
    toast({title: "剪贴板写入失败", variant: "destructive"});
  });
};

const ratings: Array<{ label: string, ra: number }> = [
  {label: "初学者", ra: 0},
  {label: "初段", ra: 1},
  {label: "二段", ra: 2},
  {label: "三段", ra: 3},
  {label: "四段", ra: 4},
  {label: "五段", ra: 5},
  {label: "六段", ra: 6},
  {label: "七段", ra: 7},
  {label: "八段", ra: 8},
  {label: "九段", ra: 9},
  {label: "十段", ra: 10},
  {label: "真初段", ra: 11},
  {label: "真二段", ra: 12},
  {label: "真三段", ra: 13},
  {label: "真四段", ra: 14},
  {label: "真五段", ra: 15},
  {label: "真六段", ra: 16},
  {label: "真七段", ra: 17},
  {label: "真八段", ra: 18},
  {label: "真九段", ra: 19},
  {label: "真十段", ra: 20},
  {label: "真皆传", ra: 21},
  {label: "里皆传", ra: 22},
];
const versions_src = [
  "maimai PLUS",
  "maimai GreeN",
  "maimai GreeN PLUS",
  "maimai ORANGE",
  "maimai ORANGE PLUS",
  "maimai PiNK",
  "maimai PiNK PLUS",
  "maimai MURASAKi",
  "maimai MURASAKi PLUS",
  "maimai MiLK",
  "MiLK PLUS",
  "maimai FiNALE",
  "ALL FiNALE",
  "maimai でらっくす",
  "maimai でらっくす PLUS",
  "maimai でらっくす Splash",
  "maimai でらっくす Splash PLUS",
  "maimai でらっくす UNiVERSE",
  "maimai でらっくす UNiVERSE PLUS",
];

</script>

<template>
  <Sheet v-model:open="isOpen">
    <SheetContent side="right">
      <SheetHeader>
        <SheetTitle>个人资料</SheetTitle>
        <SheetDescription>{{ _account.nickname }}，欢迎回来</SheetDescription>
      </SheetHeader>
      <form v-on:submit="">
        <FormField v-slot="{ componentField }" name="nickname">
          <FormItem v-auto-animate>
            <FormLabel>昵称</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" v-model="_account.nickname"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
      </form>
      <div class="mt-2">
        <Label>成绩导入 Token</Label>
        <Input class="mt-1" type="text" placeholder="abcdefghijklmnopqrstuvwxyz1234567890" disabled
               v-model="_account.import_token"/>
        <div class="my-2 grid grid-cols-3 gap-3">
          <Popover v-model:open="generateTokenVisible">
            <PopoverTrigger>
              <Button variant="ghost" class="w-full">
                <RefreshCcw/>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div class="grid gap-4">
                <div class="space-y-2">
                  <h4 class="font-medium leading-none">
                    生成 Token
                  </h4>
                  <p class="text-sm text-muted-foreground">
                    确定生成新的 Token？旧的 Token 将失效。
                  </p>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <Button v-on:click="">好</Button>
                  <Button variant="secondary" v-on:click="generateTokenVisible = false">取消</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="ghost" v-on:click="copyToClipboard(_account.import_token)">
            <ClipboardCopy/>
          </Button>
          <Button variant="ghost"
                  v-on:click="copyToClipboard('https://www.diving-fish.com/prober-import/?t='+_account.import_token)">
            <Link/>
          </Button>
        </div>
      </div>
      <div class="mb-2">
        <Label class="mt-2">绑定 QQ 号</Label>
        <Input class="mt-1" type="text" placeholder="QQ" v-model="_account.qq"/>
        <Label class="mt-2">绑定频道 ID</Label>
        <Input class="mt-1" type="text" placeholder="频道 ID" v-model="_account.qq_guild_id"/>
        <Label class="mt-2">段位</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="段位选择器" class="mt-1"/>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>段位</SelectLabel>
              <SelectItem v-for="i in ratings" :value="i.ra.toString()">
                {{ i.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div class="mt-2 flex items-center space-x-2">
          <Switch id="ban-other"/>
          <Label for="ban-other">禁止其他人查询我的成绩</Label>
        </div>
        <div class="mt-2 flex items-center space-x-2">
          <Switch id="use-hide-code"/>
          <Label for="use-hide-code">对非网页查询的成绩使用掩码</Label>
        </div>
      </div>
      <SheetFooter>
        <Button>保存</Button>
        <SheetClose as-child>
          <Button variant="secondary">取消</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<style scoped>

</style>
