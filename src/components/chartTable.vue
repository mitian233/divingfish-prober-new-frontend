<script setup lang="ts">
import {ref, reactive, h, onMounted} from 'vue';
import MaiProSettings from "@/components/proSettings/maiProSettings.vue";
import { useStore } from '@/store';
import {AccordionRoot} from "radix-vue";
import {AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button'
import {DataTableColumn, NTag, NTooltip} from 'naive-ui';
import {computedMaiRecord, MaiPlayerRecord} from "@/lib/data.ts";

const store = useStore();
const proVersionsSelector = ref<string[]>([]);
const proGenresSelector = ref<string[]>([]);

const sliderValue = ref<number[]>([1,15]);

const columns: DataTableColumn[] = [
  {
    title: '排名',
    key: 'rank',
    sorter: 'default',
    render(row: computedMaiRecord | any, _rowIndex: number){
      return h('span', row.rank);
    }
  },
  {
    title: '乐曲名',
    key: 'title',
    sorter: 'default',
    render(row: computedMaiRecord, _rowIndex: number){
      const mai_music = store.music_data_dict[row.song_id];
      return h('div', {class: 'flex flex-row'}, [
        mai_music.type === "DX" ? h(NTag, {
          class: 'mr-1',
          innerHTML: 'DX',
          size: 'small',
          color: {
            color: "#1976d2",
            borderColor: '#acd0f9',
            textColor: '#fff'
        }}) : undefined,
        h(NTooltip, {trigger: 'hover'}, {
          default: () => [
            h('p', {innerHTML: `id: ${row.song_id}`}),
            h('p', {innerHTML: `Artist: ${mai_music.basic_info.artist}`}),
            h('p', {innerHTML: `Version: ${mai_music.basic_info.from}`}),
            h('p', {innerHTML: `Genre: ${mai_music.basic_info.genre}`}),
            h('p', {innerHTML: `BPM: ${mai_music.basic_info.bpm}`})
          ],
          trigger: () => h('span', {innerHTML: row.title}),
        }),
        row.fc.length !== 0 ? h(NTag, {
          class: 'mx-1',
          innerHTML: getName(row.fc),
          size: 'small',
          color: {
            color: getFCColor(row.fc),
            textColor: '#fff'
          }}): undefined,
        row.fs.length !== 0 ? h(NTag, {
          class: 'mx-1',
          innerHTML: getName(row.fs),
          size: 'small',
          color: {
            color: getFSColor(row.fs),
            textColor: '#fff'
          }}): undefined
      ])
    }
  },
  {
    title: '难度',
    key: 'level',
    sorter: 'default',
    render(row: computedMaiRecord, _rowIndex: number){
      const mai_music = store.music_data_dict[row.song_id];
      const color = getLevel(row.level_index);
      return h('div', {class: 'flex flex-row'}, [
        h(NTooltip, {trigger: 'hover'}, {
          default: () => [
            h('p', {innerHTML: 'Charter: ' + mai_music.charts[row.level_index].charter}),
            // todo: notes: number[5]
            // h('p', {innerHTML: 'Combo: ' + mai_music.charts[row.level_index].notes}),
          ],
          trigger: () => h(NTag, {color: {color: color.color, borderColor: color.borderColor, textColor: color.textColor}}, {
            default: () => row.level_label + ' ' + row.level
          }),
        })
      ]);
    }
  },
  {
    title: '定数',
    key: 'ds',
    sorter: 'default'
  },
  {
    title: '达成率',
    key: 'achievements',
    sorter: 'default',
    render(row: computedMaiRecord, _rowIndex: number){
      const rate = getRateString(row.achievements);
      const rateColor = getRateColor(rate);
      return h('div', {class: 'flex flex-row gap-2 flex-wrap'}, [
        h('p', {innerHTML: `${row.achievements.toFixed(4)}%`}),
        h(NTag, {
          color: {borderColor: rateColor, textColor: rateColor}
        }, {default: () => rate.toUpperCase()})
      ])
    }
  },
  {
    title: 'DX Rating',
    key: 'ra',
    sorter: 'default',
  }
]

const tablePagination = reactive({
  page: 1,
  pageSize: 40,
  showSizePicker: false,
  pageSizes: [40, 50, 60, 70, 80, 90, 100],
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
    { // basic
      color: '#e7f5ee',
      textColor: '#22bb5b',
      borderColor: '#a8dbc1'
    }, { // advanced
      color: '#fdf3e4',
      textColor: '#fb9c2d',
      borderColor: '#f9d69f'
    }, {  // expert
      color: '#fbeff1',
      textColor: '#f64861',
      borderColor: '#f1c3cc'
    }, {  // master
      color: '#eee3ff',
      textColor: '#9e45e2',
      borderColor: '#da88ff'
    }, {  // re:master
      color: '#fafafc',
      textColor: '#ba67f8',
      borderColor: '#e0e0e6'
    }, {  // utage
      color: '#e8f2fd',
      textColor: '#ff70ff',
      borderColor: '#f0c7f6'
    }][index];
}

const getRateColor = (str: string) => {
  if (str.startsWith("sss+")) return "red";
  if (str.startsWith("sss")) return "blue";  // darken-1
  if (str.startsWith("ss+")) return "amber";  // darken-2
  return "";
};

const getRateString = (achievement: number) => {
  let rate;
  if (achievement < 50) {
    rate = "d";
  } else if (achievement < 60) {
    rate = "c";
  } else if (achievement < 70) {
    rate = "b";
  } else if (achievement < 75) {
    rate = "bb";
  } else if (achievement < 80) {
    rate = "bbb";
  } else if (achievement < 90) {
    rate = "a";
  } else if (achievement < 94) {
    rate = "aa";
  } else if (achievement < 97) {
    rate = "aaa";
  } else if (achievement < 98) {
    rate = "s";
  } else if (achievement < 99) {
    rate = "s+";
  } else if (achievement < 99.5) {
    rate = "ss";
  } else if (achievement < 100) {
    rate = "ss+";
  } else if (achievement < 100.5) {
    rate = "sss";
  } else {
    rate = "sss+";
  }
  return rate;
}

const getName = (str: string) => {
  const map: { [key: string]: string} = {
    fc: "FC",
    fcp: "FC+",
    sync: "SYNC",
    fs: "FS",
    fsp: "FS+",
    fsd: "FSDX",
    fsdp: "FSDX+",
    ap: "AP",
    app: "AP+",
  };
  return map[str];
}

const getFCColor = (str: string) => str.startsWith("fc") ? "green" : "orange"

const getFSColor = (str: string) => str.startsWith("fsd") ? "orange" : "blue"

const computeSelectItems = (items: string[]) => {
  return items.map((elem: string) => {
    return {
      label: elem,
      value: elem,
    }
  })
}
</script>

<template>
<div>
  <div class="flex gap-2 flex-col md:flex-row">
    <Button class="w-full" variant="outline">导出CSV</Button>
    <Button class="w-full" variant="outline">解锁全曲</Button>
  </div>
  <div class="grid md:grid-cols-3 items-center my-3">
    <n-statistic label="总 DX Rating" tabular-nums>
      <template v-slot:prefix></template>
      <n-number-animation ref="dxRatingRef" :from="0" :to="store.currentAchievements" />
    </n-statistic>
    <n-statistic label="当前" tabular-nums>
      <template v-slot:prefix>底分</template>
      <n-number-animation ref="dxRatingRef" :from="0" :to="store.dxRa" />
    </n-statistic>
    <n-statistic label="旧曲目" tabular-nums>
      <template v-slot:prefix>底分</template>
      <n-number-animation ref="sdRatingRef" :from="0" :to="store.sdRa" />
    </n-statistic>
  </div>
  <div class="flex flex-row items-center">
    <p class="w-[4.5em]">等级</p>
    <n-slider v-model:value="sliderValue" range :step="1" :max="15" :min="1" />
  </div>
  <AccordionRoot type="single" class="w-full" collapsible>
    <AccordionItem key="ProSettings" value="ProSettings">
      <AccordionTrigger>高级筛选</AccordionTrigger>
      <AccordionContent>
        <MaiProSettings />
        <div class="grid md:grid-cols-2 grid-cols-1 gap-2">
          <div>
            <p>版本</p>
            <n-select v-model:value="proVersionsSelector" :options="computeSelectItems(store.maimaiVersions)" />
          </div>
          <div>
            <p>歌曲类别</p>
            <n-select  v-model:value="proGenresSelector" :options="computeSelectItems(store.maimaiGenres)" />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
  <n-tabs type="line" default-value="dx">
    <n-tab-pane name="sd" tab="旧乐谱">
      <n-data-table :data="store.sdData"
                    :columns="columns"
                    :scroll-x="720"
                    :pagination="tablePagination"
      >
        <template #empty>
          <n-empty>去多打几把舞萌DX吧！或按照<n-a href="https://www.diving-fish.com/maimaidx/prober_guide" target="_blank">查分器使用指南</n-a>先导入分数再试试。</n-empty>
        </template>
      </n-data-table>
    </n-tab-pane>
    <n-tab-pane name="dx" tab="DX 2024">
      <n-data-table :data="store.dxData"
                    :columns="columns"
                    :scroll-x="720"
                    :pagination="tablePagination"
      >
        <template #empty>
          <n-empty>去多打几把舞萌DX吧！或按照<n-a href="https://www.diving-fish.com/maimaidx/prober_guide" target="_blank">查分器使用指南</n-a>先导入分数再试试。</n-empty>
        </template>
      </n-data-table>
    </n-tab-pane>
  </n-tabs>
</div>
</template>

<style scoped>
</style>
