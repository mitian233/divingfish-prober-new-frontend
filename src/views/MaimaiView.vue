<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { toast } from "sonner";
import { useMaimaiStore } from "@/features/maimai/store/maimaiStore";
import { useAuthStore } from "@/stores/auth";
import { mergeOnAllMode } from "@/features/maimai/domain/merge";
import type { MaimaiRecord } from "@/features/maimai/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import ChartTable from "@/features/maimai/components/ChartTable.vue";
import FilterSlider from "@/features/maimai/components/FilterSlider.vue";
import LoginDialog from "@/features/maimai/components/LoginDialog.vue";
import RegisterDialog from "@/features/maimai/components/RegisterDialog.vue";
import ImportDialog from "@/features/maimai/components/ImportDialog.vue";
import ExportDialog from "@/features/maimai/components/ExportDialog.vue";
import EditAchievementDialog from "@/features/maimai/components/EditAchievementDialog.vue";
import CoverDialog from "@/features/maimai/components/CoverDialog.vue";
import UnlockAllDialog from "@/features/maimai/components/UnlockAllDialog.vue";
import CalculatorDialog from "@/features/maimai/components/CalculatorDialog.vue";
import ProSettings from "@/features/maimai/components/ProSettings.vue";
import PlateQualifierDialog from "@/features/maimai/components/PlateQualifierDialog.vue";

const maimaiStore = useMaimaiStore();
const authStore = useAuthStore();

const tab = ref<"sd" | "dx">("sd");
const searchQuery = ref("");
const proSetting = ref(false);
const visibleColumns = ref<string[]>([
  "rank",
  "title",
  "level",
  "ds",
  "achievements",
  "ra",
  "fit_diff",
  "actions",
]);

const filterRef = ref<InstanceType<typeof FilterSlider> | null>(null);
const proSettingsRef = ref<InstanceType<typeof ProSettings> | null>(null);

const showLoginDialog = ref(false);
const showRegisterDialog = ref(false);
const showImportDialog = ref(false);
const showExportDialog = ref(false);
const showUnlockAllDialog = ref(false);
const showEditDialog = ref(false);
const showCoverDialog = ref(false);
const showLogoutConfirm = ref(false);
const showCalculatorDialog = ref(false);
const calculatorRecord = ref<MaimaiRecord | null>(null);

const editingRecord = ref<MaimaiRecord | null>(null);
const coverRecord = ref<MaimaiRecord | null>(null);

const filterValue = ref({ min: 1, max: 15, useDs: false });

const sdData = computed(() => maimaiStore.sdData);
const dxData = computed(() => maimaiStore.dxData);
const sdRa = computed(() => maimaiStore.sdRa);
const dxRa = computed(() => maimaiStore.dxRa);
const totalRa = computed(() => maimaiStore.totalRa);
const isLoggedIn = computed(() => authStore.isLoggedIn);

const sdDisplay = computed(() => {
  return sdData.value.filter((record: MaimaiRecord) => {
    const basicPass = filterRef.value ? filterRef.value.filter(record) : true;
    if (!basicPass) return false;
    if (!proSetting.value) return true;
    return proSettingsRef.value ? proSettingsRef.value.filter(record) : true;
  });
});

const dxDisplay = computed(() => {
  return dxData.value.filter((record: MaimaiRecord) => {
    const basicPass = filterRef.value ? filterRef.value.filter(record) : true;
    if (!basicPass) return false;
    if (!proSetting.value) return true;
    return proSettingsRef.value ? proSettingsRef.value.filter(record) : true;
  });
});

const isFilterActive = computed(() => {
  return (
    sdDisplay.value.length !== sdData.value.length ||
    dxDisplay.value.length !== dxData.value.length
  );
});

const filteredSdRa = computed(() => {
  let sum = 0;
  for (let i = 0; i < Math.min(sdDisplay.value.length, 35); i++) {
    sum += sdDisplay.value[i]?.ra ?? 0;
  }
  return sum;
});

const filteredDxRa = computed(() => {
  let sum = 0;
  for (let i = 0; i < Math.min(dxDisplay.value.length, 15); i++) {
    sum += dxDisplay.value[i]?.ra ?? 0;
  }
  return sum;
});

async function loadData() {
  try {
    await maimaiStore.fetchMusicData();
  } catch (error) {
    console.error("Failed to load music data:", error);
  }

  try {
    const name = await maimaiStore.fetchPlayerRecords();
    if (name) {
      authStore.setUsername(name);
    }
  } catch (error) {
    console.log("No player records");
  }
}

async function handleImport(records: MaimaiRecord[]) {
  maimaiStore.mergeNewRecords(records);

  if (isLoggedIn.value) {
    try {
      await maimaiStore.updateRecords(maimaiStore.records);
    } catch (error) {
      console.error("Failed to sync records:", error);
    }
  }
}

function handleEditRecord(record: MaimaiRecord) {
  editingRecord.value = record;
  showEditDialog.value = true;
}

async function handleSaveRecord(record: MaimaiRecord) {
  await maimaiStore.updateRecord(record);
  toast.success("修改成功");
}

function handleCoverRecord(record: MaimaiRecord) {
  coverRecord.value = record;
  showCoverDialog.value = true;
}

function handleCalculatorRecord(record: MaimaiRecord) {
  calculatorRecord.value = record;
  showCalculatorDialog.value = true;
}

