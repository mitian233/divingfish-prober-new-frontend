<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  Home,
  Music,
  Music2,
  Wrench,
  Settings,
  Menu,
  LogOut,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isMobileMenuOpen = ref(false)

const navItems = [
  { path: '/overview', label: '总览', icon: Home },
  { path: '/maimai', label: '舞萌DX', icon: Music },
  { path: '/chuni', label: '中二节奏', icon: Music2 },
  { path: '/tools', label: '工具', icon: Wrench },
  { path: '/settings', label: '个人设置', icon: Settings },
]

const currentRoute = computed(() => route.path)

function navigateTo(path: string) {
  router.push(path)
  isMobileMenuOpen.value = false
}

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Desktop Sidebar -->
    <aside class="fixed inset-y-0 left-0 z-50 hidden w-64 border-r bg-card lg:block">
      <div class="flex h-full flex-col">
        <!-- Logo -->
        <div class="flex h-16 items-center border-b px-6">
          <h1 class="text-xl font-bold">maimaidx-prober</h1>
        </div>

        <!-- Navigation -->
        <ScrollArea class="flex-1 px-3 py-4">
          <nav class="space-y-2">
            <Button
              v-for="item in navItems"
              :key="item.path"
              :variant="currentRoute === item.path ? 'secondary' : 'ghost'"
              class="w-full justify-start"
              @click="navigateTo(item.path)"
            >
              <component :is="item.icon" class="mr-2 h-4 w-4" />
              {{ item.label }}
            </Button>
          </nav>
        </ScrollArea>

        <!-- User Info -->
        <div class="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" class="w-full justify-start">
                <Avatar class="mr-2 h-6 w-6">
                  <AvatarFallback>
                    {{ authStore.username.slice(0, 2).toUpperCase() }}
                  </AvatarFallback>
                </Avatar>
                <span class="truncate">{{ authStore.username }}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-56">
              <DropdownMenuLabel>我的账户</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="navigateTo('/settings')">
                <Settings class="mr-2 h-4 w-4" />
                设置
              </DropdownMenuItem>
              <DropdownMenuItem v-if="authStore.isLoggedIn" @click="handleLogout">
                <LogOut class="mr-2 h-4 w-4" />
                登出
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>

    <!-- Mobile Header -->
    <header class="fixed top-0 left-0 right-0 z-40 border-b bg-card lg:hidden">
      <div class="flex h-16 items-center justify-between px-4">
        <Sheet v-model:open="isMobileMenuOpen">
          <SheetTrigger as-child>
            <Button variant="ghost" size="icon">
              <Menu class="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" class="w-64 p-0">
            <SheetHeader class="h-16 border-b px-6">
              <SheetTitle class="flex items-center">
                <h1 class="text-xl font-bold">maimaidx-prober</h1>
              </SheetTitle>
            </SheetHeader>
            <ScrollArea class="flex-1 px-3 py-4">
              <nav class="space-y-2">
                <Button
                  v-for="item in navItems"
                  :key="item.path"
                  :variant="currentRoute === item.path ? 'secondary' : 'ghost'"
                  class="w-full justify-start"
                  @click="navigateTo(item.path)"
                >
                  <component :is="item.icon" class="mr-2 h-4 w-4" />
                  {{ item.label }}
                </Button>
              </nav>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <h1 class="text-lg font-semibold">
          {{ navItems.find(item => item.path === currentRoute)?.label || 'maimaidx-prober' }}
        </h1>

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon">
              <Avatar class="h-8 w-8">
                <AvatarFallback>
                  {{ authStore.username.slice(0, 2).toUpperCase() }}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{{ authStore.username }}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="navigateTo('/settings')">
              <Settings class="mr-2 h-4 w-4" />
              设置
            </DropdownMenuItem>
            <DropdownMenuItem v-if="authStore.isLoggedIn" @click="handleLogout">
              <LogOut class="mr-2 h-4 w-4" />
              登出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    <!-- Main Content -->
    <main class="lg:pl-64 pt-16 lg:pt-0">
      <div class="container mx-auto p-6">
        <router-view />
      </div>
    </main>
  </div>
</template>
