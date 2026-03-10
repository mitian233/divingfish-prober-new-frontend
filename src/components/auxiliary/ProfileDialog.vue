<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue'
import api from '@/lib/api'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const authStore = useAuthStore()

interface ProfileResponse {
  username: string
  privacy: boolean
  mask: boolean
  bind_qq: string
  qq_channel_uid: string
  import_token: string
  additional_rating: number
  nickname: string
}

const open = shallowRef(false)
const loading = shallowRef(false)
const saving = shallowRef(false)
const changePwdOpen = shallowRef(false)
const deleteOpen = shallowRef(false)
const generating = shallowRef(false)

const username = shallowRef('')
const nickname = shallowRef('')
const bindQQ = shallowRef('')
const qqChannelUid = shallowRef('')
const importToken = shallowRef('')
const privacy = shallowRef(false)
const mask = shallowRef(false)
const additionalRating = shallowRef(0)
const password = shallowRef('')
const passwordConfirm = shallowRef('')

const ratings = [
  { label: '初学者', ra: 0 }, { label: '初段', ra: 1 }, { label: '二段', ra: 2 }, { label: '三段', ra: 3 },
  { label: '四段', ra: 4 }, { label: '五段', ra: 5 }, { label: '六段', ra: 6 }, { label: '七段', ra: 7 },
  { label: '八段', ra: 8 }, { label: '九段', ra: 9 }, { label: '十段', ra: 10 }, { label: '真初段', ra: 11 },
  { label: '真二段', ra: 12 }, { label: '真三段', ra: 13 }, { label: '真四段', ra: 14 }, { label: '真五段', ra: 15 },
  { label: '真六段', ra: 16 }, { label: '真七段', ra: 17 }, { label: '真八段', ra: 18 }, { label: '真九段', ra: 19 },
  { label: '真十段', ra: 20 }, { label: '真皆传', ra: 21 }, { label: '里皆传', ra: 22 },
]

const isLoggedIn = computed(() => authStore.isLoggedIn)

async function fetchProfile() {
  if (!isLoggedIn.value) return
  loading.value = true
  try {
    const resp = await api.get('/maimaidxprober/player/profile') as ProfileResponse
    username.value = resp.username
    nickname.value = resp.nickname || ''
    bindQQ.value = resp.bind_qq || ''
    qqChannelUid.value = resp.qq_channel_uid || ''
    importToken.value = resp.import_token || ''
    privacy.value = !!resp.privacy
    mask.value = !!resp.mask
    additionalRating.value = Number(resp.additional_rating || 0)
  } finally {
    loading.value = false
  }
}

async function saveProfile() {
  if (!isLoggedIn.value) return
  if (!nickname.value.trim()) {
    toast.error('昵称不能为空')
    return
  }
  if (nickname.value.length > 8) {
    toast.error('昵称不能超过 8 个字符')
    return
  }
  saving.value = true
  try {
    const resp = await api.post('/maimaidxprober/player/profile', {
      username: username.value || authStore.username,
      privacy: privacy.value,
      mask: mask.value,
      bind_qq: bindQQ.value.trim(),
      additional_rating: additionalRating.value,
      nickname: nickname.value.trim(),
      qq_channel_uid: qqChannelUid.value.trim(),
    }) as ProfileResponse
    username.value = resp.username
    importToken.value = resp.import_token || importToken.value
    toast.success('资料已保存')
    open.value = false
  } finally {
    saving.value = false
  }
}

async function generateToken() {
  generating.value = true
  try {
    const resp = await api.put('/maimaidxprober/player/import_token') as { token?: string }
    importToken.value = resp.token || importToken.value
    toast.success('已生成新的导入 Token')
  } finally {
    generating.value = false
  }
}

async function deleteRecords() {
  try {
    await Promise.all([
      api.delete('/maimaidxprober/player/delete_records'),
      api.delete('/chunithmprober/player/delete_records'),
    ])
    toast.success('已删除舞萌与中二数据')
    deleteOpen.value = false
  } catch {
    // handled by interceptor
  }
}