function handleUnlockAll() {
  maimaiStore.records = mergeOnAllMode(
    maimaiStore.records,
    maimaiStore.musicData,
    maimaiStore.musicDataDict,
    maimaiStore.chartStats,
    maimaiStore.chartCombo,
  );
  toast.success("已解锁全曲");
}

function handleLogout() {
  authStore.logout();
  toast.success("已登出");
  showLogoutConfirm.value = false;
  setTimeout(() => window.location.reload(), 1000);
}

function openRegister() {
  showLoginDialog.value = false;
  showRegisterDialog.value = true;
}

function handleColumnsChange(columns: string[]) {
  visibleColumns.value = columns;
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold">舞萌DX</h1>
      <p class="text-muted-foreground">舞萌DX成绩查询与管理</p>
    </div>

    <div class="flex flex-wrap gap-3">
      <Button v-if="!isLoggedIn" @click="showLoginDialog = true"
        >登录并同步数据</Button
      >
      <template v-else>
        <Button variant="outline" @click="showLogoutConfirm = true"
          >登出</Button
        >
      </template>
      <Button variant="outline" @click="showImportDialog = true"
        >导入数据</Button
      >
      <Button variant="outline" @click="showExportDialog = true"
        >导出为 CSV</Button
      >
      <Button
        variant="outline"
        class="text-orange-500"
        @click="showUnlockAllDialog = true"
        >解锁全曲</Button
      >
      <PlateQualifierDialog
        :music-data="maimaiStore.musicData"
        :records="maimaiStore.records"
      />
    </div>

    <Card>
      <CardHeader>
        <CardTitle class="flex items-center justify-between">
          <span>舞萌 DX 成绩表格</span>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <Switch id="pro-setting" v-model="proSetting" />
              <Label for="pro-setting" class="text-sm font-normal"
                >使用高级设置</Label
              >
            </div>
            <Input
              v-model="searchQuery"
              placeholder="查找乐曲"
              class="w-[200px]"
            />
          </div>
        </CardTitle>
        <CardDescription>
          底分: {{ sdRa }} + {{ dxRa }} = {{ totalRa }}
          <span v-if="isFilterActive" class="ml-3 text-orange-500">
            筛选乐曲: {{ filteredSdRa }} + {{ filteredDxRa }} =
            {{ filteredSdRa + filteredDxRa }}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FilterSlider ref="filterRef" v-model="filterValue" />
        <ProSettings
          v-if="proSetting"
          ref="proSettingsRef"
          class="mt-4"
          :music-data="maimaiStore.musicData"
          :music-data-dict="maimaiStore.musicDataDict"
          @columns-change="handleColumnsChange"
        />

        <Tabs v-model="tab" class="mt-4">
          <TabsList>
            <TabsTrigger value="sd">旧乐谱</TabsTrigger>
            <TabsTrigger value="dx">DX 2025</TabsTrigger>
          </TabsList>
          <TabsContent value="sd">
            <ChartTable
              :records="sdDisplay"
              :music-data-dict="maimaiStore.musicDataDict"
              :chart-stats="maimaiStore.chartStats"
              :chart-combo="maimaiStore.chartCombo"
              :loading="maimaiStore.loading"
              :limit="35"
              :search-query="searchQuery"
              :visible-columns="visibleColumns"
              @edit="handleEditRecord"
              @cover="handleCoverRecord"
              @calculator="handleCalculatorRecord"
            />
          </TabsContent>
          <TabsContent value="dx">
            <ChartTable
              :records="dxDisplay"
              :music-data-dict="maimaiStore.musicDataDict"
              :chart-stats="maimaiStore.chartStats"
              :chart-combo="maimaiStore.chartCombo"
              :loading="maimaiStore.loading"
              :limit="15"
              :search-query="searchQuery"
              :visible-columns="visibleColumns"
              @edit="handleEditRecord"
              @cover="handleCoverRecord"
              @calculator="handleCalculatorRecord"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>

    <LoginDialog v-model:open="showLoginDialog" @register="openRegister" />
    <RegisterDialog
      v-model:open="showRegisterDialog"
      :records="maimaiStore.records"
    />
    <ImportDialog
      v-model:open="showImportDialog"
      :music-data="maimaiStore.musicData"
      @import="handleImport"
    />
    <ExportDialog
      v-model:open="showExportDialog"
      :records="maimaiStore.records"
    />
    <EditAchievementDialog
      v-model:open="showEditDialog"
      :record="editingRecord"
      @save="handleSaveRecord"
    />
    <CoverDialog v-model:open="showCoverDialog" :record="coverRecord" />
    <UnlockAllDialog
      v-model:open="showUnlockAllDialog"
      @confirm="handleUnlockAll"
    />
    <CalculatorDialog
      v-model:open="showCalculatorDialog"
      :current-song="calculatorRecord"
      :music-data-dict="maimaiStore.musicDataDict"
    />

    <div
      v-if="showLogoutConfirm"
      class="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    >
      <Card class="w-[400px]">
        <CardHeader>
          <CardTitle>确认</CardTitle>
        </CardHeader>
        <CardContent>
          <p>您确定要登出吗？</p>
        </CardContent>
        <div class="flex justify-end gap-2 p-4">
          <Button variant="outline" @click="showLogoutConfirm = false"
            >取消</Button
          >
          <Button @click="handleLogout">登出</Button>
        </div>
      </Card>
    </div>
  </div>
</template>
