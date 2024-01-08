<script setup lang="ts">
import {h, ref} from "vue";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import {useToast} from '@/components/ui/toast/use-toast'
import LoginForm from "@/components/loginForm.vue";
import TutorialView from "@/components/tutorialView.vue";

const {toast} = useToast();

const OpenInNewTab = (url: string) => {
  const win = window.open(url, '_blank');
  if (win != null) {
    win.focus();
  }
}

const tutorialDialogTrigger = ref<boolean>(false);

const loginDialogTrigger = ref<boolean>(false);

</script>

<template>
  <div class="sticky z-40 top-0 bg-background/80 backdrop-blur-lg border-b border-border">
    <div class="container flex justify-between h-14 items-center">
      <div class="mr-4 flex">
        舞萌 DX | 中二节奏查分器
      </div>
      <div class="flex items-center justify-end space-x-4">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Menu</MenubarTrigger>
            <MenubarContent>
              <MenubarItem v-on:click="loginDialogTrigger = true">
                登录/注册
              </MenubarItem>
              <MenubarItem>
                我的账号
              </MenubarItem>
              <MenubarSeparator/>
              <MenubarItem v-on:click="OpenInNewTab('/maimaidx/prober_guide');">
                数据导入指南
              </MenubarItem>
              <MenubarItem v-on:click="tutorialDialogTrigger = true">
                查分器使用指南
              </MenubarItem>
              <MenubarSeparator/>
              <MenubarItem
                  v-on:click="toast({title:'关于本站', description: h('pre', {class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4'}, h('code', {class: 'text-white'}, JSON.stringify('ver 0.0.0', null, 2))),})">
                关于
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <tutorial-view v-model:model-value="tutorialDialogTrigger"/>
        <login-form v-model:handle-open="loginDialogTrigger"/>
      </div>
    </div>
    <hr/>
  </div>
</template>

<style scoped>

</style>
