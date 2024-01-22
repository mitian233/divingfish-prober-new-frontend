<script setup lang="ts">
import {ref} from "vue";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import {loginForm, tutorialView, recoverForm, regForm, aboutView, myAccountView} from "@/components";
import {$requireLogin, $requireSignUp, $requireResetPassword} from "@/store/account.ts";
import {Menu as MenuIcon} from 'lucide-vue-next';
import {maiprober} from "@/lib/shareLinks.ts";

const OpenInNewTab = (url: string) => {
  const win = window.open(url, '_blank');
  if (win != null) {
    win.focus();
  }
}

const toggleTutorialDialog = ref<boolean>(false);
const toggleAboutDialog = ref<boolean>(false);
const toggleMyAccountDialog = ref<boolean>(false);

</script>

<template>
  <div class="sticky z-40 top-0 bg-background/80 backdrop-blur-lg border-b border-border">
    <div class="container flex justify-between h-14 items-center">
      <div class="mr-4 flex">
        <router-link to="/">舞萌 DX | 中二节奏查分器</router-link>
        <NTooltip trigger="hover">
          <template #trigger>
            <a :href="maiprober" class="mr-0.5"><img
              src="https://img.shields.io/github/stars/Diving-Fish/maimaidx-prober?style=social"/></a>
          </template>
          点个 Star 吧！
        </NTooltip>
      </div>
      <div class="flex items-center justify-end space-x-4">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>
              <MenuIcon/>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem v-on:click="$requireLogin.value = true">
                登录/注册
              </MenubarItem>
              <MenubarItem v-on:click="$requireResetPassword.value = true">
                重置账号
              </MenubarItem>
              <MenubarItem v-on:click="toggleMyAccountDialog = true">
                我的账号
              </MenubarItem>
              <MenubarSeparator/>
              <MenubarItem v-on:click="OpenInNewTab('/maimaidx/prober_guide');">
                数据导入指南
              </MenubarItem>
              <MenubarItem v-on:click="toggleTutorialDialog = true">
                查分器使用指南
              </MenubarItem>
              <MenubarSeparator/>
              <MenubarItem v-on:click="toggleAboutDialog = true">关于</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <tutorial-view v-model:model-value="toggleTutorialDialog"/>
        <login-form v-model:handle-open="$requireLogin.value"/>
        <reg-form v-model:handle-open="$requireSignUp.value"/>
        <recover-form v-model:handle-open="$requireResetPassword.value"/>
        <about-view v-model:handle-open="toggleAboutDialog"/>
        <my-account-view v-model:handle-open="toggleMyAccountDialog"/>
      </div>
    </div>
    <hr/>
  </div>
</template>

<style scoped>

</style>
