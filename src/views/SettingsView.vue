<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AgreementDialog from '@/components/auxiliary/AgreementDialog.vue'
import ProfileDialog from '@/components/auxiliary/ProfileDialog.vue'
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold">个人设置</h1>
      <p class="text-muted-foreground">管理您的账户和偏好设置</p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>个人资料</CardTitle>
        <CardDescription>昵称、Token、隐私设置和密码管理。</CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileDialog />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>账户协议</CardTitle>
        <CardDescription>协议同意状态会在登录后自动检查，也支持手动查看。</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-wrap gap-3">
        <AgreementDialog />
      </CardContent>
    </Card>
  </div>
</template>
