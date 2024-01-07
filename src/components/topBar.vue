<script setup lang="ts">
import {ref, getCurrentInstance, ComponentInternalInstance, h} from "vue";
import type { DropdownOption } from 'naive-ui';
import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger,} from '@/components/ui/menubar';
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,} from '@/components/ui/sheet'
import loginView from './loginView.vue';
import tutorial from './tutorial.vue';
import { useToast } from '@/components/ui/toast/use-toast'
import LoginForm from "@/components/loginForm.vue";

const { toast } = useToast();

const { appContext } = getCurrentInstance() as ComponentInternalInstance;
const proxy = appContext.config.globalProperties;

const OpenInNewTab = (url: string) => {
  const win = window.open(url, '_blank');
  if (win != null) {
    win.focus();
  }
}

const dropdownItems = ref<DropdownOption[]>([
  {
    label: "登陆/注册",
    key: "login"
  },
  {
    label: "我的账号",
    key: "myAccount"
  },
  {
    label: "数据导入指南",
    key: "dataImportGuide"
  },
  {
    label: "查分器使用指南",
    key: "frontendTutorial"
  },
  {
    label: "关于",
    key: "about"
  }
])

const handleClick = (key: string | number) => {
  switch (key){
    case "login":{
      handleLogin();
      break;
    }
    case "myAccount":{
      break;
    }
    case "dataImportGuide":{
      window.open('/maimaidx/prober_guide');
      break;
    }
    case "frontendTutorial":{
      proxy.$nUseDialog.info({
        title: '查分器网页使用指南',
        content: () => {
          return(
              h('div',[
                h(tutorial),
              ])
          )}
      })
      break;
    }
    default:{
      proxy.$nUseMessage.info(key.toString());
    }
  }
}

const tutorialDialogTrigger = ref<boolean>(false);

const loginDialogTrigger = ref<boolean>(false);

const handleLogin = () => {
  proxy.$nUseDialog.info({
    title: '账号注册/登陆',
    content: () => h(loginView)
  })
}

</script>

<template>
  <div class="sticky z-40 top-0 bg-background/80 backdrop-blur-lg border-b border-border">
    <div class="container flex justify-between h-14 items-center">
      <div class="mr-4 flex">
        舞萌 DX | 中二节奏查分器
      </div>
      <div class="flex items-center justify-end space-x-4">
        <!--
        <n-dropdown :options="dropdownItems" placement="bottom-end" trigger="click" v-on:select="handleClick">
          <n-button quaternary type="primary">Menu</n-button>
        </n-dropdown>
        -->
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Menu</MenubarTrigger>
            <MenubarContent>
              <MenubarItem v-on:click="handleLogin">
                登录/注册
              </MenubarItem>
              <MenubarItem>
                我的账号
              </MenubarItem>
              <MenubarSeparator/>
              <MenubarItem v-on:click="OpenInNewTab('/maimaidx/prober_guide');">
                数据导入指南
              </MenubarItem>
              <MenubarItem v-on:click="tutorialDialogTrigger = !tutorialDialogTrigger">
                查分器使用指南
              </MenubarItem>
              <MenubarSeparator/>
              <MenubarItem v-on:click="toast({title:'关于本站'})">
                关于
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <Sheet v-model:open="tutorialDialogTrigger">
          <!--<SheetTrigger class="relative w-full flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            查分器使用指南
          </SheetTrigger>-->
          <SheetContent>
            <SheetHeader>
              <SheetTitle>查分器使用指南</SheetTitle>
              <SheetDescription>
                <tutorial class="overflow-auto h-[90vh]"/>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <login-form :is-open="loginDialogTrigger"/>
      </div>
    </div>
    <hr/>
  </div>
</template>

<style scoped>

</style>
