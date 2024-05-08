<script setup lang="ts">
import ChuniProSettings from "@/components/proSettings/chuniProSettings.vue";
import {AccordionRoot} from "radix-vue";
import {AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button'
import {useStore} from '@/store';
import {ChuniMusicData, ChuniPlayerData, MaiChartStat, MaiMusicData} from "@/lib/data.ts";

import {
  ColumnDef,
  ColumnFiltersState, createColumnHelper,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table';
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';

import { ArrowUpDown, ChevronDown } from 'lucide-vue-next';

import { h, ref } from 'vue';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {ChuniPlayerBaseRating} from "@/lib/data.ts";

const store = useStore();
const columnHelper = createColumnHelper<ChuniPlayerBaseRating>();

</script>

<template>
<div>
  <div class="flex gap-2 flex-col md:flex-row">
    <Button class="w-full" variant="outline">导出CSV</Button>
    <Button class="w-full" variant="outline">解锁全曲</Button>
  </div>
  <AccordionRoot type="single" class="w-full" collapsible>
    <AccordionItem key="ProSettingsChuni" value="ProSettingsChuni">
      <AccordionTrigger>高级筛选</AccordionTrigger>
      <AccordionContent>
        <ChuniProSettings />
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
  {{store.chuni_data}}
</div>
</template>

<style scoped>

</style>