async function changePassword() {
  if (!password.value || password.value !== passwordConfirm.value) {
    toast.error('请确认两次密码输入一致')
    return
  }
  try {
    await api.post('/maimaidxprober/player/change_password', { password: password.value })
    toast.success('密码已修改')
    changePwdOpen.value = false
    password.value = ''
    passwordConfirm.value = ''
  } catch {
    // handled by interceptor
  }
}

async function copyToken() {
  if (!importToken.value) return
  try {
    await navigator.clipboard.writeText(importToken.value)
    toast.success('Token 已复制')
  } catch {
    toast.error('复制失败')
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>个人资料</CardTitle>
      <CardDescription>登录后可编辑昵称、隐私设置、导入 Token 等。</CardDescription>
    </CardHeader>
    <CardContent class="flex items-center gap-3">
      <Dialog v-model:open="open">
        <DialogTrigger as-child>
          <Button :disabled="!isLoggedIn">编辑个人资料</Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>个人资料</DialogTitle>
          </DialogHeader>
          <div class="space-y-4">
            <p v-if="loading" class="text-sm text-muted-foreground">加载中...</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="profile-nick">昵称</Label>
                <Input id="profile-nick" v-model="nickname" maxlength="8" />
              </div>
              <div class="space-y-2">
                <Label>段位</Label>
                <Select v-model="additionalRating">
                  <SelectTrigger><SelectValue placeholder="选择段位" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="item in ratings" :key="item.ra" :value="item.ra">{{ item.label }}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <Label for="profile-qq">绑定 QQ</Label>
                <Input id="profile-qq" v-model="bindQQ" />
              </div>
              <div class="space-y-2">
                <Label for="profile-channel">频道 UID</Label>
                <Input id="profile-channel" v-model="qqChannelUid" />
              </div>
            </div>

            <div class="space-y-2">
              <Label>成绩导入 Token</Label>
              <div class="flex gap-2">
                <Input :model-value="importToken" readonly />
                <Button variant="outline" :disabled="generating" @click="generateToken">刷新</Button>
                <Button variant="outline" @click="copyToken">复制</Button>
              </div>
            </div>

            <div class="flex flex-wrap gap-6">
              <label class="flex items-center gap-2">
                <Checkbox v-model:checked="privacy" />
                <span class="text-sm">禁止其他人查询我的成绩</span>
              </label>
              <label class="flex items-center gap-2">
                <Checkbox v-model:checked="mask" />
                <span class="text-sm">对非网页查询使用掩码</span>
              </label>
            </div>
          </div>
          <DialogFooter class="gap-2">
            <Dialog v-model:open="changePwdOpen">
              <DialogTrigger as-child>
                <Button variant="outline">更改密码</Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-[420px]">
                <DialogHeader><DialogTitle>更改密码</DialogTitle></DialogHeader>
                <div class="space-y-3">
                  <Input v-model="password" type="password" placeholder="新密码" />
                  <Input v-model="passwordConfirm" type="password" placeholder="确认密码" />
                </div>
                <DialogFooter>
                  <Button variant="outline" @click="changePwdOpen = false">取消</Button>
                  <Button @click="changePassword">确定</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog v-model:open="deleteOpen">
              <DialogTrigger as-child>
                <Button variant="destructive">删除所有数据</Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-[420px]">
                <DialogHeader><DialogTitle>删除数据确认</DialogTitle></DialogHeader>
                <p class="text-sm text-muted-foreground">会删除舞萌与中二成绩数据，仍可后续导入恢复。</p>
                <DialogFooter>
                  <Button variant="outline" @click="deleteOpen = false">取消</Button>
                  <Button variant="destructive" @click="deleteRecords">确认删除</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" @click="open = false">取消</Button>
            <Button :disabled="saving" @click="saveProfile">{{ saving ? '保存中...' : '保存' }}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <p v-if="!isLoggedIn" class="text-sm text-muted-foreground">请先登录后编辑个人资料。</p>
    </CardContent>
  </Card>
</template>
