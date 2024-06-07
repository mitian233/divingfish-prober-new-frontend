<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {useStore} from '@/store';
import {ref, reactive, h, computed} from 'vue';
import {DataTableColumn, DataTableBaseColumn, NTag, NTooltip, NumberAnimationInst, useNotification} from 'naive-ui';
import {ChuniMusicData, ChuniPlayerBaseRating} from "@/lib/data.ts";
import { useDialog } from 'naive-ui';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {chuni_fc_filter_items, chuni_rate_filter_items, chuni_level_filter_items} from "@/lib/data.ts";
import {AccordionRoot} from "radix-vue";
import {AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import MaiProSettings from "@/components/proSettings/maiProSettings.vue";

const dialog = useDialog();
const store = useStore();
const notification = useNotification();
const useProSettings = ref<boolean>(false);
const showProSettings = ref<boolean>(false);
const proVersionsSelector = ref<string[]>([]);
const proGenresSelector = ref<string[]>([]);

const sliderValue = ref<number[]>([1,15.5]);
const nowRatingRef = ref<NumberAnimationInst | null>(null);
const bestRatingRef = ref<NumberAnimationInst | null>(null);
const columns: Array<DataTableColumn> = [
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
    render(row: ChuniPlayerBaseRating){
      const divChild = [
        h(NTooltip, {trigger: 'hover'}, {
          default: () => [
            h('p', {innerHTML: 'id: ' + store.chuni_data_dict[row.mid].id}),
            h('p', {innerHTML: 'Artist: ' + store.chuni_data_dict[row.mid].basic_info.artist}),
            h('p', {innerHTML: 'Version: ' + store.chuni_data_dict[row.mid].basic_info.from}),
            h('p', {innerHTML: 'Genre: ' + store.chuni_data_dict[row.mid].basic_info.genre}),
            h('p', {innerHTML: 'BPM: ' + store.chuni_data_dict[row.mid].basic_info.bpm})
          ],
          trigger: () => [
            h('p', {innerHTML: row.title})
          ],
        }),
      ];
      switch(true){
        case row.fc === 'fullcombo':
          divChild.push(h(NTag, {color: {color: '#fff', borderColor: '#5ab55e', textColor: '#5ab55e'}}, {default: () => 'FC'}));
          break;
        case row.fc === 'alljustice':
          divChild.push(h(NTag, {color: {color: '#ffff', borderColor: '#ffa014', textColor: '#ffa014'}}, {default: () => 'AJ'}));
          break;
        case row.fc === 'fullchain':
          divChild.push(h(NTag, {color: {color: '#fff', borderColor: '#ffa014', textColor: '#ffa014'}}, {default: () => 'FULL CHAIN'}));
          break;
        default:
          break;
      };
      return h('div', {class: 'flex flex-row gap-2 items-center'}, divChild)
    },
    sorter: 'default',
  }, {
    title: '难度',
    key: 'level',
    render(row: ChuniPlayerBaseRating){
      const rowData = row;
      const color = getLevel(rowData.level_index);
      return h('div', {class: 'flex flex-row items-center'}, [
        h(NTooltip, {trigger: 'hover'}, {
          default: () => [
            h('p', {innerHTML: 'Charter: ' + store.chuni_data_dict[row.mid].charts[row.level_index].charter}),
            h('p', {innerHTML: 'Combo: ' + store.chuni_data_dict[row.mid].charts[row.level_index].combo}),
          ],
          trigger: () => [
              h(NTag, {color: {color: color.color, borderColor: color.borderColor, textColor: color.textColor}}, {
                default: () => rowData.level_label + ' ' + rowData.level
              })
          ],
        })
      ]);
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
      return h('div', {class: 'flex flex-row gap-2 flex-wrap items-center'}, [
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
  switch (true) {
    case (val < 500000):
      return 'd'
    case (val < 600000):
      return 'c'
    case (val < 700000):
      return 'b'
    case (val < 800000):
      return 'bb'
    case (val < 900000):
      return 'bbb'
    case (val < 925000):
      return 'a'
    case (val < 950000):
      return 'aa'
    case (val < 975000):
      return 'aaa'
    case (val < 990000):
      return 's'
    case (val < 1000000):
      return 's+'
    case (val < 1005000):
      return 'ss'
    case (val < 1007500):
      return 'ss+'
    case (val < 1009000):
      return 'sss'
    default:
      return 'sss+'
  }
};
const getRateLabel = (val: number) => {
  switch (true) {
    case (val < 500000):
      return 'd'
    case (val < 600000):
      return 'c'
    case (val < 700000):
      return 'b'
    case (val < 800000):
      return 'bb'
    case (val < 900000):
      return 'bbb'
    case (val < 925000):
      return 'a'
    case (val < 950000):
      return 'aa'
    case (val < 975000):
      return 'aaa'
    case (val < 990000):
      return 's'
    case (val < 1000000):
      return 'sp'
    case (val < 1005000):
      return 'ss'
    case (val < 1007500):
      return 'ssp'
    case (val < 1009000):
      return 'sss'
    default:
      return 'sssp'
  }
};
</script>

<template>
<div>
  <div class="flex gap-2 flex-col md:flex-row">
    <Button class="w-full" variant="outline">导出CSV</Button>
    <Button class="w-full" variant="outline">解锁全曲</Button>
  </div>
  <div class="grid md:grid-cols-2 items-center my-3">
    <n-statistic label="当前" tabular-nums>
      <template v-slot:prefix>Rating</template>
      <n-number-animation ref="nowRatingRef" :from="0" :to="Number(store.chuni_obj.rating) ? Number(store.chuni_obj.rating.toFixed(4)) : 0" :precision="2" />
    </n-statistic>
    <n-statistic label="最高" tabular-nums>
      <template v-slot:prefix>Rating</template>
      <n-number-animation ref="bestRatingRef" :from="0" :to="Number(store.chuniBestRating.toFixed(4))" :precision="2" />
    </n-statistic>
  </div>
  <div class="flex flex-row items-center">
    <p class="w-[3em]">定数</p>
    <n-slider v-model:value="sliderValue" range :step="0.1" :max="15.5" :min="1" />
  </div>
  <AccordionRoot type="single" class="w-full" collapsible>
    <AccordionItem key="ProSettings" value="ProSettings">
      <AccordionTrigger>高级筛选{{useProSettings? '已启用':''}}</AccordionTrigger>
      <AccordionContent>
        <div>
          <p class="prolabel">启用高级筛选</p>
          <div>
            <Switch :checked="useProSettings" @update:checked="useProSettings = !useProSettings" />
          </div>
        </div>
        <table class="protableprose">
          <tr>
            <td class="prolabel">按连击情况筛选</td>
            <td class="proitem">
              hold
            </td>
          </tr>
          <tr>
            <td class="prolabel">按难度筛选</td>
            <td class="proitem">
              hold
            </td>
          </tr>
          <tr>
            <td class="prolabel">按评级筛选</td>
            <td class="proitem">
              hold
            </td>
          </tr>
        </table>
        <div class="grid md:grid-cols-2 grid-cols-1 gap-2">
          <div>
            <p>版本</p>
            <n-select v-model:value="proVersionsSelector" :options="store.chuniVersionsItems" />
          </div>
          <div>
            <p>歌曲类别</p>
            <n-select  v-model:value="proGenresSelector" :options="store.chuniGenresItems" />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
  <n-data-table :data="store.chuni_records" :columns="columns" :pagination="tablePagination" :scroll-x="720" />
  <p class="my-2 text-right">总计 {{store.chuni_records.length}} 条数据</p>
</div>
</template>

<style scoped>
.protableprose {
  @apply w-full
}
.protableprose tr .prolabel {
  @apply w-1/3 text-left
}
.protableprose tr .proitem {
  @apply text-left
}
</style>
