<script setup lang="ts">
import ChuniProSettings from "@/components/proSettings/chuniProSettings.vue";
import {AccordionRoot} from "radix-vue";
import {AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button'
import {useStore} from '@/store';
import {reactive, h} from 'vue';
import {DataTableColumn, DataTableBaseColumn, NTag, useNotification} from 'naive-ui';
import {ChuniPlayerBaseRating} from "@/lib/data.ts";

const notification = useNotification()
const store = useStore();
const columns: DataTableColumn[] = [
  {
    title: '排名',
    key: 'rank',
    sorter: 'default',
    render(row: ChuniPlayerBaseRating | any){
      const rank = row.rank;
      if(rank < 0){
        return h('p', {style: {color: '#29c5d8'}, innerHTML: 'R' + (11 + rank).toString()});
      } else {
        return h('p', {innerHTML: rank.toString()});
      }
    }
  }, {
    title: '乐曲名',
    key: 'title',
    sorter: 'default',
  }, {
    title: '难度',
    key: 'level',
    render(row: ChuniPlayerBaseRating){
      const rowData = row;
      const color = getLevel(rowData.level_index);
      return h(NTag, {color: {color: color.color, borderColor: color.borderColor, textColor: color.textColor}}, {
        default: () => rowData.level_label + rowData.level
      });
    },
    sorter: 'default',
  }, {
    title: '定数',
    key: 'ds',
    sorter: 'default',
  }, {
    title: '分数',
    key: 'score',
    render(rowData: ChuniPlayerBaseRating) {
      const rate = getRate(rowData.score);
      const rateColor = getRateColor(rate);
      return h('div', {class: 'flex flex-row gap-2'}, [
        h('p', {innerHTML: rowData.score}),
        h(NTag, {color: {borderColor: rateColor, textColor: rateColor}}, {default: () => rate.toUpperCase()})
      ])
    },
    sorter: 'default',
  }, {
    title: 'Rating',
    key: 'ra',
    sorter: 'default',
  }
]
const tablePagination = reactive({
  page: 1,
  pageSize: 40,
  showSizePicker: true,
  pageSizes: [40, 50, 70],
  onChange: (page: number) => {
    tablePagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    tablePagination.pageSize = pageSize
    tablePagination.page = 1
  }
})
const getLevel = (index: number) => {
  return [
    {
      color: '#e7f5ee',
      textColor: '#18a058',
      borderColor: '#a8dbc1'
    }, {
      color: '#fdf3e4',
      textColor: '#f0a020',
      borderColor: '#f9d69f'
    }, {
      color: '#fbeff1',
      textColor: '#d03050',
      borderColor: '#f1c3cc'
    }, {
      color: '#eee3ff',
      textColor: '#a654e4',
      borderColor: '#da88ff'
    }, {
      color: '#fafafc',
      textColor: '#333639',
      borderColor: '#e0e0e6'
    }, {
      color: '#e8f2fd',
      textColor: '#2080f0',
      borderColor: '#acd0f9'
    }][index];
};

const getRateColor = (str: string) => {
  if (str.startsWith("sss")) return "#f44336";
  if (str.startsWith("ss")) return "#1e88e5";
  if (str.startsWith("s")) return "#ffa000";
  return "";
};
const getRate = (val: number) => {
  if (val < 500000) {
    return 'd'
  } else if (val < 600000) {
    return 'c'
  } else if (val < 700000) {
    return 'b'
  } else if (val < 800000) {
    return 'bb'
  } else if (val < 900000) {
    return 'bbb'
  } else if (val < 925000) {
    return 'a'
  } else if (val < 950000) {
    return 'aa'
  } else if (val < 975000) {
    return 'aaa'
  } else if (val < 990000) {
    return 's'
  } else if (val < 1000000) {
    return 's+'
  } else if (val < 1005000) {
    return 'ss'
  } else if (val < 1007500) {
    return 'ss+'
  } else if (val < 1009000) {
    return 'sss'
  } else {
    return 'sss+'
  }
};

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
  <n-data-table :data="store.chuni_records" :columns="columns" :pagination="tablePagination" />
</div>
</template>

<style scoped>

</style>
